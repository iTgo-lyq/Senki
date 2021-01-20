import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { add, asyncAction } from "../../app/appSlice";
import { RootState, useAppDispatch } from "../../app/store";

const Modules = [
  {
    name: "排序1",
    path: "/sorting",
  },
  {
    name: "排序2",
    path: "/sorting",
  },
];

function Home() {
  // const history = useHistory();
  // const param = useParams();
  // console.log(param)
  return (
    <div>
      {Modules.map((e) => (
        <div>{e.path}</div>
      ))}
    </div>
  );
}

export default Home;
