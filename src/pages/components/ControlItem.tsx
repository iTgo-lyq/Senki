import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumb, Slider } from "antd";
import { StepBackwardOutlined, CaretLeftOutlined,CaretRightOutlined,StepForwardOutlined } from '@ant-design/icons';

const useStyles: any = makeStyles({
  controlItem: {
    height: "calc(100vh - 60px - 84vh)",
    backgroundColor: "#2c303a",
    width: "100%",
    // marginTop:"5px",
    display: "flex",
    alignItems: "center",
    justifyContent:"space-between",
    padding: "5px",
    boxSizing: "border-box",
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
      color:"white",
      fontSize:"27px",
      marginRight:"20px",
      '&:hover': {
          cursor:"pointer"
      }
  },
  iconGroup: {
      marginRight:"60px",

  }
});

const Index = () => {
  const classes = useStyles();
  return (
    <div className={classes.controlItem}>
      <div className={classes.speedContainer}>
        <span>Speed</span>
        <div className={classes.speedSlider}>
          <Slider defaultValue={30} step={10} />
        </div>
      </div>
      <div className={classes.iconGroup}>
      <StepBackwardOutlined className={classes.icon} />
      <CaretLeftOutlined className={classes.icon} />
      <CaretRightOutlined className={classes.icon} />
      <StepForwardOutlined className={classes.icon} />
      </div>
    </div>
  );
};

export default Index;
