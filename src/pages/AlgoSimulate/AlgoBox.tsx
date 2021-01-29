import { Tag } from "antd";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

const AlgoBox = () => {
  const classes = useStyles();

  return (
    <Card className={classes.container}>
      <div>
        <div className={classes.sortGif}></div>
      </div>
      <div className={classes.sortTextContent}>
        <div className={classes.sortTitle}>
          <Link to="/simulatedetail">排序算法</Link>
        </div>
        <div className={classes.tips}>
          <div>
            <Tag color="magenta">冒泡</Tag>
          </div>
          <div>
            <Tag color="cyan">选择</Tag>
          </div>
          <div>
            <Tag color="geekblue">堆排序</Tag>
          </div>
          <div>
            <Tag color="purple">快排</Tag>
          </div>
          <div>
            <Tag color="green">归并</Tag>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AlgoBox;

const useStyles = makeStyles({
  container: {
    boxShadow: "0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)",
    backgroundColor: "white",
    // width:"40%",
    height: "300px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    // alignItems:"center",
  },
  sortGif: {
    width: "20vw",
    height: "15vw",
    backgroundImage:
      "url('https://k-1258976754.cos.ap-shanghai.myqcloud.com/senki/sorting.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    "&:hover": {
      backgroundImage:
        "url('https://k-1258976754.cos.ap-shanghai.myqcloud.com/senki/sorting.gif')",
    },
  },
  sortTextContent: {
    padding: "10px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
  sortTitle: {
    fontSize: "26px",
    fontWeight: 800,
    marginBottom: "10px",
  },
  tips: {
    textAlign: "center",
    display: "grid",
    gridTemplateColumns: "60px 60px 60px",
    gridTemplateRows: "25px 25px",
    gridRowGap: "5px",
  },
});
