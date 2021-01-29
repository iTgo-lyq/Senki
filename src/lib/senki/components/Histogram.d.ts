import { AnimProviderConfig } from "../base/anim";
import { Group, Scene } from "../base/object";

type HistogramConfig = {
  /** 自动加入该Scene */
  scene: Scene;
  /** 直方图高度，不包括顶部文字 */
  height: number;
  /** 直方图宽度 */
  width: number;
  /** 柱形间隔 默认 5*/
  space: number;
  /** 最小柱宽 默认 5*/
  minItemWidth: number;
  /** 最大柱宽 默认 50*/
  maxItemWidth: number;
  /** 数字距离柱顶高度 默认10*/
  textMarginButtom: number;
  /** 直方图左下角坐标 */
  position: {
    x: number;
    y: number;
  };
  /** 动画速度 单位ms，动画队列堆积到一定数量后会逐级加速，建议不要修改*/
  speed: number;
};

type TargetItem = {
  x: number;
  h: number;
  item: Group;
};

export default class Histogram extends Group {
  data: number[];
  height: number;
  width: number;
  space: number;
  minItemWidth: number;
  maxItemWidth: number;
  textMarginButtom: number;

  private cell: {
    maxV: number;
    width: number;
    fullWidth: number;
    realHalfSpace: number;
    left: number;
    preTargets: TargetItem[];
    newTargets: TargetItem[];
  };

  speed: number;

  private animCounter: number;
  private onStopAnim?: () => void;

  constructor(data: number[], args: HistogramConfig, x: number, y: number);

  init(onFinished?: () => void): void;

  in(idx: number, v?: number, onFinished?: () => void): void;

  out(idx: number, onFinished?: () => void): void;

  set(idx: number, v: number, onFinished?: () => void): void;

  swap(idx1: number, idx2: number, onFinished?: () => void): void;

  flag(idx: number, color: string, onFinished?: () => void): void;

  makeAnimProvider(args: AnimProviderConfig, onFinished?: () => void): void;

  refresh(onFinished?: () => void): void;

  updateCellProfile(
    flag?: "del" | "add" | "init",
    idx: number,
    v: number
  ): void;

  autoCreateMoveAnimation(offIdx: number): void;
}
