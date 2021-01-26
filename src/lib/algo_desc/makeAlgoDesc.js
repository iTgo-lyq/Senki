export default function makeAlgoDesc(source) {
  source = source.trim();

  const lines = source.split("\n");

  const blocks = [{ code: [], desc: "" }];

  // 以注释区分代码块
  while (lines.length !== 0) {
    const block = blocks[blocks.length - 1];

    while (lines.length !== 0) {
      const l = lines.shift();
      if (/^\/\//.test(l.trim())) {
        blocks.push({ code: [], desc: l.slice(2) });
        break;
      } else {
        block.code.push(l);
      }
    }
  }

  // 合并注释
  blocks.forEach((b, idx) => {
    if (b.code.length === 0 && blocks[idx + 1]) {
      blocks[idx + 1].desc = b.desc + "\n" + blocks[idx + 1].desc;
    }
  });

  // 删除空代码块
  blocks = blocks.filter((b) => b.code.length !== 0);

  return blocks;
}
