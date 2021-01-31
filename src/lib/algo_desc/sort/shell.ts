import makeAlgoSource from "../makeAlgoSource";

const makeShower = (arr: number[]) => `
const arr = [${arr.toString()}]
const splitHalf = num => Math.floor(num / 2)
for (let gap = splitHalf(arr.length); gap > 0; gap = splitHalf(gap)) {
  for (let i = gap; i < arr.length; i++) { 
    let j = i;
    let temp = arr[j]; 
    for (; j > gap - 1; j -= gap) { 
      if (temp >= arr[j - gap]) break; 
      arr[j] = arr[j - gap]; 
    }
    arr[j] = temp; 
  }
}
`;

const desc = [
  "【希尔排序】初始化数组",
  "定义折半函数",
  "逐步降低步长直至为1为止",
  "与插入排序的写法基本一致",
  "初始化临时变量 序号j，待插入数 temp",
  "移动步长为 gap",
  "找到插入位置",
  "元素右移",
  "执行插入"
];

const makeRealCode = (arr: number[]) => `
const arr = new SenkiArray(${arr.toString()});
await wait({line: [1, 1], desc: 1})
const splitHalf = num => Math.floor(num / 2)
await wait({line: [2, 2], desc: 2})
for (let gap = splitHalf(arr.length); gap > 0; gap = splitHalf(gap)) {
  await wait({line: [3, 3], desc: 3})
  for (let i = gap; i < arr.length; i++) {
    await wait({line: [4, 4], desc: 4})
    let flag = arr.flag(i, "#00ff00")
    let j = i;
    let temp = arr[j];
    await wait({line: [5, 6], desc: 5})
    flag();
    for (; j > gap - 1; j -= gap) {
      let flags = []
      for (let z = j; z >= 0; z -= gap) {
        flags.push(arr.flag(z,"#ff0000"))
      }
      await wait({line: [7, 7], desc: 6})
      for (let z = 0; z < flags.length; z++) {
        flags[z]()
      }
      console.log(j, temp, arr[j - gap])
      if (temp >= arr[j - gap]) {
        await wait({line: [8, 8], desc: 7})
        console.log("2323",j)
        break;
      }
      arr.set(j, arr[j - gap])
      await wait({line: [9, 9], desc: 8})
    }
    if (j !== i) 
      flag = arr.flag(j, "#00ff00")
    arr.set(j, temp);
    await wait({line: [11, 11], desc: 9})
    if (j !== i) 
      flag()
  }
}
`;

const makeShellAlgoSource = (arr?: number[]) => {
  if (!arr) {
    arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(Math.ceil(Math.random() * 100));
    }
  }
  return makeAlgoSource(makeShower(arr), desc, makeRealCode(arr));
};

export default makeShellAlgoSource;
