import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Slider } from "antd";
import {
  StepBackwardOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  StepForwardOutlined,
  RedoOutlined,
  PlayCircleFilled,
  PauseOutlined,
} from "@ant-design/icons";
import { C } from "../util";

type Props = {
  status: "stop" | "play" | "finish";
  speed: number;
  className?: string;
  onPlay?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  onChangeSpeed?: (speed: number) => void;
};

const ControlTrack = (props: Props) => {
  const { className, speed, status } = props;
  const classes = useStyles();

  return (
    <div className={C([classes.controlTrack, className])}>
      <div className={classes.speedContainer}>
        <span>Speed</span>
        <div className={classes.speedSlider}>
          <Slider
            defaultValue={speed || 400}
            step={100}
            min={100}
            max={700}
            onChange={props.onChangeSpeed}
          />
        </div>
      </div>
      <div className={classes.iconGroup}>
        <StepBackwardOutlined className={classes.icon} />
        <CaretLeftOutlined className={classes.icon} />
        {status === "stop" && (
          <PlayCircleFilled className={classes.icon} onClick={props.onPlay} />
        )}
        {status === "play" && (
          <PauseOutlined className={classes.icon} onClick={props.onStop} />
        )}
        {status === "finish" && (
          <RedoOutlined className={classes.icon} onClick={props.onRestart} />
        )}
        <CaretRightOutlined className={classes.icon} />
        <StepForwardOutlined className={classes.icon} />
      </div>
    </div>
  );
};

export default ControlTrack;

const useStyles = makeStyles({
  controlTrack: {
    height: 60,
    backgroundColor: "#2c303a",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px",
  },
  speedContainer: {
    display: "flex",
    alignItems: "center",
    width: "50%",
    color: "white",
    fontSize: "18px",
    marginLeft: "15px",
  },
  speedSlider: {
    width: "70%",
    marginLeft: "10px",
  },
  icon: {
    color: "white",
    fontSize: "27px",
    marginRight: "20px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  iconGroup: {
    marginRight: "60px",
  },
});
