import Scheduler from "../base/scheduler";
import Histogram, { HistogramConfig } from "../components/Histogram";

export default class SenkiArray {
  /** 默认使用此设置初始化直方图 */
  static config: HistogramConfig;

  private scheduler: Scheduler;

  /** 直方图节点实例，可直接操纵修改属性 */
  readonly senkiNode: Histogram;

  constructor(...nums: number[]);

  /** 移除尾部元素并返回 */
  pop(): number;

  /** 添加一个元素到尾部 */
  push(value: number): number;

  /** 删除头部元素，并返回 */
  shift(): number;

  /** 往数组头部添加一个元素 */
  unshift(value: number): number;

  /** 添加一个元素，返回数组长度 */
  add(idx: number, value: number): number;

  /** 移除一个元素，返回被移除的值 */
  remove(idx: number): number;

  /** 设置元素值 */
  set(idx: number, value: number): void;

  /** 交换数组元素 */
  swap(idx1: number, idx2: number): void;

  /**
   * 标记元素颜色, 返回取消标记的函数，
   * 因为动画队列的关系，标记动作本身不一定立刻执行，因此取消函数的返回值是一个Promise
   * */
  flag(idx: number, color: string): () => Promise<void>;

  /** 对画布上节点的属性设置并不一定立刻生效，需要调用此函数刷新画布 */
  refresh(): void;
}
