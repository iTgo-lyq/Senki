import React, { useLayoutEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ControlTrack, useNormalStyles } from "../../components";
import { C } from "../../util";
import CodeDesc from "./CodeDesc";
import { Scene, SenkiArray } from "../../lib/senki";
import {
  CodeContext,
  CodeControl,
  makeBubbleAlgoSource,
  makeMergeAlgoSource,
  makeQuickSortAlgoSource,
  makeSelectionAlgoSource,
  makeShellAlgoSource,
} from "../../lib/algo_desc";
import BreadcrumbNav from "./BreadcrumbNav";
import { useLocation } from "react-router-dom";

let scene: Scene;
let codeControl: CodeControl;
let makeAlgoSource = makeBubbleAlgoSource;
let fakeCode: string = "",
  desc: string[] = [],
  realCode: string = "";

let tempTask: () => void | undefined; // 保存断点继续的执行函数

const SimulateDetail = () => {
  const classes = useStyles();
  const { flexRow, flexCol } = useNormalStyles();

  const location = useLocation();

  const [data] = useState<[]>();
  const [status, setStatus] = useState<"stop" | "play" | "finish">("stop");
  const [codeInfo, setCodeInfo] = useState({ line: [-1, -1], desc: -1 });

  const statusRef = useRef(status);
  statusRef.current = status; // 没办法，为了在闭包函数里引用，只能干这种愚蠢操作。
  const canvas = useRef<HTMLCanvasElement>(null);

  const createNewCodeControl = () => {
    codeControl = new CodeControl(realCode);

    const handleWait = ({ info, resolve }: CodeContext) => {
      setCodeInfo(info);

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
      setCodeInfo({ line: [-1, -1], desc: -1 });
    };

    const handleDestroy = () => {
      scene.removeAllChild();
    };

    codeControl.on("wait", handleWait);
    codeControl.on("end", handleEnd);
    codeControl.on("destroy", handleDestroy);

    codeControl.start();
  };

  const handlePlay = () => {
    if (tempTask) tempTask();
    setStatus("play");
  };

  const handleRestart = () => {
    [fakeCode, desc, realCode] = makeAlgoSource(data);
    codeControl.destroy(); // 一定要记得销毁
    createNewCodeControl();
    setStatus("play");
  };

  const handleStop = () => {
    setStatus("stop");
  };

  const handleChangeSpeed = () => {};

  useLayoutEffect(() => {
    scene = new Scene(canvas.current!);
    SenkiArray.config.scene = scene;
    SenkiArray.config.width = scene.width;
    SenkiArray.config.height = scene.height;

    let path = location.pathname;

    if (/bubble/.test(path)) makeAlgoSource = makeBubbleAlgoSource;
    if (/merge/.test(path)) makeAlgoSource = makeMergeAlgoSource;
    if (/quick/.test(path)) makeAlgoSource = makeQuickSortAlgoSource;
    if (/selection/.test(path)) makeAlgoSource = makeSelectionAlgoSource;
    if (/shell/.test(path)) makeAlgoSource = makeShellAlgoSource;

    [fakeCode, desc, realCode] = makeAlgoSource(data);

    createNewCodeControl();
  }, [canvas]);

  return (
    <div className={C(classes.container, flexCol)}>
      <BreadcrumbNav />
      <div className={C(classes.codeBox, flexRow)}>
        <CodeDesc code={fakeCode} desc={desc} info={codeInfo} />
        <canvas ref={canvas} className={classes.canvas}></canvas>
      </div>
      <div className={C(classes.operationArea, flexCol)}>
        <div className={flexRow}>
          <div className={classes.operationSingleArea}>
            <div className={classes.operationPart}>
              一些列表，切换使用的算法
            </div>
          </div>
          <div className={classes.operationSingleArea}>
            <div className={classes.operationPart}>数组操作</div>
          </div>
        </div>
        <ControlTrack
          status={status}
          speed={400}
          onPlay={handlePlay}
          onStop={handleStop}
          onRestart={handleRestart}
          onChangeSpeed={handleChangeSpeed}
        />
      </div>
    </div>
  );
};

export default SimulateDetail;

const useStyles = makeStyles({
  container: {
    minHeight: "calc(100vh - 60px)",
  },
  breadNav: {
    padding: 13,
  },
  codeBox: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    marginLeft: 50,
    marginRight: 50,
  },
  operationArea: {
    margin: 13,
    height: "20vh",
    backgroundColor: "#2c303a",
  },
  operationPart: {
    height: "47%",
    marginTop: "1%",
    marginBottom: "1%",
    backgroundColor: "white",
  },
  operationSingleArea: {
    width: "48%",
    height: "100%",
    padding: "0.5%",
  },
  operationCode: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
  },
});
