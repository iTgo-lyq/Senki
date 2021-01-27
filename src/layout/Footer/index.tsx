import { makeStyles } from "@material-ui/core/styles";

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      Copyright © 2021 阿里巴巴前端练习生计划——拥抱变化
    </div>
  );
};

export default Footer;

const useStyles = makeStyles({
  container: {
    height: "50px",
    backgroundColor: "#2c303a",
    color: "#d3d7da",
    lineHeight: "50px",
    textAlign: "center",
  },
});