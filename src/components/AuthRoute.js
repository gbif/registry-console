import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Exception403 from './exception/403';
import withContext from './hoc/withContext';
import { canCreateItem } from '../api/util/helpers';


const AuthRoute = ({ user, roles, type, component: Comp, ...rest }) => {
  const isAuthorized = () => {
    if (!roles || (user && user.roles.includes('REGISTRY_ADMIN'))) {
      return true;
    }

    if (user && user.roles.includes('REGISTRY_EDITOR')) {
      return canCreateItem(user.editorRoleScopeItems, type);
    }

    return false;
  };

  return <Route {...rest} render={props => {
    if (isAuthorized()) {
      return <Comp {...props}/>;
    } else {
      return <Exception403/>;
    }
  }}/>;
};

AuthRoute.propTypes = {
  roles: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(AuthRoute);