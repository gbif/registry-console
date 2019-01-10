import React from 'react';
import PropTypes from 'prop-types';

import withContext from './withContext';
import { isAuthorised } from '../helpers';

/**
 * Wrapper to check if the current user can have access to wrapped controls or not
 * @param user - active user (from App Context)
 * @param roles - array of required roles
 * @param uuids - array of UUIDS to check permissions to create/edit item or subtypes
 * @param createType - type of item to create
 * @param children - wrapped content, usually controls
 * @returns {*}
 * @constructor
 */
const PermissionWrapper = ({ user, roles, uuids, createType, children }) => {
  if (isAuthorised(roles, user, createType, uuids)) {
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }

  return null;
};

PermissionWrapper.propTypes = {
  roles: PropTypes.array.isRequired,
  uuids: PropTypes.array.isRequired,
  createType: PropTypes.string
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(PermissionWrapper);