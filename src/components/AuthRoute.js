import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Exception403 from './exception/403';
import withContext from './hoc/withContext';
import { canCreateItem } from './helpers';

/**
 * A custom Route wrapper for the routes that have permission restrictions
 */
class AuthRoute extends React.Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { user, location } = this.props;
    // If the url and the user are the same we shouldn't re-render component
    return nextProps.user !== user || nextProps.location.pathname !== location.pathname;
  }

  isAuthorized(user, roles, type) {
    if (!roles || (user && user.roles.includes('REGISTRY_ADMIN'))) {
      return true;
    }

    if (user && user.roles.includes('REGISTRY_EDITOR')) {
      return canCreateItem(user.editorRoleScopeItems, type);
    }

    return false;
  };

  render() {
    const { user, roles, type, component: Comp, ...rest } = this.props;

    return <Route {...rest} render={props => {
      if (this.isAuthorized(user, roles, type)) {
        return <Comp {...props}/>;
      } else {
        return <Exception403/>;
      }
    }}/>;
  }
}

AuthRoute.propTypes = {
  roles: PropTypes.array.isRequired, // list or roles for which wrapped content should be available
  type: PropTypes.string // type of item for the case or create Route
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(AuthRoute);