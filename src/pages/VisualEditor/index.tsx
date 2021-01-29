import { makeStyles } from "@material-ui/core";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/monokai.css";

const code = "const a = 0;";

function VisualEditor() {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.dataFuntion}>
        <div className={classes.modeFunction}>导出功能</div>
        <div className={classes.modeFunction}>一些小功能</div>
        <div className={classes.modeFunction}>更详细的实现</div>
      </div>
      <div className={classes.codeAndCanvasContainer}>
        <div className={classes.codeEditor}>
          <CodeMirror
            value={code}
            options={{
              theme: "monokai",
              keyMap: "sublime",
              mode: "jsx",
            }}
          />
        </div>
        <div className={classes.codeCanvas}>
          <canvas className={classes.canvasProp}></canvas>
        </div>
      </div>
      <div className={classes.buttonEditor}>
        <button className={classes.buttonGo}>执行代码</button>
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
  modeFunction: {
    width: "20vw",
    height: "20vh",
    background: "gray",
  },
  codeAndCanvasContainer: {
    boxSizing: "border-box",
    padding: "5px",
    height: "60vh",
    display: "flex",
    justifyContent: "space-betwwen",
  },
  codeEditor: {
    boxSizing: "border-box",
    padding: "5px",
    width: "50vw",
  },
  codeCanvas: {
    boxSizing: "border-box",
    padding: "5px",
    width: "50vw",
    background: "blue",
  },
  canvasProp: {
    background: "gray",
  },
  // 这边要改下，把这个搞成calc计算一下
  buttonEditor: {
    height: "12vh",
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
});
