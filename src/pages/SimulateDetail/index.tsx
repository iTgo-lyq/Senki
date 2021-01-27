import React, { useLayoutEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumb } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { ControlTrack, useNormalStyles } from "../../components";
import { C } from "../../util";
import CodeDesc from "./CodeDesc";
import { Scene, SenkiArray } from "../../lib/senki";
import {
  CodeContext,
  CodeControl,
  makeBubbleAlgoSource,
} from "../../lib/algo_desc";

let scene: Scene;
let codeControl: CodeControl;
let [fakeCode, desc, realCode] = makeBubbleAlgoSource();

let tempTask: () => void | undefined; // 保存断点继续的执行函数

const SimulateDetail = () => {
  const classes = useStyles();
  const { flexRow, flexCol } = useNormalStyles();

  const [data, setData] = useState<[]>()
  const [status, setStatus] = useState<"stop" | "play" | "finish">("stop");
  const [codeInfo, setCodeInfo] = useState({ line: -1, desc: -1 }); // TODO  利用line高亮对应代码行

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
      setCodeInfo({ line: -1, desc: -1 });
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
    [fakeCode, desc, realCode] = makeBubbleAlgoSource(data);
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
    createNewCodeControl();
  }, [canvas]);

  return (
    <div className={C([classes.container, flexCol])}>
      <Breadcrumb className={classes.breadNav}>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/algosimulate">
          <UserOutlined />
          <span>算法模拟</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>模拟详情</Breadcrumb.Item>
      </Breadcrumb>
      <div className={C([classes.codeBox, flexRow])}>
        <CodeDesc code={fakeCode} desc={desc} info={codeInfo} />
        <canvas ref={canvas} className={classes.canvas}></canvas>
      </div>
      <div className={C([classes.operationArea, flexCol])}>
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
    backgroundColor: "#f2f2f2",
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
    boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.1)",
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
