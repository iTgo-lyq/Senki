import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AlgoBox } from "./components/AlgoBox";


const useStyles:any = makeStyles({
    algoContainer: {
      display:"flex",
      alignItems:"center",
      flexWrap: 'wrap',
      justifyContent:"space-between"
    },
    outContainer: {
        minHeight:"calc(100vh - 60px)",
        backgroundColor:"#f2f2f2",
    },
    innerContainer:{
        width:"70%",
        margin:"0 auto",
    },
    algoBox: {
        width:"48.5%",
        marginTop:"25px",
    }
  })

const AlgoSimulate = (props:any)=>{
    const classes = useStyles();

    return (
        <div className={classes.outContainer}>
            <div className={classes.innerContainer}>
            {/* 打广告 */}
            <div>
                这里做点广告吧
            </div>
            <div className={classes.algoContainer}>
                {/* <AlgoBox className={classes.algoBox} />
                <AlgoBox className={classes.algoBox} />
                <AlgoBox className={classes.algoBox} />
                <AlgoBox className={classes.algoBox} />
                <AlgoBox className={classes.algoBox} />
                <AlgoBox className={classes.algoBox} /> */}
                <div className={classes.algoBox}>
                <AlgoBox />
                </div>
                <div className={classes.algoBox}>
                <AlgoBox />
                </div>
                <div className={classes.algoBox}>
                <AlgoBox />
                </div>
                <div className={classes.algoBox}>
                <AlgoBox />
                </div>
                {/* <AlgoBox /> */}
            </div>
            </div>
        </div>
    );
}

export default AlgoSimulate;