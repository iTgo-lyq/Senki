import { Home, Sorting, Welcome, NotFound } from "../pages";

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
    path: "/404",
    component: NotFound,
  },
];

export default routes;
