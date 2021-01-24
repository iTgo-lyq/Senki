Object.defineProperty(CanvasRenderingContext2D.prototype, "strokeWidth", {
  set: function (val) {
    this._strokeWidth = val;
    this.lineWidth = val;
  },
  get: function () {
    return this._strokeWidth === 0 ? 0 : 1;
  },
});

const oldStroke = CanvasRenderingContext2D.prototype.stroke;
CanvasRenderingContext2D.prototype.stroke = function () {
  if (this.strokeWidth > 0) oldStroke.call(this, ...arguments);
};

const oldStrokeRect = CanvasRenderingContext2D.prototype.strokeRect;
CanvasRenderingContext2D.prototype.strokeRect = function () {
  if (this.strokeWidth > 0) oldStrokeRect.call(this, ...arguments);
};

class Vector2 {
  static getLength(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static normalize(v) {
    const scalar = 1 / Vector2.getLength(v);
    v.x *= scalar;
    v.y *= scalar;
  }
}

const opacityToHex = (o) => ("00" + parseInt(o * 255).toString(16)).slice(-2);

// 对应 css3 animation-timing-function 五种速度曲线
// 当前支持2001帧的补间动画，约 33.3s, 超过该时长的动画，缺失帧采用最近帧填充
// 若初始化过慢或想提高精度，可适当修改采样帧数(hz)，仅允许源码内修改
const [
  useLinearInterpolater,
  useEaseInterpolater,
  useEaseInInterpolater,
  useEaseOutInterpolater,
  useEaseInOutInterpolater,
] = (function (hz = 2001) {
  const _time = performance.now();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const hz2 = hz ** 2;

  canvas.width = hz;
  canvas.height = hz;

  function collectSample(x1, y1, x2, y2) {
    let p;
    const sample = new Float64Array(hz);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(hz * x1, hz * y1, hz * x2, hz * y2, hz, hz);
    ctx.stroke();

    const bitmap = ctx.getImageData(0, 0, hz, hz).data;

    for (let i = 0; i < bitmap.length / 4; i++) {
      p = bitmap[i * 4 + 3];
      if (p > 0) sample[i % hz] = i / hz2;
    }

    ctx.clearRect(0, 0, hz, hz);

    return sample;
  }

  const easeSample = collectSample(0.25, 0.1, 0.25, 1);
  const easeInSample = collectSample(0.42, 0, 1, 1);
  const easeOutSample = collectSample(0, 0, 0.58, 1);
  const easeInOutSample = collectSample(0.42, 0, 0.58, 1);

  console.log("插值器初始化耗时：" + (performance.now() - _time) + "ms");

  const hz_ = hz - 1;

  return [
    (x) => x,
    (x) => easeSample[parseInt(x * hz_)],
    (x) => easeInSample[parseInt(x * hz_)],
    (x) => easeOutSample[parseInt(x * hz_)],
    (x) => easeInOutSample[parseInt(x * hz_)],
  ];
})();

class AnimPlayer {
  anmiStatus = "idle"; // busy
  animProviders = {};
  animResponders = {};

  useAnimProvider(key, anmi) {
    if (!this.animProviders[key])
      return console.error(
        "AnimProviders " + key + " 没有对应 AnimResponder，无效动画"
      );

    this.animProviders[key].push({ key, anmi });

    if (this.animProviders[key].length > 1) {
      // this.animProviders[key].accelerate() //加速
    }

    if (this.anmiStatus === "idle") {
      this.play(performance.now());
    }
  }

  removeAnimProvider(key) {
    this.animProviders[key].shift();
  }

  registerAnimResponder(key, fn) {
    if (this.animResponders[key])
      return console.error(
        "AnimResponder " + key + " 已被声明，暂不允许重复声明"
      );

    this.animProviders[key] = [];
    this.animResponders[key] = fn;
  }

  play = (timestamp) => {
    this.anmiStatus = "idle";
    for (const key in this.animProviders) {
      const providers = this.animProviders[key];
      const responder = this.animResponders[key];

      if (providers[0]) {
        if (!providers[0].anmi.hasBegin()) providers[0].anmi.startTimer();
        responder.call(this, timestamp, providers[0], this.removeAnimProvider);
      }
      if (providers.length > 0) this.anmiStatus = "busy";
    }
    if (this.anmiStatus === "busy") requestAnimationFrame(this.play);
  };
}

class AnimProvider {
  static interpolater = {
    linear: useLinearInterpolater,
    ease: useEaseInterpolater,
    "ease-in": useEaseInInterpolater,
    "ease-out": useEaseOutInterpolater,
    "ease-in-out": useEaseInOutInterpolater,
  };

  time = [0, 0]; // [ begin, duration]
  value = [0, 0, 0]; // [ from, to, deviation]

  type = "ease";
  hasFinished = false;
  onFinished;

  constructor(
    { from = 0, to, duration = 400, type = "ease" },
    onFinished = () => {}
  ) {
    this.value[0] = from;
    this.value[1] = to;
    this.value[2] = to - from;
    this.time[1] = duration;
    this.type = type;
    this.onFinished = onFinished;
  }

  startTimer() {
    this.time[0] = performance.now();
  }

  hasBegin() {
    return this.time[0] !== 0;
  }

  getCurrentValue(nowT) {
    const r = (nowT - this.time[0]) / this.time[1];
    if (r >= 1) {
      this.hasFinished = true;
      this.onFinished.call(this);
      return this.value[1];
    } else
      return (
        AnimProvider.interpolater[this.type](r) * this.value[2] + this.value[0]
      );
  }

  copy() {
    return new AnimProvider({
      from: this.value[0],
      to: this.value[1],
      duration: this.time[1],
      type: this.type,
    });
  }
}

class SenkiNode extends AnimPlayer {
  pivot = { x: 0, y: 0 };
  position = { x: 0, y: 0 };
  abs = { x: 0, y: 0 };

  name = "";

  constructor(x = 0, y = 0) {
    super();
    this.setPositon(x, y);

    this.registerAnimResponder("x", this.moveX);
    this.registerAnimResponder("y", this.moveY);
  }

  render() {}

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

class Group extends SenkiNode {
  children = [];

  add(n) {
    if (!n instanceof SenkiNode) return;
    this.children.push(n);
    n.setPivot(this.abs.x, this.abs.y);
  }

  removeChild(n) {
    if (!n instanceof SenkiNode) return;
    const idx = this.children.indexOf(n);
    this.children.splice(idx, 1);
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
}

class Scene extends Group {
  constructor(canvas, { autoRender = true } = {}) {
    super();
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

class Rect extends SenkiNode {
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

class Circle extends SenkiNode {
  radius = 4;
  borderWidth = 0;
  borderColor = "black";
  fillColor = "#546fc6";

  constructor(args, x, y) {
    super(x, y);
    Object.assign(this, args);
  }

  render({ ctx }) {
    ctx.save();

    ctx.fillStyle = this.fillColor;
    ctx.strokeWidth = this.borderWidth;
    ctx.strokeStyle = this.borderColor;

    ctx.beginPath();
    ctx.arc(this.abs.x, this.abs.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

class Arrow extends SenkiNode {
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

class SenkiText extends SenkiNode {
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

class Histogram extends Group {
  data = [];
  height = 500;
  width = 1000;
  space = 5;
  minItemWidth = 5;
  maxItemWidth = 50;
  textMarginButtom = 10;

  cell = {
    maxV: 0,
    width: 0,
    fullWidth: 0,
    realHalfSpace: 0,
    left: 0,
    preTargets: [],
    newTargets: [],
  };

  constructor(data, args, x, y) {
    super(x, y);

    Object.assign(this, args);

    this.updateCellProfile("init", 0, data);

    this.init();
  }

  init() {
    const len = this.data.length;
    for (let i = 0; i < len; i++)
      setTimeout(() => {
        this.in(i);
      }, (len - i - 1) * 400 + (i * i * 1.25) / len);
  }

  in(idx, v) {
    if (v !== undefined) this.updateCellProfile("add", idx, v);

    const direction = !v ? true : idx > this.data.length / 2 ? false : true;

    const rect = new Rect(
      { width: this.cell.width, height: this.cell.newTargets[idx].h },
      this.cell.realHalfSpace,
      0
    );
    rect.name = "rect";

    const text = new SenkiText(this.data[idx], this.cell.fullWidth / 2, 0);
    text.name = "text";

    const group = this.cell.newTargets[idx].item;

    group.add(rect);
    group.add(text);

    this.children.push(group);

    rect.useAnimProvider(
      "h",
      new AnimProvider({
        to: this.cell.newTargets[idx].h,
      })
    );

    text.useAnimProvider(
      "y",
      new AnimProvider({
        to: this.cell.newTargets[idx].h + this.textMarginButtom,
      })
    );

    group.useAnimProvider(
      "x",
      new AnimProvider({
        from: direction ? this.cell.left : this.width - this.cell.left,
        to: this.cell.newTargets[idx].x,
      })
    );

    if (v) this.autoCreateMoveAnimation(idx);
  }

  out(idx) {
    this.updateCellProfile("del", idx);

    const direction = idx > this.data.length / 2 ? false : true;

    const outItem = this.cell.preTargets[idx].item;
    const rect = outItem.findChildByName("rect");
    const text = outItem.findChildByName("text");

    rect.useAnimProvider(
      "o",
      new AnimProvider({ from: 1, to: 0, type: "ease-in" })
    );

    text.useAnimProvider(
      "o",
      new AnimProvider({ from: 1, to: 0, type: "ease-in" })
    );

    outItem.useAnimProvider(
      "x",
      new AnimProvider(
        {
          from: outItem.position.x,
          to: direction ? this.cell.left : this.width - this.cell.left,
        },
        () => {
          this.removeChild(outItem);
        }
      )
    );

    this.autoCreateMoveAnimation();
  }

  set(idx, v) {
    this.data[idx] = v;
    this.cell.newTargets[idx].item.findChildByName("text").content = v;
    this.updateCellProfile();
    this.autoCreateMoveAnimation();
  }

  swap(idx1, idx2) {
    const group1 = this.cell.newTargets[idx1].item;
    const group2 = this.cell.newTargets[idx2].item;
    const rect1 = group1.findChildByName("rect");
    const rect2 = group2.findChildByName("rect");
    const text1 = group1.findChildByName("text");
    const text2 = group2.findChildByName("text");
    const rc1 = rect1.fillColor;
    const rc2 = rect2.fillColor;
    const tc1 = text1.color;
    const tc2 = text2.color;
    rect1.fillColor = "#ff0000";
    rect2.fillColor = "#ff0000";
    text1.color = "#ff0000";
    text2.color = "#ff0000";
    group1.useAnimProvider(
      "x",
      new AnimProvider(
        { from: group1.position.x, to: group2.position.x },
        () => {
          rect1.fillColor = rc1;
          text1.color = tc1;
        }
      )
    );
    group2.useAnimProvider(
      "x",
      new AnimProvider(
        { from: group2.position.x, to: group1.position.x },
        () => {
          rect2.fillColor = rc2;
          text2.color = tc2;
        }
      )
    );

    const tempN = this.cell.newTargets[idx1];
    this.cell.newTargets[idx2] = this.cell.newTargets[idx1];
    this.cell.newTargets[idx1] = tempN;

    const tempV = this.data[idx1];
    this.data[idx1] = this.data[idx2];
    this.data[idx2] = tempV;
  }

  flag(idx, color) {
    const group = this.cell.newTargets[idx].item;
    const rect = group.findChildByName("rect");
    const text = group.findChildByName("text");
    const rc = rect.fillColor;
    const tc = text.color;
    rect.fillColor = color;
    text.color = color;
    return function () {
      rect.fillColor = rc;
      text.color = tc;
    };
  }

  updateCellProfile(flag, idx, v) {
    if (flag === "init") {
      this.data = v;
    } else if (flag === "add") {
      this.data.splice(idx, 0, v);
      console.log(this.data)
    } else if (flag === "del") {
      this.data.splice(idx, 1);
    }

    this.cell.preTargets = this.cell.newTargets;

    const len = this.data.length;

    this.cell.maxV = this.data.reduce((max, it) => Math.max(max, it), 0);

    this.cell.fullWidth = Math.min(
      this.maxItemWidth + this.space,
      this.width / len
    );

    this.cell.width = Math.max(
      this.minItemWidth,
      this.cell.fullWidth - this.space
    );
    this.cell.realHalfSpace = (this.cell.fullWidth - this.cell.width) / 2;

    if (this.cell.realHalfSpace < 0)
      return console.error("初始化失败，数据量过大，空间不足，请增大 width");

    this.cell.left = (this.width - this.cell.fullWidth * len) / 2;

    if (flag === "init")
      this.cell.newTargets = this.data.map(() => ({
        item: new Group(this.cell.left - this.cell.fullWidth, 0),
      }));
    else if (flag === "add") {
      this.cell.newTargets = this.cell.preTargets.slice();
      this.cell.newTargets.splice(idx, 0, {
        item: new Group(this.cell.left - this.cell.fullWidth, 0),
      });
    } else if (flag === "del") {
      this.cell.newTargets = this.cell.preTargets.filter((_, i) => i !== idx);
    }

    this.cell.newTargets.forEach((t, idx) => {
      t.x = idx * this.cell.fullWidth + this.cell.left;
      t.h = (this.data[idx] / this.cell.maxV) * this.height;
    });
  }

  autoCreateMoveAnimation(offIdx) {
    const len = this.data.length;
    const newTargets = this.cell.newTargets;

    for (let i = 0; i < len; i++) {
      if (i === offIdx) continue;
      const newT = newTargets[i];
      const group = newT.item;
      const rect = group.findChildByName("rect");
      const text = group.findChildByName("text");

      group.useAnimProvider(
        "x",
        new AnimProvider({ from: group.position.x, to: newT.x })
      );

      rect.useAnimProvider(
        "h",
        new AnimProvider({ from: rect.height, to: newT.h })
      );

      text.useAnimProvider(
        "y",
        new AnimProvider({
          from: text.position.y,
          to: newT.h + this.textMarginButtom,
        })
      );
    }
  }
}

class SenkiArray extends Array {
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
    delete this[this.length - 1];
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
