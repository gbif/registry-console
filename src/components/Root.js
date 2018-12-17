import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import history from './history';
import App from './App';
import ContextProvider from './hoc/ContextProvider';

const Root = () => (
  <ContextProvider>
    <Router history={history}>
      <Switch>
        <Route path="/" component={App}/>
      </Switch>
    </Router>
  </ContextProvider>
);

export default Root;