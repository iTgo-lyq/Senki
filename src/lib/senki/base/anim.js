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

export class AnimPlayer {
  anmiStatus = "idle"; // busy
  animProviders = {};
  animResponders = {};

  useAnimProvider(key, anmi) {
    if (!this.animProviders[key])
      return console.error(
        "AnimProviders " + key + " 没有对应 AnimResponder，无效动画"
      );

    this.animProviders[key].push({ key, anmi });

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
    let flag = "idle";
    for (const key in this.animProviders) {
      const providers = this.animProviders[key];
      const responder = this.animResponders[key];

      if (providers[0]) {
        if (!providers[0].anmi.hasBegin()) providers[0].anmi.startTimer();

        responder.call(this, timestamp, providers[0], this.removeAnimProvider);
      }
      if (providers.length > 0) flag = "busy";
    }
    if ((this.anmiStatus = flag) === "busy") requestAnimationFrame(this.play);
  };
}

export class AnimProvider {
  static count = 0;
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

    AnimProvider.count++;
    this.count = AnimProvider.count;

    // console.log("anim create", this.count);
  }

  startTimer() {
    this.time[0] = performance.now();

    // console.log("anim start", this.count);
  }

  hasBegin() {
    return this.time[0] !== 0;
  }

  getCurrentValue(nowT) {
    const r = (nowT - this.time[0]) / this.time[1];
    if (r >= 1) {
      // if (this.hasFinished) return this.value[1];

      this.hasFinished = true;

      // console.log("anim end", this.count);

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
