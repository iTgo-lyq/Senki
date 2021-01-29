const WEEK_CHINESE = ["七", "一", "二", "三", "四", "五", "六"];

export const SECOND = 1000

export const MINUTE = SECOND * 60

export const HOUR = MINUTE * 60

export const HALF_DAY = HOUR * 12

export const DAY = HALF_DAY * 2

/**
 * 根据时间戳格式化时间
 * @param  fmt 格式
 * @param  timestamp 时间
 * @example
 * let date = new Date()
 * dateFormat("YYYY-mm-dd HH:MM", date)
 * >>> 2019-06-06 19:45`
 */
export function dateFormat(fmt: string, timestamp: number | string | Date): string {
  let ret: RegExpExecArray;

  let date = timestamp instanceof Date ? timestamp : new Date(Number(timestamp));

  if (date.toString() === "Invalid Date") throw Error("err timestamp") ;

  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString(), // 秒
    "w+": WEEK_CHINESE[date.getDay()] //周X
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };

  Object.keys(opt).forEach((k) => {
    ret = new RegExp("(" + k + ")").exec(fmt)!;
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length === 1 ? (opt as any)[k] : (opt as any)[k].padStart(ret[1].length, "0")
      );
    }
  })

  return fmt;
}

/**
 * 获取合适的时间提示
 */
export function getTipTime(timestamp1: number): string {
  let date1 = new Date(timestamp1);
  let date2 = new Date();
  let timestamp2 = Date.now();

  if (date2.getDate() === date1.getDate() && timestamp2 - timestamp1 < DAY)
    return dateFormat("HH:MM", date1);
  else if (date2.setHours(0, 0, 0, 0) - timestamp1 < DAY)
    return dateFormat("昨天 HH:MM", date1);
  else if (date2.setHours(0, 0, 0, 0) - timestamp1 < 2 * DAY)
    return dateFormat("前天 HH:MM", date1);
  else if (date2.getDay() >= date1.getDay() && timestamp2 - timestamp1 < DAY * 7)
    return dateFormat("星期w HH:MM", date1);
  else if (date2.getFullYear() === date1.getFullYear())
    return dateFormat("mm-dd HH:MM", date1);
  else return dateFormat("YYYY-mm-dd HH:MM", date1);
}