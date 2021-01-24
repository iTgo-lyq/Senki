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

export class Vector2 {
  static getLength(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static normalize(v) {
    const scalar = 1 / Vector2.getLength(v);
    v.x *= scalar;
    v.y *= scalar;
  }
}

export const opacityToHex = (o) =>
  ("00" + parseInt(o * 255).toString(16)).slice(-2);
