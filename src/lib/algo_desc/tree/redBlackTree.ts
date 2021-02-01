import makeAlgoSource from "../makeAlgoSource";

const makeShower = (arr: number[]) => `
let btins = new RBT();

btins.add(${arr[0]})
btins.add(${arr[1]})
btins.add(${arr[2]})
btins.add(${arr[3]})
btins.add(${arr[4]})
btins.add(${arr[5]})

const RED = true;
const BLACK = false;

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
    this.color = RED;
  }
}

class RBT {
  root = null;
  size = 0;
  isRed(node) {
    if (!node) return BLACK;
    return node.color;
  }
  leftRotate(node) {
    let tmp = node.right;
    node.right = tmp.left;
    tmp.left = node;
    tmp.color = node.color;
    node.color = RED;
    return tmp;
  }
  rightRoate(node) { 
    let tmp = node.left;
    node.left = tmp.right;
    tmp.right = node;
    tmp.color = node.color;
    node.color = RED;
    return tmp;
  }
  flipColors(node) { 
    node.color = RED;
    node.left.color = BLACK;
    node.right.color = BLACK;
  }
  add(key, value) {
    this.root = this.addRoot(this.root, key, value);
    this.root.color = BLACK;
  }
  addRoot(node, key, value) {
    if (!node) {
      this.size++;
      return new Node(key, value);
    }
    if (key < node.key) {
      node.left = this.addRoot(node.left, key, value);
    } else if (key > node.key) {
      node.right = this.addRoot(node.right, key, value);
    } else {
      node.value = value;
    }
    if (this.isRed(node.right) && !this.isRed((node.left))) {
      node = this.leftRotate(node);
    }
    if (this.isRed(node.left) && this.isRed((node.left.left))) {
      node = this.rightRoate(node);
    }
    if (this.isRed(node.left) && this.isRed(node.right)) {
      this.flipColors(node);
    }
    return node;
  }
  isEmpty() {
    return this.size == 0 ? true : false;
  }
  getSize() {
    return this.size;
  }
  contains(key) {
    let ans = '';
    !(function getNode(node, key) {
      if (!node || key == node.key) {
        ans = node;
        return node;
      } else if (key > node.key) {
        return getNode(node.right, key);
      } else {
        return getNode(node.right, key);
      }
    })(this.root, key);
    return !!ans;
  }
  preOrder(node = this.root) {
    if (node == null) return;
    console.log(node.key);
    this.preOrder(node.left);
    this.preOrder(node.right);
  }
  preOrderNR() {
    if (this.root == null) return;
    let stack = [];
    stack.push(this.root);
    while (stack.length > 0) {
      let curNode = stack.pop();
      console.log(curNode.key);
      if (curNode.right != null) stack.push(curNode.right);
      if (curNode.left != null) curNode.push(curNode.left);
    }
  }
  inOrder(node = this.root) {
    if (node == null) return;
    this.inOrder(node.left);
    console.log(node.key);
    this.inOrder(node.right);
  }
  postOrder(node = this.root) {
    if (node == null) return;
    this.postOrder(node.left);
    this.postOrder(node.right);
    console.log(node.key);
  }
  minmun(node = this.root) {
    if (node.left == null) return node;
    return this.minmun(node.left);
  }
  maximum(node = this.root) {
    if (node.right == null) return node;
    return this.maximum(node.right);
  }
}
`;

const desc = [
  "【红黑树】初始化红黑树",
  "添加节点1",
  "添加节点2",
  "添加节点3",
  "添加节点4",
  "添加节点5",
  "添加节点6",
  "查询是否为红色节点",
  "左旋 右红左黑",
  "右旋转 左红左子红",
  "颜色翻转",
  "添加节点",
  "根节点始终设置为黑色",
  "添加根节点",
  "如果不存在根节点。初始化根节点",
  "小的key值移向左节点",
  "大的key值移向右节点",
  "若key值相等，赋值",
  "判断是否需要左旋",
  "判断是否需要右旋",
  "判断是否需要颜色反转",
];

const makeRealCode = (arr: number[]) => `
const RED = true;
const BLACK = false;

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
    this.color = RED;
  }
}

class RBT {
  root = null;
  size = 0;
  async isRed(node) {
    await wait({line: [26, 29], desc: 8})
    if (!node) return BLACK;
    return node.color;
  }
  async leftRotate(node) {
    await wait({line: [30, 37], desc: 9});
    let tmp = node.right;
    node.right = null;
    node.right = tmp.left;
    tmp.left = node;
    tmp.color = node.color;
    await tmp.flag(tmp.color ? "#ff0000" : "#000000");
    node.color = RED;
    await node.flag("#ff0000");
    return tmp;
  }
  async rightRoate(node) {
    await wait({line: [38, 46], desc: 10});
    let tmp = node.left;
    node.left = null;
    node.left = tmp.right;
    tmp.right = node;
    tmp.color = node.color;
    await tmp.flag(tmp.color ? "#ff0000" : "#000000")
    node.color = RED;
    await node.flag("#ff0000")
    return tmp;
  }
  async flipColors(node) {
    await wait({line: [46, 50], desc: 11});
    node.color = RED;
    await node.flag("#ff0000");
    node.left.color = BLACK;
    await node.left.flag("#000000");
    node.right.color = BLACK;
    await node.right.flag("#000000");
  }
  async add(key, value) {
    await wait({line: [51, 54], desc: 12})
    this.root = await this.addRoot(this.root, key, value);
    this.root.color = BLACK;
    await wait({line: [53, 53], desc: 13})
    await this.root.flag("#000000");
  }
  async addRoot(node, key, value) {
    console.log(node)
    await wait({line: [55, 77], desc: 14})
    if (!node) {
      await wait({line: [56, 59], desc: 15})
      this.size++;
      let n = new SenkiLinkedNode(key);
      n.color = RED;
      n.flag("#ff0000");
      return n;
    }
    if (key < node.key) {
      await wait({line: [60, 60], desc: 16})
      let temp =  node.left
      node.left = null
      node.left = await this.addRoot(temp, key, value);
    } else if (key > node.key) {
      await wait({line: [62, 62], desc: 17})
      let temp =  node.right
      node.right = null
      node.right = await this.addRoot(temp, key, value);
    } else {
      await wait({line: [65, 65], desc: 18})
      node.value = value;
    }
    await wait({line: [67, 69], desc: 19})
    if (await this.isRed(node.right) && !(await this.isRed((node.left)))) { // 判断是否需要左旋
      node = await this.leftRotate(node);
    }
    await wait({line: [70, 72], desc: 20})
    if (await this.isRed(node.left) && await this.isRed((node.left.left))) { // 判断是否需要右旋
      node = await this.rightRoate(node);
    }
    await wait({line: [73, 75], desc: 21})
    if (await this.isRed(node.left) && await this.isRed(node.right)) { // 判断是否需要颜色反转
      await this.flipColors(node);
    }
    return node;
  }
  async isEmpty() {
    return this.size == 0 ? true : false;
  }
  async getSize() {
    return this.size;
  }
  async contains(key) {
    let ans = '';
    !(function getNode(node, key) {
      if (!node || key == node.key) {
        ans = node;
        return node;
      } else if (key > node.key) {
        return getNode(node.right, key);
      } else {
        return getNode(node.right, key);
      }
    })(this.root, key);
    return !!ans;
  }
  async  preOrder(node = this.root) {
    if (node == null) return;
    console.log(node.key);
    this.preOrder(node.left);
    this.preOrder(node.right);
  }
  async preOrderNR() {
    if (this.root == null) return;
    let stack = [];
    stack.push(this.root);
    while (stack.length > 0) {
      let curNode = stack.pop();
      console.log(curNode.key);
      if (curNode.right != null) stack.push(curNode.right);
      if (curNode.left != null) curNode.push(curNode.left);
    }
  }
  async inOrder(node = this.root) {
    if (node == null) return;
    this.inOrder(node.left);
    console.log(node.key);
    this.inOrder(node.right);
  }
  async postOrder(node = this.root) {
    if (node == null) return;
    this.postOrder(node.left);
    this.postOrder(node.right);
    console.log(node.key);
  }
  async minmun(node = this.root) {
    if (node.left == null) return node;
    return this.minmun(node.left);
  }
  async maximum(node = this.root) {
    if (node.right == null) return node;
    return this.maximum(node.right);
  }
}

let btins = new RBT();
await wait({line: [1, 1], desc: 1})
await wait({line: [3, 3], desc: 2})
await btins.add(${arr[0]})
await wait({line: [4, 4], desc: 3})
await btins.add(${arr[1]})
await wait({line: [5, 5], desc: 4})
await btins.add(${arr[2]})
await wait({line: [6, 6], desc: 5})
await btins.add(${arr[3]})
await wait({line: [7, 7], desc: 6})
await btins.add(${arr[4]})
await wait({line: [8, 8], desc: 7})
await btins.add(${arr[5]})
`;

const makeRedBlackTreeAlgoSource = (arr?: number[]) => {
  if (!arr) {
    arr = [];
    for (let i = 0; i < 6; i++) {
      arr.push(Math.ceil(Math.random() * 100));
    }
  }
  return makeAlgoSource(makeShower(arr), desc, makeRealCode(arr));
};

export default makeRedBlackTreeAlgoSource;
