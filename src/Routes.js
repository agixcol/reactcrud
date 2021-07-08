// Dependencies
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Components
import App from './App';
import Books from './books';
import Page404 from './Page404';

// Container
//import Home from './containers/Home';
//import Library from './containers/Library';

const AppRoutes = () =>
  <App>
    <Switch>
      <Route exact path="Books" component={Books} />
      <Route exact path="/" component={App} />
      <Route component={Page404} />
    </Switch>
  </App>;

export default AppRoutes;