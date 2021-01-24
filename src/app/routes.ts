import { Home, Sorting, Welcome, NotFound,AlgoSimulate } from "../pages";

export const routes = [
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
    path: "/home",
    component: Home,
  },
  {
    path: "/sorting",
    component: Sorting,
  },
  {
    path: "/algosimulate",
    component: AlgoSimulate,
  },
  {
    path: "/404",
    component: NotFound,
  },
];

export default routes;
