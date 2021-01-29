import { SenkiNode } from "./object.js";
import { Vector2, opacityToHex } from "./util.js";

export class Rect extends SenkiNode {
  width = 50;
  height = 50;
  borderWidth = 0;
  borderColor = "#000000";
  fillColor = "#546fc6";
  opacity = 1;

  constructor(args, x, y) {
    super(x, y);
    Object.assign(this, args);

    this.registerAnimResponder("h", this.changeH);
    this.registerAnimResponder("o", this.changeO);
  }

  render({ ctx }) {
    ctx.save();

    ctx.fillStyle = this.fillColor + opacityToHex(this.opacity);
    ctx.strokeWidth = this.borderWidth;
    ctx.strokeStyle = this.borderColor + opacityToHex(this.opacity);

    ctx.fillRect(this.abs.x, this.abs.y, this.width, this.height);
    ctx.strokeRect(this.abs.x, this.abs.y, this.width, this.height);

    ctx.restore();
  }

  changeH(timestamp, { key, anmi }, rm) {
    this.height = anmi.getCurrentValue(timestamp);
    if (anmi.hasFinished) rm.call(this, key);
  }

  changeO(timestamp, { key, anmi }, rm) {
    this.opacity = anmi.getCurrentValue(timestamp);
    if (anmi.hasFinished) rm.call(this, key);
  }
}

export class Circle extends SenkiNode {
  radius = 4;
  borderWidth = 0;
  borderColor = "black";
  fillColor = "#546fc6";
  opacity = 1

  constructor(args, x, y) {
    super(x, y);
    Object.assign(this, args);

    this.registerAnimResponder("r", this.changeR);
    this.registerAnimResponder("o", this.changeO);
  }

  render({ ctx }) {
    ctx.save();

    ctx.fillStyle = this.fillColor + opacityToHex(this.opacity);
    ctx.strokeWidth = this.borderWidth;
    ctx.strokeStyle = this.borderColor + opacityToHex(this.opacity);

    ctx.beginPath();
    ctx.arc(this.abs.x, this.abs.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  changeR(timestamp, { key, anmi }, rm) {
    this.radius = anmi.getCurrentValue(timestamp);
    if (anmi.hasFinished) rm.call(this, key);
  }

  changeO(timestamp, { key, anmi }, rm) {
    this.opacity = anmi.getCurrentValue(timestamp);
    if (anmi.hasFinished) rm.call(this, key);
  }
}

export class Arrow extends SenkiNode {
  width = 1;
  length = 100;
  fillColor = "#546fc6";
  orientation = { x: 1, y: 1 };

  // from to 是初始化时可选择提供的 orientation、length、position 的计算依据
  // 一旦提供，则 orientation、length、position(x, y) 选项无效
  // 初始化完毕后，from to 将成为计算结果的缓存属性，不允许直接更新
  from = { x: 0, y: 0 };
  to = { x: 0, y: 0 };

  fromPoint = new SenkiNode();
  toPoint = new SenkiNode();

  constructor(args, x, y) {
    super(x, y);
    Object.assign(this, args);

    const { from, to } = args;

    if (from && to) {
      this.length = Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2);
      this.setOrientationWithFromTo(from, to);
      // 会触发from to 的重新计算，且依赖 length 和 orientation, 必须放最后
      this.setPositon((from.x + to.x) / 2, (from.y + to.y) / 2);
    }
  }

  render({ ctx }) {
    ctx.save();

    ctx.fillStyle = this.color;
    ctx.strokeWidth = this.width;
    ctx.strokeStyle = this.fillColor;

    ctx.beginPath();
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();

    this.fromPoint.render();
    this.toPoint.render();
  }

  setOrientationWithFromTo(from, to) {
    this.orientation.x = to.x - from.x;
    this.orientation.y = to.y - from.y;
    Vector2.normalize(this.orientation);
  }

  _updateCoord = () => {
    super._updateCoord();
    const { y: sin, x: cos } = this.orientation;
    const { x, y } = this.position;
    const len = this.length / 2;

    this.from.x = x - len * cos;
    this.from.y = y - len * sin;
    this.to.x = x + len * cos;
    this.to.y = y + len * cos;
  };
}

export class SenkiText extends SenkiNode {
  content = "";
  color = "#000000";
  size = 14;
  family = "caption";
  opacity = 1;

  constructor(args, x, y) {
    super(x, y);
    if (typeof args !== "object") this.content = args;
    else Object.assign(this, args);

    this.registerAnimResponder("o", this.changeO);
  }

  render({ ctx }) {
    ctx.save();

    ctx.scale(1, -1);
    ctx.fillStyle = this.color + opacityToHex(this.opacity);
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.font = `${this.size}px ${this.family}`;
    ctx.fillText(this.content, this.abs.x, -this.abs.y);

    ctx.restore();
  }

  changeO(timestamp, { key, anmi }, rm) {
    this.opacity = anmi.getCurrentValue(timestamp);
    if (anmi.hasFinished) rm.call(this, key);
  }
}
