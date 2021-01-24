import { makeStyles } from '@material-ui/core/styles';

interface Props {
  title: string;
}
const useStyles:any = makeStyles({
  headerContainer: {
    height:"60px",
    backgroundColor:"#2c303a",
  },
  headerInnerContainer: {
    width:"70%",
    // backgroundColor:"red",
    margin:"0 auto",
    height:"60px",
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
  },
  logoImg: {
    width:"40px",
    height:"40px",
    transition:"all 0.5s",
    '&:hover':{
      transform:"rotate(360deg)",
      cursor:"pointer"
    }
  },
  logoImgBox:{
    width:"40px",
    height:"40px",
  },
  logoTitle:{
    color:"white",
    fontSize:"27px",
    marginLeft:"10px",
    paddingBottom:"5px",
    boxSizing:"border-box",
    '&:hover':{
      cursor:"pointer"
    }
  },
  logoTitleBox: {
    display:"flex",
    alignItems:"center",
  },
  navItemBox: {
    display:"flex",
    alignItems:"center",
    color:"#d3d7da",
    marginRight:"30px",
    height:"60px"
  },
  navItem: {
    '&:hover':{
      cursor:"pointer",
      color:"white",
      borderBottom:"4px solid white"
    },
    marginRight:"35px",
    height:"56px",
    lineHeight:"56px",
    borderBottom:"4px solid #d3d7da"
  },
})
const Header = ({ title }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.headerContainer}>
      {/* navInner */}
        <div className={classes.headerInnerContainer}>
          <div className={classes.logoTitleBox}>
          <div ><img className={classes.logoImg} src="https://k-1258976754.cos.ap-shanghai.myqcloud.com/senki/logo-white.png" alt=""/></div>
          <div className={classes.logoTitle} style={{fontFamily:"飞驰标题体"}}>Senki</div>
          </div>
          <div className={classes.navItemBox}>
            <div className={classes.navItem}>算法模拟</div>
            <div className={classes.navItem}>动手演练</div>
            <div className={classes.navItem}>Senki.JS文档</div>
          </div>
        </div>
    </div>
  );
};

export default Header;
