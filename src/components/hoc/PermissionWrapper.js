import React from 'react';
import PropTypes from 'prop-types';

import withContext from './withContext';
import { canCreateItem } from '../helpers';

/**
 * Wrapper to check if the current user can have access to wrapped controls or not
 * @param user - active user (from App Context)
 * @param roles - array of required roles
 * @param uid - array of UIDs to check permissions to create/edit item or subtypes
 * @param createType - type of item to create
 * @param children - wrapped content, usually controls
 * @returns {*}
 * @constructor
 */
const PermissionWrapper = ({ user, roles, uid, createType, children }) => {
  const isAuthorised = () => {
    if (!roles || (user && user.roles.includes('REGISTRY_ADMIN'))) {
      return true;
    }

    /**
     * If user's scope contains given UID he can work with item
     * The UID could be:
     * - organization key,
     * - organization endorsingNodeKey,
     * - dataset: publishingOrganizationKey (publishing organization)
     * - dataset: organizationKey taken from installation by dataset's installationKey (hosting organization)
     * TODO: add endorsing of organization of installation of dataset
     */
    if (user && user.roles.includes('REGISTRY_EDITOR')) {
      if (createType) {
        return canCreateItem(user.editorRoleScopeItems, createType);
      }

      return uid.some(key => user.editorRoleScopes.includes(key));
    }

    return false;
  };

  if (isAuthorised()) {
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
  uid: PropTypes.array.isRequired,
  createType: PropTypes.string
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(PermissionWrapper);