import React from 'react';
import { Route } from 'react-router-dom';

import Exception403 from './Exception/403';
import withContext from './hoc/withContext';


const AuthRoute = ({ user, role, component: Comp, ...rest }) => {
  const isAuthorized = (user, role) => {
    return !user || (role && !user.roles.includes(role));
  };

  return <Route {...rest} render={(props) => {
    if (!isAuthorized(user, role)) {
      return <Comp {...props} user={user}/>;
    } else {
      return <Exception403/>;
    }
  }}/>;
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(AuthRoute);