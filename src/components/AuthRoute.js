import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Exception403 from './Exception/403';


const AuthRoute = ({ user, component: Comp, ...rest }) => {
  return <Route {...rest} render={(props) => {
    if (user) {
      return <Comp {...props} user={user}/>;
    } else {
      return <Exception403/>;
    }
  }}/>;
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(AuthRoute);