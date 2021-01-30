import Scheduler from "../base/scheduler.js";
import Histogram from "../components/Histogram.js";

export default class SenkiArray extends Array {
  static config = {
    position: {
      x: 0,
      y: 0,
    },
  };

  scheduler = new Scheduler([
    { num: 0, resolve: () => (this.senkiNode.speed = 400) },
    { num: 4, resolve: () => (this.senkiNode.speed = 300) },
    { num: 10, resolve: () => (this.senkiNode.speed = 200) },
    { num: 20, resolve: () => (this.senkiNode.speed = 100) },
    { num: 50, resolve: () => (this.senkiNode.speed = 50) },
  ]);

  constructor() {
    super(...arguments);
    this.addJob((next) => {
      this.senkiNode = new Histogram(
        new Array(...arguments),
        SenkiArray.config,
        SenkiArray.config.position.x,
        SenkiArray.config.position.y
      );
      this.senkiNode.init(next);
    });
  }

  pop() {
    if (this.length === 0) return console.warn("it's an empty array.");
    const idx = this.length - 1;
    this.addJob((next) => {
      this.senkiNode.out(idx, next);
    });
    return super.pop();
  }

  push(v) {
    if (isNaN(v)) return console.warn("can't push a non-numeric value.");

    const idx = this.length;
    this.addJob((next) => this.senkiNode.in(idx, v, next));
    return super.push(v);
  }

  shift() {
    if (this.length === 0) return console.warn("it's an empty array.");

    this.addJob((next) => this.senkiNode.out(0, next));
    return super.shift();
  }

  unshift(v) {
    if (isNaN(v)) return console.warn("can't unshift a non-numeric value.");

    this.addJob((next) => this.senkiNode.in(0, v, next));
    return super.unshift(v);
  }

  add(idx, v) {
    if (idx < 0 || idx >= this.length)
      return console.warn("a out-of-bounds index in this array.");
    if (isNaN(v)) return console.warn("can't add a non-numeric value.");

    this.addJob((next) => this.senkiNode.in(idx, v, next));
    super.push(0);
    this.copyWithin(idx + 1, idx);
    this[idx] = v;
    return this.length;
  }

  remove(idx) {
    if (idx < 0 || idx >= this.length)
      return console.warn("a out-of-bounds index in this array.");

    this.addJob((next) => this.senkiNode.out(idx, next));
    const ret = this[idx];
    this.copyWithin(idx, idx + 1);
    this.length--;
    return ret;
  }

  set(idx, v) {
    if (idx < 0 || idx >= this.length)
      return console.warn("a out-of-bounds index in this array.");
    if (isNaN(v)) return console.warn("can't add a non-numeric value.");

    this.addJob((next) => this.senkiNode.set(idx, v, next));
    this[idx] = v;
  }

  swap(idx1, idx2) {
    if (idx1 < 0 || idx1 >= this.length || idx2 < 0 || idx2 >= this.length)
      return console.warn("a out-of-bounds index in this array.");

    this.addJob((next) => this.senkiNode.swap(idx1, idx2, next));
    const tempV = this[idx1];
    this[idx1] = this[idx2];
    this[idx2] = tempV;
  }

  flag(idx, color) {
    if (idx < 0 || idx > this.length)
      return console.warn("a out-of-bounds index in this array.");
    if (!/^#([0-9a-fA-F]{6})$/.test(color))
      return console.warn("please provide a color value like #aabbcc.");

    let retFn;

    this.addJob((next) => retFn = this.senkiNode.flag(idx, color, next));

    return () => {
      this.addJob((next) => { retFn(); next() });
    };
  }

  refresh() {
    this.addJob((next) => {
      this.senkiNode.refresh(next);
    });
  }

  destory() {
    this.addJob((next) => {
      this.senkiNode.destory(next);
    });
  }

  addJob = this.scheduler.push;
}
