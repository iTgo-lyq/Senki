interface CanvasRenderingContext2D {
  strokeWidth: number;
}

export class Vector2 {
  x: number;
  y: number;
  static getLength(v: Vector2): number;

  static normalize(v: Vector2): void;
}

export const opacityToHex = (o: number) =>
  ("00" + parseInt(o * 255).toString(16)).slice(-2);
