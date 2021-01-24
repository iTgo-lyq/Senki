import Histogram from "../components/Histogram.js";

export default class SenkiArray extends Array {
  static delete() {}

  constructor() {
    super(...arguments);
    this.senkiNode = new Histogram(new Array(...arguments));
  }

  pop() {
    this.senkiNode.out(this.length - 1);
    return super.pop();
  }

  push(v) {
    this.senkiNode.in(this.length, v);
    return super.push(v);
  }

  shift() {
    this.senkiNode.out(0);
    return super.shift();
  }

  unshift(v) {
    this.senkiNode.in(0, v);
    return super.unshift(v);
  }

  add(idx, v) {
    this.senkiNode.in(idx, v);
    super.push(0);
    this.copyWithin(idx + 1, idx);
    this[idx] = v;
    return this.length;
  }

  remove(idx) {
    const ret = this[idx];
    this.senkiNode.out(idx);
    this.copyWithin(idx, idx + 1);
    this.length--;
    return ret;
  }

  set(idx, v) {
    this[idx] = v;
    this.senkiNode.set(idx, v);
  }

  swap(idx1, idx2) {
    const tempV = this[idx1];
    this[idx1] = this[idx2];
    this[idx2] = tempV;
    this.senkiNode.swap(idx1, idx2);
  }

  flag(idx, color) {
    return this.senkiNode.flag(idx, color);
  }
}
