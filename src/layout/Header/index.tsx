import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";

const Header = () => {
  const classes = useStyles();
  return (
    <div className={classes.headerContainer}>
      <div className={classes.headerInnerContainer}>
        <NavLink to="/welcome" className={classes.logoTitleBox}>
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
        </NavLink>
        <div className={classes.navItemBox}>
          <NavLink to="/algosimulate" className={classes.navItem}>
            算法模拟
          </NavLink>
          <NavLink to="/visual-editor" className={classes.navItem}>
            动手演练
          </NavLink>
          <NavLink to="" className={classes.navItem}>
            关于我们
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;

const useStyles = makeStyles({
  headerContainer: {
    height: "60px",
    width: "100%"
  },
  headerInnerContainer: {
    width: "90%",
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
    color: "rgb(13, 51, 128)",
    fontSize: "32px",
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
    marginRight: "10px",
    height: "60px",
  },
  navItem: {
    "&:hover": {
      cursor: "pointer",
      color: "white",
      textDecoration: "1px",
    },
    color: "rgb(13, 51, 128)",
    fontWeight: 600,
    fontSize: "1rem",
    marginRight: "40px",
    height: "60px",
    lineHeight: "60px",
    position: 'relative',
    "&::after":{
      
    }
  },
  // activeStyle: {
  //   color: ;
  // }
});
