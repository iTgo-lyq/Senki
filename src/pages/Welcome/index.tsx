import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import "./index.css";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px",
  },
  container: {
    backgroundImage:
      "url('https://k-1258976754.cos.ap-shanghai.myqcloud.com/senki/5.jpg')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    height: "calc(100vh - 60px)",
    display: "flex",
  },
  titleText: {
    fontSize: "40px",
    fontWeight: 800,
    marginBottom: "15px",
  },
  DesText: {
    fontSize: "26px",
    fontWeight: 200,
    marginBottom: "30px",
  },
  leftContent: {
    width: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rightContent: {
    width: "50%",
    display: "flex",
    alignItems: "center",
  },
});

function Welcome() {
  const classes = useStyles();
  const history = useHistory();
  // history.push('/home', {name: "ahahah"})
  return (
    <div className={classes.container}>
      <div className={classes.leftContent} style={{ color: "white" }}>
        <div>
          <div className={classes.titleText}>千机(Senki)</div>
          <div className={classes.DesText}>
            算法与数据结构可视化动态演练平台
          </div>
          <div className="startButton">快速开始</div>
        </div>
      </div>
      <div className={classes.rightContent}>
        <video
          style={{ borderRadius: "10px" }}
          width="600"
          height="400"
          controls
          poster="https://kairz-1258976754.cos.ap-shanghai.myqcloud.com/%E8%A5%BF%E6%B9%964.jpg"
        >
          <source
            src="https://kairz-1258976754.cos.ap-shanghai.myqcloud.com/%E5%BE%AE%E6%B3%9Bv45.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </div>
  );
}

export default Welcome;
