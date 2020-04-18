import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Bookings from './components/Bookings';
import Home from './components/Home';
import Login from './components/Login';
import Schedule from './components/Schedule';
import Signup from './components/Signup';
import Users from './components/Users';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/shards-ui/dist/css/shards.min.css';
const NoMatchPage = () => {
  return (
    <h3>404 - Not found</h3>
  );
};

const App = props => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/users/:id" exact component={Users} />
          <Route path="/schedules" exact component={Schedule} />
          <Route path="/booking" exact component={Bookings} />
          <Route component={NoMatchPage} />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  )
}

export default App;
