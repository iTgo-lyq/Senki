import makeAlgoSource from "../makeAlgoSource";

const makeShower = (arr: number[]) => `
const heap = new MinHeap();
heap.insert(${arr[0]});
heap.insert(${arr[1]});
heap.insert(${arr[2]});
heap.insert(${arr[3]});
heap.insert(${arr[4]});
heap.pop();

class MinHeap{
  heap = []

  swap(i1,i2){
    const temp = this.heap[i1];
    this.heap[i1] = this.heap[i2];
    this.heap[i2] = temp;
  }

  getParentIndex(i) {
    return (i - 1) >> 1;
  }

  getLeftIndex(i) {
    return i * 2 + 1;
  }

  getRightIndex(i) {
    return i * 2 + 2; 
  }
  
  shiftUp(index) {
    if(index == 0) {return;}
    const parentIndex = this.getParentIndex(index);
    if(this.heap[parentIndex] > this.heap[index]) {
      this.swap(parentIndex,index);
      this.shiftUp(parentIndex);
    }
  }
  
  shiftDown(index) {
    const leftIndex = this.getLeftIndex(index);
    const rightIndex = this.getRightIndex(index);
    if(this.heap[leftIndex] < this.heap[index]) {
      this.swap(leftIndex,index);
      this.shiftDown(leftIndex);
    }
    if(this.heap[rightIndex] < this.heap[index]) {
      this.swap(rightIndex,index);
      this.shiftDown(rightIndex);
    }
  }
  
  insert(value) {
    this.heap.push(value);
    this.shiftUp(this.heap.length - 1);
  }
  
  pop() {
    this.heap[0] = this.heap.pop();
    this.shiftDown(0);
  }
  
  peek() {
    return this.heap[0];
  }
  
  size() { 
    return this.heap.length;
  }
}
`;

const desc = [
  "【最小堆】初始化堆",
  "插入节点",
  "插入节点",
  "插入节点",
  "插入节点",
  "插入节点",
  "删除堆顶",
  "替换两个节点值",
  "获取父节点,求除2的商",
  "获取左节点,求除2的商",
  "获取右节点,求除2的商",
  "尝试上移节点",
  "尝试下移节点",
  "插入节点",
  "删除堆顶"
];

const makeRealCode = (arr: number[]) => `
class MinHeap{
  heap = []

  head = new SenkiLinkedNode("")

  async swap(i1,i2) { //替换两个节点值
    let flag1 = this.heap[i1].flag("#ff0000")
    let flag2 = this.heap[i2].flag("#ff0000")
    await wait({line: [12, 16], desc: 8});
    const temp = this.heap[i1].key;
    this.heap[i1].setKey(this.heap[i2].key);
    this.heap[i2].setKey(temp);
    flag1();
    flag2();
  }

  async getParentIndex(i) {
    await wait({line: [18, 20], desc: 9});
    return (i - 1) >> 1; //获取父节点,求除2的商
  }

  async getLeftIndex(i) {
    await wait({line: [22, 24], desc: 10});
    return i * 2 + 1; //获取左节点,求除2的商
  }

  async getRightIndex(i) {
    await wait({line: [26, 28], desc: 11});
    return i * 2 + 2; //获取右节点,求除2的商
  }
  
  async shiftUp(index) { // 上移
    await wait({line: [30, 37], desc: 12});
    if(index == 0) {return;}
    const parentIndex = await this.getParentIndex(index);
    if(this.heap[parentIndex].key > this.heap[index].key) {
      await this.swap(parentIndex,index);
      await this.shiftUp(parentIndex);
    }
  }
  
  async shiftDown(index) { // 下移
    await wait({line: [39, 50], desc: 13});
    const leftIndex = await this.getLeftIndex(index);
    const rightIndex = await this.getRightIndex(index);
    if(this.heap[leftIndex] && this.heap[leftIndex].key < this.heap[index].key) {
      await this.swap(leftIndex,index);
      await this.shiftDown(leftIndex);
    }
    if(this.heap[rightIndex] && this.heap[rightIndex].key < this.heap[index].key) {
      await this.swap(rightIndex,index);
      await this.shiftDown(rightIndex);
    }
  }
  
  async insert(value) { // 插入
    await wait({line: [52, 55], desc: 14});
    let node;
    if (this.heap.length === 0) {
      node = this.head
      this.head.setKey(value);
    } else {
      node = new SenkiLinkedNode(value);
    }
    this.heap.push(node);
    
    for (let i = 0; i < this.heap.length; i++) {
      if (!this.heap[i].left) {
        this.heap[i].left = node;
        break;
      }
      if (!this.heap[i].right) {
        this.heap[i].right = node;
        break;
      }
    }
    await this.shiftUp(this.heap.length - 1);
  }
  
  async pop() { // 删除堆顶
    let node = this.heap.pop();
    
    if (!node) return this.head.setKey("");
    
    let flag1 = node.flag("#ff0000")
    let flag2 = node === this.head ? null : this.head.flag("#ff0000")
    
    await wait({line: [57, 60], desc: 15});

    let v = node.key
    this.head.setKey(v)
    
    await wait({line: [57, 60], desc: 15});

    if(flag1)flag1();
    if(flag2)flag2();

    node.destroy();

    await this.shiftDown(0);
  }
}
const heap = new MinHeap(); // 初始化堆
await wait({line: [1, 1], desc: 1})
await wait({line: [2, 2], desc: 2})
await heap.insert(${arr[0]});
await wait({line: [3, 3], desc: 3})
await heap.insert(${arr[1]});
await wait({line: [4, 4], desc: 4})
await heap.insert(${arr[2]});
await wait({line: [5, 5], desc: 5})
await heap.insert(${arr[3]});
await wait({line: [6, 6], desc: 6})
await heap.insert(${arr[4]});
await wait({line: [7, 7], desc: 7})
await heap.pop();
`;

const makeMinBinaryHeapAlgoSource = (arr: number[] = []) => {
  arr = arr.slice(0, 5)

  for (let i = arr.length; i < 5; i++) {
    arr.push(Math.ceil(Math.random() * 100));
  }
  return makeAlgoSource(makeShower(arr), desc, makeRealCode(arr));
};

export default makeMinBinaryHeapAlgoSource;
