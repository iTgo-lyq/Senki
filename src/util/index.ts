export * from "./date";

/**
 * 合并 className
 */
export const C = (...arr: Array<string | boolean | undefined>) => {
  return arr.filter((c) => c !== undefined && c !== false).join(" ");
};
