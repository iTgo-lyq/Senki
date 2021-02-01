import Scheduler from "../base/scheduler.js";
import { ForestPlot, LeafNode, setHierarchyNodeAnimSpeed } from "../components/ForestPlot.js";

class SenkiLinkedNode {
  static senkiForest = new ForestPlot();
  static scheduler = new Scheduler([
    { num: 0, resolve: () => setHierarchyNodeAnimSpeed(400) },
    { num: 4, resolve: () => setHierarchyNodeAnimSpeed(300) },
    { num: 10, resolve: () => setHierarchyNodeAnimSpeed(200) },
    { num: 20, resolve: () => setHierarchyNodeAnimSpeed(100) },
    { num: 50, resolve: () => setHierarchyNodeAnimSpeed(50) },
  ]);
  static config = {
    radius: 30,
    borderWidth: 6,
    borderColor: "#546fc6",
    fillColor: "#ffffff",
  }

  static resetSenkiForest() {
    this.senkiForest = new ForestPlot();
  }

  static setCanvasDimensions(obj) {
    SenkiLinkedNode.scheduler.push((next) => {
      SenkiLinkedNode.senkiForest.setDimensions(obj, next)
    })
  }

  _senkiLeaf = null;

  _childs = [];
  _left = null;
  _right = null;
  _parent = null;

  constructor(key, data) {
    this.key = key;
    this.data = data || key;
    this._senkiLeaf = new LeafNode(key, SenkiLinkedNode.config);
    SenkiLinkedNode.scheduler.push((next) => {
      this.identify = SenkiLinkedNode.senkiForest.addTree(this._senkiLeaf, next)
    })
  }

  setKey(v) {
    this.key = v;
    SenkiLinkedNode.scheduler.push((next) => {
      this._senkiLeaf.setKey(v)
      next();
    });
  }

  flag(color) {
    if (!/^#([0-9a-fA-F]{6})$/.test(color))
      return console.warn("please provide a color value like #aabbcc.");

    let retFn;

    SenkiLinkedNode.scheduler.push((next) => retFn = this._senkiLeaf.flag(color, next));

    return () => {
      SenkiLinkedNode.scheduler.push((next) => {
        retFn();
        next();
      });
    };
  }

  getChild(idx) {
    if (idx < 0 || idx >= this._childs.length)
      return console.warn("a out-of-bounds index in child array.");

    return this._childs[idx];
  }


  addChild(n, idx = 0) {
    if (idx < 0 || idx > this._childs.length)
      return console.warn("a out-of-bounds index in child array.");

    this._childs.splice(idx, 0, n)
    n.parent = [idx, this];
    return this.length;
  }

  removeChild(v) {
    if (v instanceof SenkiLinkedNode) {
      return this.removeChild(this._childs.indexOf(v))
    }

    if (typeof v === "number") {
      if (v === -1) return null;
      let ret = this._childs[v]
      this._childs[v].parent = [-1, null]
      return ret;
    }
  }

  destroy() {
    this.parent = [-1, null, true]
  }

  /**
   * 会从原本的父节点移动到新的父节点下
   * 除了构造函数外，
   * 修改对应图形节点的唯一函数
   * 真正会触发动画的唯一函数 
   * 原则上一次动作，只设置一次parent
  */
  set parent([idx, newP, destroy]) {
    let oldP = this.parent;
    // 修改逻辑数据结构
    this._parent = newP
    let oldIdx;
    if (oldP) oldIdx = oldP._childs.indexOf(this)
    if (oldP && oldIdx !== -1) oldP._childs.splice(oldIdx, 1)
    // 修改图形数据结构
    SenkiLinkedNode.scheduler.push((next) => {
      SenkiLinkedNode.senkiForest
        .moveLeaf(
          this._senkiLeaf,
          newP ? newP._senkiLeaf : !destroy ? SenkiLinkedNode.senkiForest : undefined,
          idx,
          next
        )
    })
  }
  /** 获取父节点 */
  get parent() {
    return this._parent
  }

  /** 加入到第一个节点 */
  set left(n) {
    if (this._existClosedLoop(n)) {
      console.error("_existClosedLoop")
      return;
    }
    if (!n) return this.removeChild(this._left);
    this.addChild(n, 0)
    this._left = n
  }

  /** 返回上次设置为 left 的节点 */
  get left() {
    return this._left;
  }

  /** 加入到最后一个节点 */
  set right(n) {
    if (this._existClosedLoop(n)) {
      console.error("_existClosedLoop")
      return;
    };
    if (!n) return this.removeChild(this._right);
    this.addChild(n, this._childs.length)
    this._right = n
  }

  /** 返回上一次设置为 right 的节点 */
  get right() {
    return this._right;
  }

  _existClosedLoop(n) {
    if (this === n) return true;

    for (const child of this._childs)
      if (child._existClosedLoop(n))
        return true;

    return false;
  }
}

export default SenkiLinkedNode
