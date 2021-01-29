import { SenkiNode } from "./object";
import { Vector2, opacityToHex } from "./util";

interface RectConfig {
  width: number;
  height: number;
  borderWidth: number;
  borderColor: string;
  fillColor: string;
  opacity: number;
}

export class Rect extends SenkiNode {
  width: number;
  height: number;
  borderWidth: number;
  borderColor: string;
  fillColor: string;
  opacity: number;

  constructor(args: RectConfig, x: number, y: number);

  private changeH(
    timestamp: number,
    provider: { key: string; anmi: AnimProvider },
    rm
  ): void;

  private changeO(
    timestamp: number,
    provider: { key: string; anmi: AnimProvider },
    rm
  ): void;
}

type CircleConfig = {
  radius: number;
  borderWidth: number;
  borderColor: string;
  fillColor: string;
};

export class Circle extends SenkiNode {
  radius: number;
  borderWidth: number;
  borderColor: string;
  fillColor: string;

  constructor(args: CircleConfig, x, y);
}

/**
 * from to 是初始化时可选择提供的 orientation、length、position 的计算依据
 * 一旦提供，则 orientation、length、position(x, y) 选项无效
 * 初始化完毕后，from to 将成为计算结果的缓存属性，不允许直接更新
 * */
type ArrowConfig = {
  width: number;
  length: number;
  fillColor: string;
  orientation: Vector2;

  from: Vector2;
  to: Vector2;

  fromPoint: SenkiNode;
  toPoint: SenkiNode;
};

export class Arrow extends SenkiNode {
  width: number;
  length: number;
  fillColor: string;
  orientation: Vector2;

  from: Vector2;
  to: Vector2;

  fromPoint: SenkiNode;
  toPoint: SenkiNode;

  constructor(args: ArrowConfig, x: number, y: number);

  setOrientationWithFromTo(from: Vector2, to: Vector2): void;

  _updateCoord: () => void;
}

type SenkiTextConfig = {
  content: string;
  color: string;
  size: number;
  family: string;
  opacity: number;
};

export class SenkiText extends SenkiNode {
  content: string;
  color: string;
  size: number;
  family: string;
  opacity: number;

  constructor(args: SenkiTextConfig | string, x: number, y: number);

  changeO(
    timestamp: number,
    provider: { key: string; anmi: AnimProvider },
    rm
  ): void;
}
