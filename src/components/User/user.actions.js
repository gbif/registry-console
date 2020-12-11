import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// API
import { deleteUser } from '../../api/user';
// Enums
import { roles } from '../auth/enums';
// Wrappers
import { HasRole } from '../auth';
// Components
import { ConfirmButton } from '../common';

/**
 * User Actions component
 * Displays buttons depends on user's roles and scope, and item's state
 * @param user - active item object
 * @param onChange - callback to invoke any parent process
 * @returns {*}
 * @constructor
 */
const UserActions = ({ user, onChange }) => {
  const deleteItem = () => {
    deleteUser(user.userName).then(() => onChange()).catch(onChange);
  };

  return (
    <React.Fragment>
      <HasRole roles={[roles.REGISTRY_ADMIN]}>
        <ConfirmButton
          title={
            <FormattedMessage
              id="delete.confirmation.user"
              defaultMessage="Are you sure to delete this user?"
            />
          }
          btnText={<FormattedMessage id="delete.user" defaultMessage="Delete this user" />}
          onConfirm={deleteItem}
        />
      </HasRole>
    </React.Fragment>
  );
};

UserActions.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default UserActions;