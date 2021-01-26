import { AlgoDescBlock } from "./algo_desc/makeAlgoDesc";

class MicroEvent<EventType> {
  _events: {
    [key in string]: ((...args: any[]) => {})[];
  }[];

  on(event: EventType, fct: (...args: any[]) => {}): void;

  off(event: EventType, fct: (...args: any[]) => {}): void;

  emit(event: EventType, ...args: any[]): void;
}

type CodeControlEvent = "exec" | "stop" | "start" | "console" | "wait";

interface Console {
  _log: (...args: any[]) => void;
}

/**
 * 务必提供已经格式化过的
 */
export default class CodeControl extends MicroEvent<CodeControlEvent> {
  static count: number;

  static saveContext() {}

  source: AlgoDescBlock[];

  codeBlock = "";

  autoPlay = false;

  constructor(source) {
    this.source = source;
  }

  exec() {
    this.autoPlay = true;
    this.next();
  }

  stop() {
    this.autoPlay = false;
  }

  next() {}
}
