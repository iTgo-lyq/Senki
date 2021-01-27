import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const Header = () => {
  const classes = useStyles();
  return (
    <div className={classes.headerContainer}>
      <div className={classes.headerInnerContainer}>
        <Link to="/welcome" className={classes.logoTitleBox}>
          <div>
            <img
              className={classes.logoImg}
              src="https://k-1258976754.cos.ap-shanghai.myqcloud.com/senki/logo-white.png"
              alt=""
            />
          </div>
          <div
            className={classes.logoTitle}
            style={{ fontFamily: "飞驰标题体" }}
          >
            Senki
          </div>
        </Link>
        <div className={classes.navItemBox}>
          <Link to="/algosimulate" className={classes.navItem}>
            算法模拟
          </Link>
          <Link to="/visual-editor" className={classes.navItem}>
            动手演练
          </Link>
          <Link to="" className={classes.navItem}>
            Senki.JS文档
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;

const useStyles = makeStyles({
  headerContainer: {
    height: "60px",
    backgroundColor: "#2c303a",
  },
  headerInnerContainer: {
    width: "70%",
    margin: "0 auto",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoImg: {
    width: "40px",
    height: "40px",
    transition: "all 0.5s",
    "&:hover": {
      transform: "rotate(360deg)",
      cursor: "pointer",
    },
  },
  logoImgBox: {
    width: "40px",
    height: "40px",
  },
  logoTitle: {
    color: "white",
    fontSize: "27px",
    marginLeft: "10px",
    paddingBottom: "5px",
    boxSizing: "border-box",
    "&:hover": {
      cursor: "pointer",
    },
  },
  logoTitleBox: {
    display: "flex",
    alignItems: "center",
  },
  navItemBox: {
    display: "flex",
    alignItems: "center",
    marginRight: "30px",
    height: "60px",
  },
  navItem: {
    "&:hover": {
      cursor: "pointer",
      color: "white",
      borderBottom: "4px solid white",
    },
    color: "#d3d7da",
    marginRight: "35px",
    height: "60px",
    lineHeight: "60px",
    borderBottom: "4px solid #d3d7da",
  },
});
