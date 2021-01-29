import { AnimPlayer } from "./anim.js";

export class SenkiNode extends AnimPlayer {
  pivot = { x: 0, y: 0 };
  position = { x: 0, y: 0 };
  abs = { x: 0, y: 0 };

  name;

  constructor(x = 0, y = 0) {
    super();
    this.setPositon(x, y);

    this.registerAnimResponder("x", this.moveX);
    this.registerAnimResponder("y", this.moveY);
  }

  render() { }

  setPositon(x, y) {
    this.position.x = x;
    this.position.y = y;
    this._updateCoord();
  }

  setPivot(x, y) {
    this.pivot.x = x;
    this.pivot.y = y;
    this._updateCoord();
  }

  _updateCoord() {
    this.abs.x = this.position.x + this.pivot.x;
    this.abs.y = this.position.y + this.pivot.y;
  }

  moveX(timestamp, { key, anmi }, rm) {
    this.setPositon(anmi.getCurrentValue(timestamp), this.position.y);
    if (anmi.hasFinished) rm.call(this, key);
  }

  moveY(timestamp, { key, anmi }, rm) {
    this.setPositon(this.position.x, anmi.getCurrentValue(timestamp));
    if (anmi.hasFinished) rm.call(this, key);
  }
}

export class Group extends SenkiNode {
  children = [];

  add(n) {
    if (!n instanceof SenkiNode) return;
    this.children.push(n);
    n.setPivot(this.abs.x, this.abs.y);
  }

  removeChild(n) {
    if (!n instanceof SenkiNode) return;
    const idx = this.children.indexOf(n);
    if (idx !== -1) this.children.splice(idx, 1);
  }

  removeAllChild() {
    this.children = [];
  }

  render(args) {
    for (let n of this.children) n.render(args);
  }

  setPositon = (x, y) => {
    super.setPositon(x, y);
    this._updateChildPivot();
  };

  setPivot = (x, y) => {
    super.setPivot(x, y);
    this._updateChildPivot();
  };

  findChildByName(name) {
    for (let i = 0; i < this.children.length; i++) {
      const n = this.children[i];
      if (n.name === name) return n;
    }
  }

  _updateChildPivot() {
    for (let i = 0; i < this.children.length; i++) {
      const n = this.children[i];
      n.setPivot(this.abs.x, this.abs.y);
    }
  }

  isAnimAllOver() {
    let q = [this];
    while (q.length !== 0) {
      let n = q.shift();
      if (n.anmiStatus === "busy") return false;
      if (n.children) for (let i = 0; i < n.children.length; i++) q.push(n.children[i]);
    }
    return true;
  }
}

export class Scene extends Group {
  constructor(canvas, { autoRender = true } = {}) {
    super();
    canvas.style.transform = "scaleY(-1)";
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width = canvas.clientWidth;
    this.height = canvas.height = canvas.clientHeight;
    window.addEventListener("resize", this.onResize);

    if (autoRender) this.render();
  }

  render = () => {
    this.clear();
    super.render({ ctx: this.ctx });
    requestAnimationFrame(this.render);
  };

  onResize = () => {
    this.width = this.ctx.canvas.width = this.ctx.canvas.clientWidth;
    this.height = this.ctx.canvas.height = this.ctx.canvas.clientHeight;
  };

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
