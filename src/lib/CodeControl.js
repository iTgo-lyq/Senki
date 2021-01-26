class MicroEvent {
  on(event, fct) {
    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(fct);
  }

  off(event, fct) {
    this._events = this._events || {};
    if (event in this._events === false) return;
    this._events[event].splice(this._events[event].indexOf(fct), 1);
  }

  emit(event, ...args) {
    this._events = this._events || {};
    if (event in this._events === false) return;
    for (var i = 0; i < this._events[event].length; i++)
      this._events[event][i].apply(this, ...args);
  }
}

const CodeControlPool = [];

export default class CodeControl extends MicroEvent {
  static count = 0;

  static receiveConsole(count, args) {
    const instance = CodeControlPool[count];
    if (instance) instance.receiveConsole(args);
    else
      console.warn(
        "CodeControl " + count + " receive console but not Found entity."
      );
  }

  static saveContext(count, context) {
    const instance = CodeControlPool[count];
    if (instance) instance.saveCodeContext(context);
    else {
      console.warn("CodeControl " + count + " not Found，try to end the task.");
      if (context.rej) context.rej("The entity has been deleted.");
    }
  }

  count = CodeControl.count++;

  source = [];
  cmdList = [];
  executableFunction;

  codeContext;

  status = "idle";

  breakpointFunctionDeclaration = `
  function wait(info) {
    return new Promise((res, rej) => {
      ${this.constructor.name}.saveContext(${this.count}, { info, res, rej });
    });
  };
  `;

  consoleFunctionDeclaration = `
  function log(){
    console.log(...arguments);
    ${this.constructor.name}.receiveConsole(${this.count}, arguments);
  }
  `;

  constructor(source) {
    super();

    CodeControlPool.push(this);

    this.source = source;
    this.resolveSource();
    this.createExecutableFunction();
  }

  start() {
    this.emit("begin");
    this.status = "idle";
    this.executableFunction()
      .catch((err) => {
        this.status = "error";
        this.emit("error", err);
      })
      .finally(() => {
        this.status = "finish";
        this.emit("finish");
      });
  }

  saveCodeContext(context) {
    this.codeContext = context;
    this.emit("wait", context);
  }

  receiveConsole(args) {
    this.emit("console", args);
  }

  destroy() {
    delete CodeControlPool[this.count];
  }

  getDescription(blockN) {
    const desc = this.source[blockN].desc;
    return desc || console.warn("can't find No." + blockN + " description");
  }

  /**
   * 将代码资源解析成执行队列
   */
  resolveSource() {
    let temp = "";
    let count = 0;

    for (let i = 0; i < this.source.length; i++) {
      const block = source[i];
      for (let j = 0; j < block.code.length; j++) {
        count++;
        temp = temp + block.code[j];
        if (!this.isIndependentLine(temp)) continue;
        this.cmdList.push({
          code: temp,
          lineN: count,
          blockN: i,
          isEmpty: temp.trim().length === 0,
        });
      }
    }

    if (temp !== "") {
      this.cmdList.push({
        code: temp,
        lineN: count,
        blockN: this.source.length - 1,
        isEmpty: temp.trim().length === 0,
      });
      console.warn("代码资源解析似乎出了问题，尝试解决...");
    }
  }

  /**
   * 将执行队列组装成可执行函数
   */
  createExecutableFunction() {
    this.executableFunction = Function(`
    ${breakpointFunctionDeclaration}
    return async function () {
      ${this.cmdList.reduce(
        (pre, { code, lineN, blockN, isEmpty }) =>
          `${pre}   
          ${this.createBreakpointFunction({ lineN, blockN, isEmpty })}
          ${code}`
      )}
    };
    `)();
  }

  /**
   * 当前句子是否可彻底断行,是否与下文完全无关
   */
  isIndependentLine(code) {
    code = code.trim();
    const lastChar = code[code.length - 1];

    if (code.length === 0) return true;
    if (lastChar === ";" || lastChar === "}") return true;

    return false;
  }

  /**
   * 将所有普通函数转换为异步函数
   */
  convertToAsync(code) {
    let newIdx,
      preIdx = 0;

    newIdx = code.indexOf("=>");
    while (newIdx !== -1) {
      if (code.slice(preIdx, newIdx).indexOf("async") === -1) {
        let idx = 0,
          brackets = 0,
          vr = false;
        for (let i = newIdx - 1; i >= preIdx; i--) {
          const s = code[i];
          if (s === ")") brackets++;
          if (s === "(") {
            brackets--;
            if (brackets === 0) {
              idx = i;
              break;
            }
          }

          if (s !== " " && brackets === 0 && !vr) vr = true;
          if (s === " " && vr) {
            idx = i;
            break;
          }
        }
        code = code.slice(0, idx) + " async " + code.slice(idx);
        newIdx += 7;
      }
      preIdx = newIdx;
      newIdx = code.indexOf("=>", newIdx + 1);
    }

    newIdx = code.indexOf("function");
    while (newIdx !== -1) {
      if (code.slice(preIdx, newIdx).indexOf("async") === -1) {
        code = code.slice(0, newIdx) + " async " + code.slice(newIdx);
        newIdx += 7;
      }
      preIdx = newIdx;
      newIdx = code.indexOf("function", newIdx + 1);
    }

    return code;
  }

  /**
   * 生成断点函数
   */
  createBreakpointFunction(info) {
    return "wait(" + JSON.stringify(info) + ")";
  }
}
