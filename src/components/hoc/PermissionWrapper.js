import React from 'react';
import PropTypes from 'prop-types';

import withContext from './withContext';

const PermissionWrapper = props => {
  const isAuthorised = () => {
    const { user, roles, item } = props;

    if (!roles || user.roles.includes('REGISTRY_ADMIN')) {
      return true;
    }

    if (user && user.roles.includes('REGISTRY_EDITOR') && item) {
      // User's scope, Node or Organization
      if (user.editorRoleScopes.includes(item.key)) {
        return true;
      }
      // User's scope Node (endorsing node)
      if (user.editorRoleScopes.includes(item.endorsingNodeKey)) {
        return true;
      }
      // User's scope Organization (hosted organization)
      if (user.editorRoleScopes.includes(item.publishingOrganizationKey)) {
        return true;
      }
    }

    return false;
  };

  if (isAuthorised()) {
    return (
      <React.Fragment>
        {props.children}
      </React.Fragment>
    );
  }

  return null;
};

PermissionWrapper.propTypes = {
  roles: PropTypes.array.isRequired,
  item: PropTypes.object
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(PermissionWrapper);