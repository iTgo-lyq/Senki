type AlgoDescBlock = {
  code: string[];
  desc: string;
}[];

/**
 * 以 `空白符 + //` 区分每个代码块，并为该代码块标明注释
 *
 * @param source 格式化的代码
 */
export default function makeAlgoDesc(source: string): AlgoDescBlock[];
