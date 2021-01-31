import { AnimProvider } from "../base/anim.js";
import { Group } from "../base/object.js";
import { Circle, SenkiText } from "../base/shape.js";

class HierarchyNode extends Group {
  static speed = 400;
  static width = 1000;
  static height = 500;
  static minCell = [0, 0] // [w, h] 单元格最小宽高
  static tempAnimCount = 0;
  static animCount = 0;
  static onFinish = [];
  static addCount() {
    this.animCount++;
    if (this.onFinish[0]) {
      if (this.onFinish[0].count === this.animCount) {
        this.onFinish.shift().fn();
      }
    }
  }

  _leafs = [];
  _layout = {
    x: 0,
    y: 0,
    modifier: 0,
    siblings: 0,
    finalX: 0,
    prevSibling: null,
    newProportion: {
      x: 0,
      y: 0,
    },
    oldProportion: {
      x: 0,
      y: 0,
    },
  };

  branch = null;

  set proportion([x, y]) {
    this._layout.oldProportion = this.proportion;
    this._layout.newProportion = { x, y };
    HierarchyNode.tempAnimCount++;
    this.useAnimProvider(
      "x",
      new AnimProvider({
        from: this.position.x,
        to: this.proportion.x * HierarchyNode.width,
        duration: HierarchyNode.speed,
      }, () => {
        HierarchyNode.addCount();
      })
    );
    HierarchyNode.tempAnimCount++;
    this.useAnimProvider(
      "y",
      new AnimProvider({
        from: this.position.y,
        to: this.proportion.y * HierarchyNode.height,
        duration: HierarchyNode.speed,
      }, () => {
        HierarchyNode.addCount();
      })
    );
  }

  get proportion() {
    return this._layout.newProportion;
  }

  addLeaf(node, idx) {
    node.branch = this
    if (idx > this._leafs.length || idx < 0)
      this._leafs.push(node)
    else
      this._leafs.splice(idx, 0, node)
  }

  removeLeaf(node) {
    node.branch = null
    let idx = this._leafs.indexOf(node)
    if (idx !== -1) this._leafs.splice(idx, 1)
  }
}

export const setHierarchyNodeAnimSpeed = (v) => {
  HierarchyNode.speed = v;
};

export class LeafNode extends HierarchyNode {
  radius = 50;
  lineWidth = 2
  borderWidth = 5;
  borderColor = "#546fc6";
  fillColor = "#ffffff";
  textColor = "#303133";

  key = ""

  constructor(key, args) {
    super();
    this.key = key
    Object.assign(this, args);
    this.borderWidth *= 2
    this.add(new Circle({ radius: this.radius, fillColor: this.fillColor, borderColor: this.borderColor, borderWidth: this.borderWidth }))
    this.add(new SenkiText({ content: this.key, color: this.textColor }, 0, -7));
  }

  setKey(key) {
    this.key = key
    this.children[1].content = key
  }

  flag(color, onFinish) {
    let oldColor = this.borderColor

    this.borderColor = color
    this.children[0].borderColor = color

    if (onFinish) onFinish();

    return () => {
      this.borderColor = oldColor
      this.children[0].borderColor = oldColor
    }
  }
}

export class ForestPlot extends HierarchyNode {
  borderColor = "#909399";
  lineWidth = 2

  set proportion([x, y]) {
    this._layout.oldProportion = this.proportion;
    this._layout.newProportion = { x, y };
  }

  moveLeaf(leaf, newBranch, idx, onFinish) {
    let oldBranch = leaf.branch
    if (oldBranch) oldBranch.removeLeaf(leaf);
    if (newBranch) newBranch.addLeaf(leaf, idx);
    if (!newBranch) this.destroyTree(leaf)
    this.updateLayout(onFinish);
  }

  addTree(root, onFinish) {
    this.add(root)
    this.moveLeaf(root, this, this._leafs.length, onFinish);
  }

  destroyTree(root = this) {
    this.removeChild(root)
    for (const leaf of root._leafs) {
      this.destroyTree(leaf)
      this.removeLeaf(leaf)
    }
  }

  /** Reingold-Tilford 算法 */
  updateLayout(onFinish) {
    calculateInitialValues(this);
    calculateFinalValues(this);
    updateYVals(this);
    fixNodeConflicts(this);
    assignSiblingCounts(this);
    normalize(this, ...getDimensions(this));
    if (HierarchyNode.tempAnimCount === HierarchyNode.animCount) onFinish()
    else HierarchyNode.onFinish.push({ count: HierarchyNode.tempAnimCount, fn: onFinish })
  }

  setDimensions({ width, height }, onFinish) {
    HierarchyNode.width = width
    HierarchyNode.height = height
    this.updateLayout(onFinish);
  }

  render({ ctx }) {
    for (const tree of this.children) {
      for (const leaf of tree._leafs) {
        ctx.save();

        ctx.strokeWidth = this.lineWidth;
        ctx.strokeStyle = this.borderColor;

        ctx.beginPath();
        ctx.moveTo(tree.abs.x, tree.abs.y);
        ctx.lineTo(leaf.abs.x, leaf.abs.y);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
      }
    }
    super.render({ ctx });
  }
}

function getContour(root, val, func) {
  let nodes = [root];
  while (nodes.length) {
    let node = nodes.shift();
    nodes = nodes.concat(node._leafs);
    val = func(val, node._layout.finalX);
  }
  return val;
}

function shiftDown(root, shiftValue) {
  let nodes = [root];
  while (nodes.length) {
    let node = nodes.shift();
    nodes = nodes.concat(node._leafs);
    node._layout.finalX += shiftValue;
  }
}

function calculateInitialValues(node, level = 0, prevSibling = null) {
  node._layout.y = level;
  node._layout.prevSibling = prevSibling;
  for (let i = 0; i < node._leafs.length; i++) {
    calculateInitialValues(node._leafs[i], level + 1, node._leafs[i - 1]);
  }

  if (node._layout.prevSibling) {
    node._layout.x = node._layout.prevSibling._layout.x + 3;
  } else {
    node._layout.x = 0;
  }

  if (node._leafs.length === 1) {
    node._layout.modifier = node._layout.x;
  } else if (node._leafs.length >= 2) {
    let minY = Infinity;
    let maxY = -minY;
    for (let i = 0; i < node._leafs.length; i++) {
      minY = Math.min(minY, node._leafs[i]._layout.x);
      maxY = Math.max(maxY, node._leafs[i]._layout.x);
    }
    node._layout.modifier = node._layout.x - (maxY - minY) / 2;
  }
}

function calculateFinalValues(node, modSum = 0) {
  node._layout.finalX = node._layout.x + modSum;
  for (let i = 0; i < node._leafs.length; i++) {
    calculateFinalValues(node._leafs[i], node._layout.modifier + modSum);
  }
}

function updateYVals(root) {
  let minYVal = Infinity;
  let nodes = [root];
  while (nodes.length) {
    let node = nodes.shift();
    nodes = nodes.concat(node._leafs);
    if (node._layout.finalX < minYVal) {
      minYVal = node._layout.finalX;
    }
  }

  nodes = [root];
  while (nodes.length) {
    let node = nodes.shift();
    nodes = nodes.concat(node._leafs);
    node._layout.finalX += Math.abs(minYVal);
  }
}

function fixNodeConflicts(root) {
  for (let i = 0; i < root._leafs.length; i++) {
    fixNodeConflicts(root._leafs[i]);
  }

  for (let i = 0; i < root._leafs.length - 1; i++) {
    // Get the bottom-most contour position of the current node
    let botContour = getContour(root._leafs[i], -Infinity, Math.max);

    // Get the topmost contour position of the node underneath the current one
    let topContour = getContour(root._leafs[i + 1], Infinity, Math.min);

    if (botContour >= topContour) {
      shiftDown(root._leafs[i + 1], botContour - topContour + 3);
    }
  }
}

function assignSiblingCounts(root) {
  let nodes = [root, null];
  let level = [];

  let siblings = 0;
  while (nodes.length) {
    let node = nodes.shift();
    if (!node) {
      for (let i = 0; i < level.length; i++) {
        level[i]._layout.siblings = siblings;
      }
      level = [];
      siblings = 0;
      if (nodes.length) {
        nodes.push(null);
      }
    } else {
      nodes = nodes.concat(node._leafs);
      siblings++;
      level.push(node);
    }
  }
}

function getDimensions(root) {
  let minWidth = Infinity;
  let maxWidth = -minWidth;

  let minHeight = Infinity;
  let maxHeight = -minWidth;

  let nodes = [root];
  while (nodes.length) {
    let node = nodes.shift();
    nodes = nodes.concat(node._leafs);

    if (node._layout.y < minWidth) {
      minWidth = node._layout.y;
    }

    if (node._layout.y > maxWidth) {
      maxWidth = node._layout.y;
    }

    if (node._layout.finalX < minHeight) {
      minHeight = node._layout.finalX;
    }

    if (node._layout.finalX > maxHeight) {
      maxHeight = node._layout.finalX;
    }
  }

  return [maxHeight - minHeight, maxWidth - minWidth];
}

function normalize(root, maxX, maxY) {
  // if (minDivisorX) HierarchyNode.maxNum = [(maxX + 3) / minDivisorX, (maxY + 1)]
  root.proportion = [(root._layout.finalX + 3) / (maxX + 6), 1 - root._layout.y / (maxY + 1)];
  for (const leaf of root._leafs) normalize(leaf, maxX, maxY);
}
