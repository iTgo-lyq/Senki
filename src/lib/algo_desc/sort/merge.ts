import makeAlgoSource from "../makeAlgoSource";

const makeShower = (arr: number[]) => `
let arr = [${arr.toString()}];

mergeSort(arr)

function mergeSort(arr) {
  if (arr.length == 1) {
    return arr;
  }
  let mid = Math.floor(arr.length / 2);
  let left_arr = arr.slice(0, mid);
  let right_arr = arr.slice(mid);
  return merge(mergeSort(left_arr), mergeSort(right_arr));
}

function merge(left, right) {
  let result = [];
  while (left.length > 0 && right.length > 0) {
    if (left[0] < right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  return result.concat(left).concat(right);
}
`;

const desc = [
  "【归并排序】初始化数组",
  "开始执行",
  "对传入数组进行归并排序，压入回调栈",
  "无法拆分，开始回调",
  "折半拆分数组",
  "合并数组",
  "对两个有序数组进行合并",
];

const makeRealCode = (arr: number[]) => `
const arr = new SenkiArray(${arr.toString()});
await wait({line: [1, 1], desc: 1});
await wait({line: [3, 3], desc: 2});
await mergeSort(arr, 0, arr.length);
async function mergeSort(arr, left, right) {
  await wait({line: [5, 5], desc: 3});
  if (right - left <= 1) {
    await wait({line: [6, 8], desc: 4});
    return [left, right];
  }
  let mid = Math.floor((right - left) / 2) + left;
  let flags = []
  for (let i = left; i < right; i++) {
    flags.push(arr.flag(i,"#ff0000"))
  }
  await wait({line: [9, 11], desc: 5});
  for (let i = 0; i < flags.length; i++) {
    flags[i]()
  }
  return await merge(arr, await mergeSort(arr, left, mid), await mergeSort(arr, mid, right));
}
async function merge(arr, pos1, pos2) {
  console.log(pos1, pos2)
  let left = pos1[0], right = pos2[1]
  await wait({line: [12, 12], desc: 6});
  for (let i = left; i < right - 1; i++) {
    let v = arr[i], minIndex = i;
    for (let j = i + 1; j < right; j++) {
        if (arr[j] < arr[minIndex]) {
            minIndex = j;
        }
    }
    if (v !== arr[minIndex]) {
      v = arr[minIndex]
      arr.remove(minIndex)
      arr.add(i, v)
    }
  }
  await wait({line: [17, 23], desc: 7});
  return [left, right]
}
`;

const makeMergeAlgoSource = (arr?: number[]) => {
  if (!arr) {
    arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(Math.ceil(Math.random() * 100));
    }
  }
  return makeAlgoSource(makeShower(arr), desc, makeRealCode(arr));
};

export default makeMergeAlgoSource;