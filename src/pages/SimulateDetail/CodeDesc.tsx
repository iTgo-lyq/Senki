import React, { useEffect, useLayoutEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Drawer } from "antd";
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
            console.log(1)
            if(document.getElementsByClassName('CodeMirror-code')[0].children[i] as HTMLDivElement !== undefined) {
              console.log("haha");
              console.log((document.getElementsByClassName('CodeMirror-code')[0].children[i] as HTMLDivElement).style);
              (document.getElementsByClassName('CodeMirror-code')[0].children[i] as HTMLElement).style.backgroundColor="red";
            }
    console.log(2)
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
      <Drawer
        width="450"
        mask={false}
        placement="left"
        visible={true}
        getContainer={false}
        className={c.drawer}
      >
        <p className={c.desc}>点击控制区播放按钮，开始执行 {info.desc}  {info.line}</p>
        <CodeMirror
          value={code}
          options={{
            theme: "monokai",
            mode: "js",
            readOnly: true
          }}
        />
      </Drawer>
    </div>
  );
}

export default CodeDesc;

const useStyle = makeStyles({
  container: {
    display: "block",
    position: "relative",
    width: "35vw",
    backgroundColor: "#A4B7D3",
    overflow: "hidden",
  },
  desc: {
    paddingLeft: 5,
  },
  drawer: {
    position: "absolute",
    overflow: "hidden",
  },
});
