import makeAlgoDesc from "../makeAlgoDesc.js";

// 初始化数组
const array = [];
// 外层循环，控制趟数，每一次找到一个最大值
for (var i = 0; i < array.length - 1; i++) {
  // 内层循环,控制比较的次数，并且判断两个数的大小
  for (var j = 0; j < array.length - 1 - i; j++) {
    // 如果前面的数大，放到后面(当然是从小到大的冒泡排序)
    if (array[j] > array[j + 1]) {
      var temp = array[j];
      array[j] = array[j + 1];
      array[j + 1] = temp;
    }
  }
}

export function makeBubbleAlgoDesc(arr) {
  const source = `
// 初始化数组
const array = [${arr.toString()}];
// 外层循环，控制趟数，每一次找到一个最大值
for (var i = 0; i < array.length - 1; i++) {
  // 内层循环,控制比较的次数，并且判断两个数的大小
  for (var j = 0; j < array.length - 1 - i; j++) {
    // 如果前面的数大，放到后面(当然是从小到大的冒泡排序)
    if (array[j] > array[j + 1]) {
      var temp = array[j];
      array[j] = array[j + 1];
      array[j + 1] = temp;
    }
  }
}
  `;
  return makeAlgoDesc(source);
}

const exampleArr = [29, 45, 51, 68, 72, 97];

const bubbleAlgoDescExample = makeBubbleAlgoDesc(exampleArr);

export default [bubbleAlgoDescExample, arr];
