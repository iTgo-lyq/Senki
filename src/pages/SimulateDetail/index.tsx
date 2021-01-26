import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumb } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { ControlItem } from "..";

const useStyles: any = makeStyles({
  outContainer: {
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#f2f2f2",
    padding: "13px",
  },
  canvasContainer: {
    position: "relative",
  },
  canvasArea: {
    width: "60%",
    margin: "10px auto",
    height: "35vh",
    backgroundColor: "#A4B7D3",
  },
  functionAnalysis: {
    position: "absolute",
    bottom: "0",
    left: "0",
    width: "17%",
    height: "23vh",
    backgroundColor: "#A4B7D3",
  },
  operationArea: {
    display: "flex",
    alignItems: "center",
    height: "39vh",
    backgroundColor: "#2c303a",
    justifyContent: "space-between",
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
    backgroundColor:"white",
    height:"100%",
    width:"100%",
  },

});

const Index = () => {
  const classes = useStyles();

  return (
    <div className={classes.outContainer}>
      {/* 面包屑导航 */}
      <div>
        <Breadcrumb>
          <Breadcrumb.Item href="">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">
            <UserOutlined />
            <span>算法模拟</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>模拟详情</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className={classes.canvasContainer}>
        {/* 性能分析 */}
        <div className={classes.functionAnalysis}>这是性能分析</div>
        {/* 一块大画布 */}
        <div className={classes.canvasArea}>
          <h1>这是一块大画布</h1>
        </div>
      </div>
      {/* display flex 下半部分，除了控制条 */}
      <div className={classes.operationArea}>
        {/* 左半部分 */}
        <div className={classes.operationSingleArea}>
          {/* 一些列表，切换使用的算法 */}
          <div className={classes.operationPart}>一些列表，切换使用的算法</div>
          {/* 数组操作 */}
          <div className={classes.operationPart}>数组操作</div>
        </div>
        {/* 右半部分 */}
        <div className={classes.operationSingleArea}>
          {/* 伪代码 */}
          <div className={classes.operationCode}></div>
        </div>
      </div>
      {/* 控制条 */}
      <ControlItem />
    </div>
  );
};

export default Index;
