import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// API
import { deleteNetwork } from '../../api/network';
// Enums
import { roles } from '../auth/enums';
// Wrappers
import { HasRole } from '../auth';
// Components
import { ConfirmButton } from '../common';

/**
 * Network Actions component
 * Displays buttons depends on user's roles and scope, and item's state
 * @param network - active item object
 * @param onChange - callback to invoke any parent process
 * @returns {*}
 * @constructor
 */
const NetworkActions = ({ network, onChange }) => {
  const deleteItem = () => {
    deleteNetwork(network.key).then(() => onChange()).catch(onChange);
  };

  return (
    <React.Fragment>
      <HasRole roles={[roles.REGISTRY_ADMIN]}>
        {network.deleted ? null : (
          <ConfirmButton
            title={
              <FormattedMessage
                id="delete.confirmation.network"
                defaultMessage="Are you sure to delete this network?"
              />
            }
            btnText={<FormattedMessage id="delete.network" defaultMessage="Delete this network"/>}
            onConfirm={deleteItem}
          />
        )}
      </HasRole>
    </React.Fragment>
  );
};

NetworkActions.propTypes = {
  network: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default NetworkActions;