import Scheduler from "../base/scheduler";
import { ForestPlot } from "../components/ForestPlot";

class SenkiLinkedNode {
  static senkiForest: ForestPlot;
  static scheduler: Scheduler;
  static config: {
    radius: 30,
    borderWidth: 6,
    borderColor: "#546fc6",
    fillColor: "#ffffff",
  }
  static resetSenkiForest: () => void;
  static setCanvasDimensions: (obj: { width: number, height: number }) => void;

  key: string; // 键值， 同时作为圈内字符

  data: any; // 任意数据

  constructor(key: string, data: any)

  /** 
   * 标记颜色 格式必须为 #aabbcc
   * 返回取消标记的函数
   */
  flag(color: string): () => void;

  /** 获取子节点 */
  getChild(idx: number): SenkiLinkedNode;

  /** 添加子节点 */
  addChild(n: SenkiLinkedNode, idx = 0): number;

  /** 移除子节点，成为一颗独立树 */
  removeChild(v: SenkiLinkedNode | number): SenkiLinkedNode | null

  /** 销毁该节点对应子树 */
  destroy(): void;

  /**
   * 会从原本的父节点移动到新的父节点下
   * 除了构造函数外，
   * 修改对应图形节点的唯一函数
   * 真正会触发动画的唯一函数 
   * 原则上一次动作，只设置一次parent
  */
  private set parent(args: [idx: number, newP: SenkiLinkedNode?, destroy: boolean])

  /** 获取父节点 */
  get parent(): null | SenkiLinkedNode

  /** 加入到第一个节点 */
  set left(n: SenkiLinkedNode)

  /** 返回上次设置为 left 的节点 */
  get left(): null | SenkiLinkedNode

  /** 加入到最后一个节点 */
  set right(n: SenkiLinkedNode)

  /** 返回上一次设置为 right 的节点 */
  get right(): null | SenkiLinkedNode
}

export default SenkiLinkedNode
