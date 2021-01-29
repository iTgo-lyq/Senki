// import makeAlgoSource from "../makeAlgoSource";

// const makeShower = (arr: number[]) => `
// const array = [${arr.toString()}];
// for (var i = 0; i < array.length - 1; i++) {
//   for (var j = 0; j < array.length - 1 - i; j++) {
//     if (array[j] > array[j + 1]) {
//       var temp = array[j];
//       array[j] = array[j + 1];
//       array[j + 1] = temp;
//     }
//   }
// }
// `;

// const desc = [
//   "初始化数组",
//   "外层循环，控制趟数，每一次找到一个最大值",
//   "内层循环,控制比较的次数，并且判断两个数的大小",
//   "如果前面的数大，放到后面(从小到大的冒泡排序)",
// ];

// const makeRealCode = (arr: number[]) => `
// const array = new SenkiArray(${arr.toString()});
// await wait({line: [1, 1], desc: 1})
// for (var i = 0; i < array.length - 1; i++) {
//   await wait({line: [2, 2], desc: 2})
//   for (var j = 0; j < array.length - 1 - i; j++) {
//     const cancel = array.flag(j, "#407434")
//     await wait({line: [3, 3], desc: 3})
//     if (array[j] > array[j + 1]) {
//       await wait({line: [4, 4], desc: 4})
//       array.swap(j, j+1)
//       await wait({line: [5,7], desc: 4})
//     }
//     cancel();
//   }
// }
// `;

// const makeBubbleAlgoSource = (arr?: number[]) => {
//   if (!arr) {
//     arr = [];
//     for (let i = 0; i < 10; i++) {
//       arr.push(Math.ceil(Math.random() * 100));
//     }
//   }
//   return makeAlgoSource(makeShower(arr), desc, makeRealCode(arr));
// };

// export default makeBubbleAlgoSource;

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
  "初始化数组和临时变量及索引",
  "外层循环，控制趟数，每一次找到一个最小值",
  "内层循环,控制比较的次数，并且判断于temp的大小",
  "如果比temp小，将索引存到minIndex中",
  "将当前值与minIndex中的值交换"
];

const makeRealCode = (arr: number[]) => `
const array = new SenkiArray(${arr.toString()});
var minIndex;
await wait({line: [1, 2], desc: 1})
for (var i = 0; i < array.length - 1; i++) {
    const cancel = array.flag(i, "#407434")
    minIndex = i;
    await wait({line: [3, 4], desc: 2})
    for (var j = i + 1; j < array.length; j++) {
        await wait({line: [5, 5], desc: 3})
        if (array[j] < array[minIndex]) {
            await wait({line: [6, 6], desc: 4})
            minIndex = j;
            await wait({line: [7, 7], desc: 4})
        }
        cancel();
    }
    array.swap(i, minIndex)
    await wait({line: [8, 10], desc: 4})
}
`;

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