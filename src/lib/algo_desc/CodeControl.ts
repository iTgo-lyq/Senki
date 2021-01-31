import "../senki/index.js";

class MicroEvent<EventType extends string> {
  _events!: {
    [key in string]: ((...args: any[]) => void)[];
  };

  on(event: EventType, fct: (...args: any[]) => void) {
    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(fct);
  }

  offAll(event: EventType) {
    this._events = this._events || {};
    delete this._events[event];
  }

  off(event: EventType, fct: (...args: any[]) => void) {
    this._events = this._events || {};
    if (event in this._events === false) return;
    let idx = this._events[event].indexOf(fct)
    if (idx !== -1) this._events[event].splice(idx, 1);
  }

  emit(event: EventType, ...args: any[]) {
    this._events = this._events || {};
    if (event in this._events === false) return;
    for (var i = 0; i < this._events[event].length; i++)
      this._events[event][i].apply(this, args);
  }
}

const CodeControlPool: CodeControl[] = [];

type CodeControlEvent = "end" | "begin" | "wait" | "error" | "destroy";

type CodeInfo = { line: number[]; desc: number };

export type CodeContext = {
  info: CodeInfo;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
};

export default class CodeControl extends MicroEvent<CodeControlEvent> {
  static count = 0;
  executableFunction: () => Promise<void>;

  static saveContext(count: number, context: CodeContext) {
    const instance = CodeControlPool[count];
    if (instance) instance.saveCodeContext(context);
    else {
      console.warn("CodeControl " + count + " not Found，try to end the task.");
      context?.reject("The entity has been deleted.");
    }
  }

  count = CodeControl.count++;

  codeContext?: CodeContext;

  status: "running" | "idle" | "error" = "idle";

  _breakpointFunctionDeclaration = `
  function wait(info) {
    return new Promise((resolve, reject) => {
      // console.log(${this.count})
      CodeControl.saveContext(${this.count}, { info, resolve, reject });
    });
  };
  `;

  constructor(source: string) {
    super();

    CodeControlPool.push(this);

    this.executableFunction = Function(`
    ${this._breakpointFunctionDeclaration}
    return async function () {
      ${source}
    };
    `)();
  }

  start() {
    this.emit("begin");
    this.status = "running";
    this.executableFunction()
      .catch((err: any) => {
        this.status = "error";
        this.emit("error", err);
        throw err
      })
      .finally(() => {
        this.status = "idle";
        this.emit("end");
      });
  }

  saveCodeContext(context: CodeContext) {
    this.codeContext = context;
    this.emit("wait", context);
  }

  destroy() {
    delete CodeControlPool[this.count];
    this.offAll("end");
    this.offAll("begin");
    this.offAll("wait");
    this.offAll("error");
    this.emit("destroy");
    this.offAll("destroy");
  }
}

(window as any).CodeControl = CodeControl;
