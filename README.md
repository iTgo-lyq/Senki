

# Senki（千机）——算法与数据结构可视化动态演练平台

*by阿里巴巴前端练习生计划项目 —— 拥抱变化团队*

**主要功能：**

1. 可视化演示各类数据结构相关算法
2. 在线编写JS代码，实时查看对应数据结构运行状态

![数组](https://shiyan-1257892469.cos.ap-shanghai.myqcloud.com/array.gif)

![动态节点](https://shiyan-1257892469.cos.ap-shanghai.myqcloud.com/node.gif)

## 开始使用

快速启动：

```bash
npm i
npm start
```

快速上线：

```shell
docker build -t senki .
docker run -p 8081:8081 senki
```



## SenkiJs

​	*针对本项目实际需求所提炼出的小库，轻量无依赖*

​	SenkiJs是一个数据结构动态可视化绘图库，可以应用于浏览器中。

​	封装了数组、树、链表等数据结构，使之成为功能和扩展性更强的数据结构，通过分析抽象语法树打入断点，结合动画绘制，使之能提供代码解析、动态可视化运行功能。



## 数据结构：

*SenkiJS提供的可与视图绑定的类*

### SenkiArray

基于普通的数组对象，与视图绑定了如下API:



#### 移除尾部元素并返回

>  pop:  (  ) => number;

#### 添加一个元素到尾部

> push:  (value:  number) => number;

#### 删除头部元素并返回

> shift:  (  ) => number;

#### 往数组头部添加一个元素 

> unshift:  (value: number)  =>  number;

#### 添加一个元素，返回数组长度

> add:  (idx: number, value: number)  =>  number;

#### 移除一个元素，返回被移除的值 

> remove:  (idx: number)  =>  number;

#### 设置元素值

> set: (idx: number, value: number)  => void;

#### 交换数组元素

> swap:  (idx1: number, idx2: number)  => void;

#### 标记元素颜色, 返回取消标记的函数

因为动画队列的关系，标记动作本身不一定立刻执行，因此取消函数的返回值是一个Promise

> flag:  (idx: number, color: string):  =>   () => Promise\<void\>

#### 刷新画布

因为对画布上节点的属性设置并不一定立刻生效

> refresh:  (  )  =>  void;





### SenkiLinkedNode

定位基于 **Reingold-Tilford 算法**

可使用left、right 模拟二叉树，或直接增删child节点。

#### 标记颜色（格式必须为 #aabbcc），返回取消标记的函数

> flag：(color: string)  =>  (  )   =>   Promise\<void\>;

#### 获取子节点

> getChild：(idx: number)  =>  SenkiLinkedNode;

#### 添加子节点

> addChild：(n: SenkiLinkedNode, idx = 0)  =>  number;

#### 移除子节点，成为一颗独立树

> removeChild:  (v: SenkiLinkedNode | number)  =>  SenkiLinkedNode | null;

#### 销毁该节点对应子树

> destroy:  (  )  =>  void;

#### 从原本的父节点移动到新的父节点下

除了构造函数外，

修改对应图形节点、真正会触发动画的唯一函数的唯一函数。

原则上一次动作，只设置一次parent。

> private set parent(args: [idx: number, newP: SenkiLinkedNode?, destroy: boolean])

#### 获取父节点

> get parent：(  )  =>  SenkiLinkedNode | null;

#### 加入到第一个节点

> set left(n: SenkiLinkedNode)

#### 返回上次设置为 left 的节点

> get left() : SenkiLinkedNode | null	

#### 加入到最后一个节点

> set right(n: SenkiLinkedNode)

#### 返回上一次设置为 right 的节点

> get right() : SenkiLinkedNode | null	





## 基本实现类

### 动画：

#### AnimPlayer

动画实现类的通用接口

#### AnimProvider

提供动画数值

#### AnimProviderType

三次贝塞尔速度曲线

对应 css3 animation-timing-function 五种速度曲线

当前支持2001帧的补间动画，约 33.3s, 超过该时长的动画，缺失帧采用最近帧填充

若初始化过慢或想提高精度，可适当修改采样帧数(hz)，仅允许源码内修改

> ​		linear
>
> ​		ease
>
> ​		ease-in
>
> ​		ease-out
>
> ​		ease-in-out



### 对象 ：

***继承自AnimPlayer***

#### SenkiNode

#### Group

#### Scene

### 形状：

***继承自SenkiNode***

#### Rect

- width: number

-  height: number

- borderWidth: number

- borderColor: string

- fillColor: string

- opacity: number

#### Circle

- radius: number

  -borderWidth: number

- borderColor: string

- fillColor: string

#### SenkiText

- content: string;

- color: string;

- size: number;

- family: string;

- opacity: number;

#### Arrow

- width: number;

- length: number;

- fillColor: string;

- orientation: Vector2;

- from: Vector2;

- to: Vector2;

- fromPoint: SenkiNode;

- toPoint: SenkiNode;

### Scheduler：

动画任务调度器