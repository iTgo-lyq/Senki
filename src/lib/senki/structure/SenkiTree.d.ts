import Scheduler from "../base/scheduler";
import Histogram, { HistogramConfig } from "../components/Histogram";

export default class SenkiTree {

  /** 添加一个元素，返回数组长度 */
  add(idx: number, value: number): number;

  /** 移除一个元素，返回被移除的值 */
  remove(idx: number): number;

  /** 对画布上节点的属性设置并不一定立刻生效，需要调用此函数刷新画布 */
  refresh(): void;
}
