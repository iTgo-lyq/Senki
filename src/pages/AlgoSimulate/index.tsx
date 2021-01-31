import { makeStyles } from "@material-ui/core/styles";
import AlgoBox from "./AlgoBox";

const sortOptions = [
  {
    link: "bubble",
    title: "冒泡",
  },
  {
    link: "merge",
    title: "归并",
  },
  {
    link: "quick",
    title: "快排",
  },
  {
    link: "selection",
    title: "选择",
  },
  {
    link: "shell",
    title: "希尔",
  },
];

const treeOptions = [
  {
    link: "minBinaryHeap",
    title: "最小堆",
  },
  {
    link: "redBlackTree",
    title: "红黑树",
  },
  {
    link: "inorderTraversal",
    title: "中序遍历",
  },
];

const sortIllustration = {
  rest:
    "url('https://k-1258976754.cos.ap-shanghai.myqcloud.com/senki/sorting.png')",
  dynamic:
    "url('https://k-1258976754.cos.ap-shanghai.myqcloud.com/senki/sorting.gif')",
};

const treeIllustration = {
  rest:
    "url('https://shiyan-1257892469.cos.ap-shanghai.myqcloud.com/heap.png')",
  dynamic:
    "url('https://shiyan-1257892469.cos.ap-shanghai.myqcloud.com/heap.gif')",
};

const normalIllustration = {
  rest:
    "url('https://shiyan-1257892469.cos.ap-shanghai.myqcloud.com/building2.png')",
  dynamic:
    "url('https://shiyan-1257892469.cos.ap-shanghai.myqcloud.com/building2.png')",
};

const AlgoSimulate = () => {
  const classes = useStyles();

  return (
    <div className={classes.outContainer}>
      <div className={classes.innerContainer}>
        <div className={classes.algoContainer}>
          <div className={classes.algoBox}>
            <AlgoBox
              title="排序"
              link="sort"
              options={sortOptions}
              illustration={sortIllustration}
            />
          </div>
          <div className={classes.algoBox}>
            <AlgoBox
              title="树"
              link="tree"
              options={treeOptions}
              illustration={treeIllustration}
            />
          </div>
          <div className={classes.algoBox}>
            <AlgoBox illustration={normalIllustration} />
          </div>
          <div className={classes.algoBox}>
            <AlgoBox illustration={normalIllustration} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgoSimulate;

const useStyles = makeStyles({
  algoContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  outContainer: {},
  innerContainer: {
    width: "85%",
    margin: "0 auto",
  },
  algoBox: {
    width: "48%",
    marginTop: "25px",
  },
});
