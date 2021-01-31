import { Group } from "../base/object";

class HierarchyNode extends Group {
  static speed = 400;
  static width = 1000;
  static height = 500;
  /** [w, h] 单元格最小宽高 */
  static minCell = [0, 0]
  static tempAnimCount = 0;
  static animCount = 0;
  static onFinish = [];
  static addCount(): void

  _leafs: HierarchyNode[];
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

  branch: HierarchyNode | null;

  set proportion(p: [x: number, y: number])

  get proportion(): { x: number, y: number }

  addLeaf(node: HierarchyNode, idx: number): void

  removeLeaf(node: HierarchyNode): void
}

export const setHierarchyNodeAnimSpeed: (v: number) => void;

export class LeafNode extends HierarchyNode {
  radius = 50;
  lineWidth = 2
  borderWidth = 5;
  borderColor = "#546fc6";
  fillColor = "#ffffff";
  textColor = "#303133";

  key = ""

  constructor(key: string, args: any)

  setKey(key: string): void;

  flag(color: string, onFinish: () => void): void

  render({ ctx }): void
}

export class ForestPlot extends HierarchyNode {
  set proportion(p: [x: number, y: number]): void

  moveLeaf(leaf: HierarchyNode, newBranch: HierarchyNode, idx: number, onFinish: () => void): void;

  addTree(root: HierarchyNode, onFinish: () => void): void;

  destroyTree(root?: HierarchyNode): void;

  /** Reingold-Tilford 算法 */
  updateLayout(onFinish: () => void): void

  setDimensions(d: { width: number, height: number }, onFinish: () => void): void;
}

function getContour(root: HierarchyNode, val: number, func: Function): number;

function shiftDown(root: HierarchyNode, shiftValue: number): void;

function calculateInitialValues(node: HierarchyNode, level: number, prevSibling: HierarchyNode?): void;

function calculateFinalValues(node: HierarchyNode, modSum = 0): void;

function updateYVals(root: HierarchyNode): void;

function fixNodeConflicts(root: HierarchyNode): void;

function assignSiblingCounts(root: HierarchyNode): void;

function getDimensions(root: HierarchyNode): void;

function normalize(root: HierarchyNode, maxX: number, maxY: number): void;