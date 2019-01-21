import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Exception403 from '../../exception/403';
import withContext from '../../hoc/withContext';
import { hasPermission } from '../auth';

const mapContextToProps = ({ user }) => ({ user });
/**
 * Protected route
 * @param authType - authenticate by ROLE, RIGHT or SCOPE
 * @param authValues - which values should be used to match against the type. e.g. for role REGISTRY_ADMIN
 * @returns {*}
 * @constructor
 */
export const AuthRoute = withContext(mapContextToProps)(React.memo(({ user, roles, rights, uuids, component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    hasPermission(user, {roles, rights, uuids})
      ? <Component {...props} />
      : <Exception403 />
  )} />
), (prevProps, nextProps) => {
  const { user, location } = prevProps;
  // If the url and the user are the same we shouldn't re-render component
  return !(nextProps.user !== user || nextProps.location.pathname !== location.pathname);
}));

AuthRoute.propTypes = {
  roles: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.array.isRequired]),
  rights: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.array.isRequired]),
  uuids: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.array.isRequired]),
};