import { makeStyles, Button } from "@material-ui/core";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/neo.css";

const code = "//请在这里编写代码\n";

function VisualEditor() {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.buttonEditor}>
        <Button variant="outlined" color="primary">
          导出代码
        </Button>
        <Button variant="outlined" color="primary">
          上传代码
        </Button>
        {/* <Button variant="contained" color="primary"></Button> */}
        <Button variant="contained" color="primary">
          执行代码
        </Button>
      </div>
      <div className={classes.codeAndCanvasContainer}>
        <div className={classes.codeEditor}>
          <div className={classes.bar}>
            <span className={classes.typeTitle}>
              格式: <span className={classes.type}>JSX</span>
            </span>
            <span className={classes.state}>代码正在编译...</span>
          </div>
          <div className={classes.code}>
            <CodeMirror
              value={code}
              options={{
                theme: "neo",
                keyMap: "sublime",
                mode: "jsx",
              }}
            />
          </div>
        </div>
        <div className={classes.codeCanvas}>
          <div className={classes.ani}>
            <span className={classes.state}>正在执行动画</span>
          </div>
          <canvas className={classes.canvasProp}></canvas>
        </div>
      </div>
    </div>
  );
}

export default VisualEditor;

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
    justifyContent: "space-betwwen",
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
    background: "white",
    width: "100%",
    height: "100%",
    margin: "10px",
    borderRadius: "5px"
  },
  ani: {
    padding: "5px",
    height: "30px",
    color: "#aeb4b7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  // 这边要改下，把这个搞成calc计算一下
  buttonEditor: {
    width: "50vw",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    margin: "20px 0px 10px 0px",
  },
  buttonGo: {
    background: "none",
    border: "none",
    outline: "none",
    width: "100px",
    height: "40px",
    backgroundColor: "#909399",
    borderRadius: "20px",
  },
  bar: {
    padding: "5px",
    height: "30px",
    color: "#aeb4b7",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  typeTitle: {},
  state: {},
  type: {},
  code: {
    height: "100%",
    padding: "10px",
    width: "100%",
  },
});
