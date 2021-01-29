type AlgoSource = [shower: string, desc: string[], realcode: string];

export function makeAlgoSource(
  shower: string,
  desc: string[],
  realcode: string
): AlgoSource {
  return [shower.trim(), desc, realcode.trim()];
}

export default makeAlgoSource;
