import React, { useEffect, useLayoutEffect } from "react";
import { makeStyles } from "@material-ui/core";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/theme/monokai.css";

type Props = {
  code: string;
  desc: string[];
  info: {
    line: number[];
    desc: number;
  };
};

function CodeDesc({code, desc, info}: Props) {
  const c = useStyle();
    
    useLayoutEffect(()=>{
      setTimeout(() => {
        for(let i = info.line[0]; i <= info.line[1]; i++ ) {
          if(info.line[0]!==-1) {
            if(document.getElementsByClassName('CodeMirror-code')[0].children[i] as HTMLDivElement !== undefined) {
              // console.log((document.getElementsByClassName('CodeMirror-code')[0].children[i] as HTMLDivElement).style);
              (document.getElementsByClassName('CodeMirror-code')[0].children[i] as HTMLElement).style.backgroundColor="red";
            }
          }
        }
      }, 1000);
      
    })
  useEffect(()=>{
    
  },[])
  // for(let i=0;i<document.getElementsByClassName('CodeMirror-code')[0].childNodes.length;i++) {
  //   if(info.line[0])
  // }
  // document.getElementsByClassName('CodeMirror-code')[0].childNodes
  
  return (
    <div className={c.container}>
      <div className={c.drawer}>
        <p className={c.desc}>点击控制区播放按钮，开始执行 <span className={c.info}>{info.desc}</span> <span className={c.line}>{info.line}</span></p>
        <CodeMirror
          value={code}
          options={{
            theme: "monokai",
            mode: "js",
            readOnly: true
          }}
        />
      </div>
    </div>
  );
}

export default CodeDesc;

const useStyle = makeStyles({
  container: {
    display: "block",
    position: "relative",
    width: "35vw",
    overflow: "hidden",
    background: "rgba(0,0,0,0)"
  },
  desc: {
    textAlign: "center",
    border: "1px solid #cfcfcd44",
    padding: 5,
    fontSize: 16,
    background: "#f5f3f244"
  },
  drawer: {
    position: "absolute",
    overflow: "hidden",
    height: "500px",
    width: "500px",
    padding: "20px",
    background: "rgba(0,0,0,0)",
    color: "#848891",
    fontWeight: 300
  },
  info:{
    color: "#1c334c",
    fontWeight: 500
  },
  line: {
    color: "#1c334c",
    fontWeight: 500
  }
});
