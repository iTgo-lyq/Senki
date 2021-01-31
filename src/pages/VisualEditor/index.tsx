import {
  makeStyles,
  Button,
  FormControlLabel,
  Switch,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import CodeMirror from "@uiw/react-codemirror";
import { Drawer, Radio } from "antd";
import { RadioChangeEvent } from "antd/lib/radio";
import "codemirror/keymap/sublime";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/neo.css";
import React, { useLayoutEffect, useRef, useState } from "react";
import { ControlTrack, useNormalStyles } from "../../components";
import { CodeContext, CodeControl } from "../../lib/algo_desc";
import pulgin from "../../lib/babel/plugin-senki-wait";
import { Scene, SenkiArray, SenkiLinkedNode } from "../../lib/senki";
import { C } from "../../util";

let scene: Scene;
let codeControl: CodeControl;
let tempTask: undefined | (() => void); // 保存断点继续的执行函数

const clearTempTask = () => (tempTask = undefined);

const Mode = [
  {
    title: "数组",
    className: "SenkiArray",
    header: 'import { SenkiArray } from "senki"\n\n',
  },
  {
    title: "树节点",
    className: "SenkiLinkedNode",
    header: 'import { SenkiLinkedNode } from "senki"\n\n',
  },
];

let histroyCodeStr = localStorage.getItem("code");

const histroyCode: string[] = histroyCodeStr
  ? JSON.parse(histroyCodeStr)
  : Mode.map((m) => m.header);

function VisualEditor() {
  const classes = useStyles();
  const { flexRow } = useNormalStyles();

  const [tip, setTip] = useState("");
  const [codeInfo, setCodeInfo] = useState([-1, -1]);
  const [error, setError] = useState<string>();
  const [mode, setMode] = useState(0);
  const [format, setFormat] = useState(true);
  const [code, setCode] = useState(histroyCode);
  const [snackbar, setSnackbar] = useState(false);
  const [status, setStatus] = useState<"stop" | "play" | "finish">("stop");

  const editor = useRef<CodeMirror>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef(status);
  statusRef.current = status; // 没办法，为了在函数里引用，只能干这种愚蠢操作。
  const codeInfoRef = useRef<number[]>();
  codeInfoRef.current = codeInfo;

  const handleBeforeChange = (_: any, change: any) => {
    if (change.origin === "setValue") return;
    if (change.from.line === 0 || change.from.line === 1) {
      change.cancel();
    }
  };

  const handleChangeMode = (e: RadioChangeEvent) => {
    code[mode] = editor.current?.editor.getValue();
    setMode(e.target.value);
    clearTempTask();
    setStatus("stop");
  };

  const handlePublishCode = () => {
    setSnackbar(true);
  };

  const handleSeveCode = () => {
    code[mode] = editor.current?.editor.getValue();
    localStorage.setItem("code", JSON.stringify(code));
    setTip("保存成功");
  };

  const handleRunCode = () => {
    code[mode] = editor.current?.editor.getValue();
    localStorage.setItem("code", JSON.stringify(code));

    let { fakeCode, error, realCode } = makeCodeSource(code[mode], format);

    createNewCodeControl(realCode, statusRef, setStatus, setError, setCodeInfo);

    if (error) return setError(error);

    if (format) {
      code[mode] = Mode[mode].header + fakeCode;
      editor.current?.editor.setValue(code[mode]);
      localStorage.setItem("code", JSON.stringify(code));
    }

    setStatus("play");
  };

  const handlePlay = () => {
    if (!codeControl || codeControl.status !== "running")
      return setTip("请先运行代码！");
    if (tempTask) tempTask();
    setStatus("play");
  };

  const handleRestart = () => {
    codeControl.destroy(); // 一定要记得销毁

    let { error, realCode } = makeCodeSource(code[mode], format);

    createNewCodeControl(realCode, statusRef, setStatus, setError, setCodeInfo);

    if (error) return setError(error);

    setStatus("play");
  };

  const handleStop = () => {
    setStatus("stop");
  };

  const handleNext = () => {
    if (tempTask) tempTask();
  };

  const handleChangeSpeed = () => {};

  useLayoutEffect(() => {
    scene = new Scene(canvas.current!);
    SenkiArray.config.scene = scene;
    SenkiArray.config.width = scene.width;
    SenkiArray.config.height = scene.height;
    SenkiLinkedNode.setCanvasDimensions({
      width: scene.width,
      height: scene.height,
    });
    scene.add(SenkiLinkedNode.senkiForest);
  }, [canvas]);

  return (
    <div>
      <Snackbar
        autoHideDuration={2000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        open={snackbar}
        message="功能建设中..."
      />
      <Snackbar open={!!tip} autoHideDuration={6000} onClose={() => setTip("")}>
        <Alert severity="info">{tip}</Alert>
      </Snackbar>
      <div className={C(flexRow, classes.control)}>
        <div className={flexRow}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handlePublishCode}
          >
            发布代码
          </Button>
          <Button variant="outlined" color="primary" onClick={handleSeveCode}>
            保存代码
          </Button>
          <Button variant="contained" color="primary" onClick={handleRunCode}>
            执行代码
          </Button>
        </div>
        <div className={flexRow}>
          <ControlTrack
            status={status}
            speed={400}
            light
            onPlay={handlePlay}
            onStop={handleStop}
            onRestart={handleRestart}
            onChangeSpeed={handleChangeSpeed}
            onNext={handleNext}
          />
        </div>
      </div>
      <div className={classes.codeAndCanvasContainer}>
        <div className={classes.codeEditor}>
          <div className={classes.bar}>
            <span className={classes.typeTitle}>
              语言: <span className={classes.type}>JavaScript</span>
            </span>
            <FormControlLabel
              onChange={(_, v) => setFormat(v)}
              control={<Switch defaultChecked color="primary" />}
              label="保存时自动格式化代码"
              labelPlacement="end"
            />
          </div>
          <div className={classes.code}>
            <CodeMirror
              ref={editor}
              value={code[mode]}
              onBeforeChange={handleBeforeChange}
              onRenderLine={(it: CodeMirror, line: any, ele: HTMLElement) => {
                let no = line.lineNo();
                let info = codeInfoRef.current;
                if (info![0] === -1) return;
                if (no >= info![0] + 1 && no <= info![1] + 1) {
                  ele.style.backgroundColor = "#ff000055";
                }
              }}
              options={{
                theme: "neo",
                keyMap: "sublime",
                mode: "js",
                matchBrackets: true,
              }}
            />
            <Drawer
              title={
                <span style={{ color: "#f44336" }}>
                  出错啦！请确认代码无误！
                </span>
              }
              placement="bottom"
              closable
              visible={!!error}
              mask={false}
              getContainer={false}
              onClose={() => setError("")}
              style={{ position: "absolute" }}
            >
              <pre>{error?.toString()}</pre>
            </Drawer>
          </div>
        </div>
        <div className={classes.codeCanvas}>
          <div className={classes.ani}>
            <Radio.Group
              value={mode}
              buttonStyle="outline"
              onChange={handleChangeMode}
            >
              {Mode.map((m, idx) => (
                <Radio.Button key={idx} value={idx}>
                  {m.title}
                </Radio.Button>
              ))}
            </Radio.Group>
            <span className={classes.state}>
              {status === "stop"
                ? "暂无正在执行的代码"
                : status === "play"
                ? "正在执行动画"
                : "代码执行结束"}
            </span>
          </div>
          <canvas ref={canvas} className={classes.canvasProp}></canvas>
        </div>
      </div>
    </div>
  );
}

export default VisualEditor;

function makeCodeSource(code: string, format: boolean) {
  code = code.split("\n").slice(2).join("\n").trim();
  let error = "",
    fakeCode = code,
    realCode = "";

  try {
    if (format) fakeCode = Babel.transform(code, {}).code;

    realCode = Babel.transform(fakeCode, {
      plugins: [pulgin],
    }).code;
  } catch (err) {
    error = err;
  }

  return { fakeCode, error, realCode };
}

const createNewCodeControl = (
  realCode: string,
  statusRef: React.MutableRefObject<"stop" | "play" | "finish">,
  setStatus: (bool: "stop" | "play" | "finish") => void,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setCodeInfo: React.Dispatch<React.SetStateAction<number[]>>
) => {
  if (codeControl) codeControl.destroy();

  codeControl = new CodeControl(realCode);

  const handleWait = ({ info, resolve }: CodeContext) => {
    setCodeInfo(info.line);
    // 确定动画结束了再进行下一步
    const tryToNext = () => {
      if (statusRef.current === "play") {
        if (scene.isAnimAllOver()) resolve();
        else setTimeout(tryToNext, 100);
      } else tempTask = resolve;
    };

    setTimeout(tryToNext, 500);
  };

  const handleEnd = () => {
    setStatus("finish");
    setCodeInfo([-1, -1]);
  };

  const handleDestroy = () => {
    scene.removeAllChild();
    SenkiLinkedNode.senkiForest.destroyTree();
    SenkiLinkedNode.resetSenkiForest();
    scene.add(SenkiLinkedNode.senkiForest);
  };

  const handleError = (err: string) => {
    setError(err);
  };

  codeControl.on("wait", handleWait);
  codeControl.on("end", handleEnd);
  codeControl.on("destroy", handleDestroy);
  codeControl.on("error", handleError);

  codeControl.start();
};

const useStyles = makeStyles({
  dataFuntion: {
    display: "flex",
    justifyContent: "space-around",
  },
  modeFunction: {},
  codeAndCanvasContainer: {
    boxSizing: "border-box",
    height: "75vh",
    display: "flex",
    justifyContent: "space-between",
  },
  codeEditor: {
    position: "relative",
    boxSizing: "border-box",
    width: "50vw",
    height: "100%",
    background: "#eeeeee55",
    borderTop: "1px solid #eeeeee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    overflow: "hidden",
  },
  codeCanvas: {
    position: "relative",
    boxSizing: "border-box",
    width: "50vw",
    height: "100%",
    background: "#eeeeee55",
    borderTop: "1px solid #eeeeee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    overflow: "hidden",
  },
  canvasProp: {
    flex: 1,
    background: "white",
    width: "100%",
    margin: "0px 10px 10px 10px",
    borderRadius: "5px",
  },
  ani: {
    fontSize: "1rem",
    height: "40px",
    color: "#aeb4b7",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  control: {
    display: "flex",
    alignItems: "center",
    margin: "10px 0px 10px 0px",
    "& > div": {
      flex: 1,
      marginLeft: 50,
      marginRight: 50,
    },
  },
  bar: {
    padding: "5px",
    height: "40px",
    color: "#aeb4b7",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    fontSize: "1rem",
  },
  typeTitle: {},
  state: {},
  type: {},
  code: {
    height: "100%",
    padding: "0px 10px 10px 10px",
    width: "100%",
  },
});
