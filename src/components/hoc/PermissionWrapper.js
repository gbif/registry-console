import React from 'react';
import { connect } from 'react-redux';

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

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(PermissionWrapper);