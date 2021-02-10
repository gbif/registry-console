import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import withContext from '../../hoc/withContext';
import { hasRole, hasScope, hasRight, hasPermission } from '../auth';

// These components have no logic of their own, but are merely convenience wrappers, 
// so auth can be used as Components and without injecting the user yourself.

const mapContextToProps = ({ user }) => ({ user });

/**
 * Wrapper to check if the current user has the desired role
 * @param roles - array of required roles
 * @returns {*}
 * @constructor
 */
export const HasRole = withContext(mapContextToProps)(({ user, roles, children }) => {
  return (
    <React.Fragment>
      {hasRole(user, roles) && children}
    </React.Fragment>
  );
});
HasRole.propTypes = {
  roles: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.array.isRequired])
};

/**
 * Wrapper to check if the current user has the desired rights
 * @param rights - what rights must the user have to see the content. Admins role also qualifies.
 * @returns {*}
 * @constructor
 */
export const HasRight = withContext(mapContextToProps)(({ user, rights, children }) => {
  return (
    <React.Fragment>
      {hasRight(user, rights) && children}
    </React.Fragment>
  );
});
HasRight.propTypes = {
  rights: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.array.isRequired])
};

/**
 * Wrapper to check if the current user has the desired editorial scope
 * @param uuids - what uuids must the user have in their editing scope. Admins role also qualifies.
 * @returns {*}
 * @constructor
 */
export const HasScope = withContext(mapContextToProps)(({ user, uuids, children }) => {
  return (
    <React.Fragment>
      {hasScope(user, uuids) && children}
    </React.Fragment>
  );
});

HasScope.propTypes = {
  uuids: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.array.isRequired])
};

/**
 * Wrapper to check if the current user has the desired editorial scope
 * @param permissions - what permissions must the user have.
 * @returns {*}
 * @constructor
 */
export const HasPermission = withContext(mapContextToProps)(({ user, permissions, children }) => {
  return (
    <React.Fragment>
      {hasPermission(user, permissions || {}) && children}
    </React.Fragment>
  );
});

/**
 * Wrapper to check if the current user has the desired editorial scope
 * @param fn - a function that returns a promise that returns a boolean
 * @param noAccess - what component to show if there is no access
 * @returns {*}
 * @constructor
 */
export const HasAccess = withContext(mapContextToProps)(({ user, fn, noAccess = null, children }) => {
  const [hasAccess, setAccess] = useState(false);
  
  useEffect(
    () => {
      if (!fn) return;
      const req = fn();
      req
        .then((response) => setAccess(response))
        .catch(() => setAccess(false));
      
      return () => {
        if (req.cancel) req.cancel();
      };
    },
    [user, fn],
  );

  return (
    <React.Fragment>
      {hasAccess ? children : noAccess}
    </React.Fragment>
  );
});
