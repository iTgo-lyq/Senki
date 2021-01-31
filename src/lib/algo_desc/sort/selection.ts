import makeAlgoSource from "../makeAlgoSource";

const makeShower = (arr: number[]) => `
const array = [${arr.toString()}];
var minIndex;
for (var i = 0; i < array.length - 1; i++) {
    minIndex = i;
    for (var j = i + 1; j < array.length; j++) {
        if (array[j] < array[minIndex]) {
            minIndex = j;
        }
    }
    array.swap(i, minIndex)
}
`;

const desc = [
  "【选择排序】初始化数组和临时变量及索引",
  "外层循环，控制趟数，每一次找到一个最小值",
  "内层循环，控制比较的次数，并且判断于temp的大小",
  "如果比temp小，将索引存到minIndex中",
  "将当前值与minIndex中的值交换"
];

const makeRealCode = (arr: number[]) =>`
const array = new SenkiArray(${ arr.toString() });
var minIndex;
await wait({ line: [1, 2], desc: 1 })
for (var i = 0; i < array.length - 1; i++) {
  minIndex = i;
  await wait({ line: [3, 3], desc: 2 })
  for (var j = i + 1; j < array.length; j++) {
    const cancel = array.flag(j, "#407434")
    await wait({ line: [5, 5], desc: 3 })
    if (array[j] < array[minIndex]) {
      await wait({ line: [6, 6], desc: 4 })
      minIndex = j;
      await wait({ line: [7, 7], desc: 4 })
    }
    cancel();
  }
  array.swap(i, minIndex)
  await wait({ line: [10, 10], desc: 4 })
}`


const makeSelectionAlgoSource = (arr?: number[]) => {
  if (!arr) {
    arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(Math.ceil(Math.random() * 100));
    }
  }
  return makeAlgoSource(makeShower(arr), desc, makeRealCode(arr));
};

export default makeSelectionAlgoSource;