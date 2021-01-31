import {
  Welcome,
  NotFound,
  AlgoSimulate,
  VisualEditor,
  SimulateDetail,
} from "../pages";

type RouteItem = {
  path: string;
  exact?: boolean;
  component: React.FC;
};

export const routes: RouteItem[] = [
  {
    path: "/",
    exact: true,
    component: Welcome,
  },
  {
    path: "/welcome",
    component: Welcome,
  },
  {
    path: "/algosimulate",
    component: AlgoSimulate,
  },
  {
    path: "/simulatedetail/sort",
    component: SimulateDetail.Sort,
  },
  {
    path: "/simulatedetail/tree",
    component: SimulateDetail.Tree,
  },
  {
    path: "/simulatedetail",
    component: SimulateDetail.Sort,
  },
  {
    path: "/visual-editor",
    component: VisualEditor,
  },
  {
    path: "/404",
    component: NotFound,
  },
];

export default routes;
