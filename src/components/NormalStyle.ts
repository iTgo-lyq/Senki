import { makeStyles } from "@material-ui/core";

const useNormalStyles = makeStyles({
  flexRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  flexCol: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

export default useNormalStyles;
