import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Header, Footer } from "../layout";
import routes from "./routes";
import "./index.css"

function App() {
  return (
    <Router>
      <div>
        <Header title="title" />
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
          <Redirect to="404" />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

const RouteWithSubRoutes = (route: any) => {
  return (
    <Route
      {...route}
      render={(props) => <route.component {...props} routes={route.routes} />}
    />
  );
};
