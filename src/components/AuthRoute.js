import React from 'react';
import { Route } from 'react-router-dom';

import Exception403 from './exception/403';
import withContext from './hoc/withContext';


const AuthRoute = ({ user, roles, editorRoleScopeItems, type, component: Comp, ...rest }) => {
  const isAuthorized = () => {
    if (!roles || (user && user.roles.includes('REGISTRY_ADMIN'))) {
      return true;
    }

    if (user && user.roles.includes('REGISTRY_EDITOR')) {
      if (type === 'organization') {
        return editorRoleScopeItems.some(item => item.type === 'node');
      }

      if (type === 'dataset') {
        return editorRoleScopeItems.some(item => ['organization', 'node'].includes(item.type));
      }

      if (type === 'installation') {
        return editorRoleScopeItems.some(item => ['organization', 'node'].includes(item.type));
      }
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

const mapContextToProps = ({ user, editorRoleScopeItems }) => ({ user, editorRoleScopeItems });

export default withContext(mapContextToProps)(AuthRoute);