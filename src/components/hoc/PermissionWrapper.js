import React from 'react';

import withContext from './withContext';

const PermissionWrapper = props => {
  const isAuthorised = () => {
    const { user, roles } = props;

    return !roles || (user && user.roles.some(role => roles.includes(role)));
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

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(PermissionWrapper);