import { makeStyles } from "@material-ui/styles";
import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  const c = useStyle();
  return (
    <div className={c.content}>
      <img
        src="https://img.alicdn.com/tfs/TB1txw7bNrI8KJjy0FpXXb5hVXa-260-260.png"
        className={c.img}
        alt="not found"
      />
      <div>
        <h3>抱歉，你访问的路径不存在</h3>
        <p className={c.p}>
          您要找的页面没有找到，请返回
          <Link to="/">
            <a className={c.a}>首页</a>
          </Link>
          继续浏览
        </p>
      </div>
    </div>
  );
}

export default NotFound;

const useStyle = makeStyles({
  content: {
    display: "flex",
    justifyContent: "center",
    minHeight: 500,
    alignItems: "center",
  },
  img: {
    marginRight: 50,
  },
  p: {
    color: "#666",
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 7,
  },
  a: {
    fontSize: 16,
    lineHeight: 20,
    "&:-webkit-any-link": {
      color: "-webkit-link",
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
});
