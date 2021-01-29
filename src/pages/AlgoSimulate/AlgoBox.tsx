import { Tag } from "antd";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Link } from "react-router-dom";

const AlgoBox = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.sortGif}></div>
      </div>
      <div className={classes.sortTextContent}>
        <div className={classes.sortTitle}>
          <Link to="/simulatedetail">排序</Link>
        </div>
        <div>
          <Tag color="magenta">冒泡</Tag>
          <Tag color="cyan">选择</Tag>
          <Tag color="geekblue">堆排序</Tag>
          <Tag color="purple">快排</Tag>
          <Tag color="green">归并</Tag>
        </div>
      </div>
    </div>
  );
};

export default AlgoBox;

const useStyles = makeStyles({
  container: {
    boxShadow: "0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)",
    backgroundColor: "white",
    // width:"40%",
    // height:"50px",
    padding: "20px",
    boxSizing: "border-box",
    display: "flex",
    borderRadius: "20px"
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
  },
  sortTitle: {
    fontSize: "26px",
    fontWeight: 800,
    marginBottom: "10px",
  },
});
