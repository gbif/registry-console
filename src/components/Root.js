import React from 'react';
import { Provider } from "react-redux"
import { Router, Route, Switch } from 'react-router-dom'
import history from './history';
import App from './App'

const Root = ({store}) => (
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </Router>
  </Provider>
)

export default Root