import { Tag } from "antd";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Theme } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { C } from "../../util";

type Props = {
  illustration: {
    rest: string,
    dynamic: string,
  },
  link?: string,
  title?: string,
  options?: { link: string, title: string }[],
}

const color = ["magenta", "cyan", "geekblue", "purple", "green"]

const AlgoBox = ({ title, options, link, illustration }: Props) => {
  const classes = useStyles(illustration);

  return (
    <Card className={classes.container}>
      <div>
        {
          options ? <Link to={`/simulatedetail/${link}/${options[0].link}`}><div className={classes.sortGif}></div></Link>
            : <div className={classes.sortGif}></div>
        }
      </div>
      <div className={classes.sortTextContent}>
        {
          options ? <Link className={classes.title} to={`/simulatedetail/${link}/${options[0].link}`}>{title}</Link>
            : <span className={C(classes.title, classes.disableTitle)} >搭建中...</span>
        }
        <div className={classes.tips}>
          {options && options.map((opt, idx) => (
            <div key={idx}>
              <Link to={`/simulatedetail/${link}/${options[idx].link}`}>
                <Tag color={color[idx]}>{opt.title}</Tag>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AlgoBox;

const useStyles = makeStyles<Theme, Props["illustration"]>({
  container: {
    boxShadow: "0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)",
    backgroundColor: "white",
    height: 300,
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
  },
  sortGif: {
    width: "20vw",
    height: "15vw",
    backgroundSize:"contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: 5,
    backgroundImage:
      props => props.rest,
    "&:hover": {
      backgroundImage:
        props => props.dynamic,
    },
  },
  sortTextContent: {
    padding: 10,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 15,
  },
  disableTitle: {
    color: "lightgrey"
  },
  tips: {
    textAlign: "center",
    display: "grid",
    gridTemplateColumns: "60px 60px 60px",
    gridTemplateRows: "25px 25px",
    gridRowGap: "5px",
    marginLeft: 5
  },
});
