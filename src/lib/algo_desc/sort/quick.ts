import makeAlgoSource from "../makeAlgoSource";

const makeShower = (arr: number[]) => `
const arr = [${arr.toString()}]
quickSort(arr, 0, arr.length - 1);
function quickSort(arr, begin, end) {
  if (begin >= end) return;  
  let l = begin; 
  let r = end; 
  let temp = arr[begin]; 
  while (l < r) {
    while (l < r && arr[r] >= temp)
      r--;
    while (l < r && arr[l] <= temp) 
      l++;
    [arr[l], arr[r]] = [arr[r], arr[l]];
  }
  [arr[begin], arr[l]] = [arr[l], arr[begin]];
  quickSort(arr, begin, l - 1); 
  quickSort(arr, l + 1, end); 
}
`;

const desc = [
  "【快速排序】初始化数组",
  "执行快排",
  "递归出口",
  "左指针",
  "右指针",
  "基准数，这里取数组第一个数",
  "左右指针相遇的时候退出扫描循环",
  "右指针从右向左扫描，碰到第一个小于基准数的时候停住",
  "左指针从左向右扫描，碰到第一个大于基准数的时候停住",
  "交换左右指针所停位置的数",
  "最后交换基准数与指针相遇位置的数",
  "递归处理左数组",
  "递归处理右数组",
];

const makeRealCode = (arr: number[]) => `
const arr = new SenkiArray(${arr.toString()});
await wait({line: [1, 1], desc: 1});
await wait({line: [2, 2], desc: 2});
await quickSort(arr, 0, arr.length - 1);
async function quickSort(arr, begin, end) {
  if (begin >= end) {
    await wait({line: [4, 4], desc: 3});
    return;
  };
  let flags = []
  for (let i = begin; i <= end; i++) {
    flags.push(arr.flag(i,"#ff0000"))
  }
  let l = begin;
  await wait({line: [5, 5], desc: 4});
  let r = end;
  await wait({line: [6, 6], desc: 5});
  for (let i = 0; i < flags.length; i++) {
    flags[i]()
  }
  let temp = arr[begin]; 
  let flag = arr.flag(begin, "#00ff00")
  await wait({line: [7, 7], desc: 6});
  await wait({line: [8, 8], desc: 7});
  while (l < r) {
    await wait({line: [9, 10], desc: 8});
    while (l < r && arr[r] >= temp) {
      r--;
    } 
    await wait({line: [11, 12], desc: 9});
    while (l < r && arr[l] <= temp) {
      l++;
    }
    arr.swap(l, r)
    await wait({line: [13, 13], desc: 10}); 
  }
  arr.swap(begin, l)
  await wait({line: [15, 15], desc: 11});
  flag()
  await quickSort(arr, begin, l - 1); 
  await wait({line: [16, 16], desc: 12});
  await quickSort(arr, l + 1, end); 
  await wait({line: [17, 17], desc: 13});
}
`;

const makeQuickSortAlgoSource = (arr?: number[]) => {
  if (!arr) {
    arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(Math.ceil(Math.random() * 100));
    }
  }
  return makeAlgoSource(makeShower(arr), desc, makeRealCode(arr));
};

export default makeQuickSortAlgoSource;
