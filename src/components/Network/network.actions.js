import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// API
import { deleteNetwork } from '../../api/network';
import { canDelete, canUpdate } from '../../api/permissions';
// Wrappers
import { HasAccess } from '../auth';
import withContext from '../hoc/withContext';
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
const NetworkActions = ({ network, onChange, user }) => {
  const deleteItem = () => {
    deleteNetwork(network.key).then(() => onChange()).catch(onChange);
  };

  return (
    <React.Fragment>
      {network.deleted && <HasAccess fn={() => canUpdate('network', network.key)}>
        <ConfirmButton
          title={
            <FormattedMessage
              id="restore.confirmation"
              defaultMessage="Restoring a previously deleted entity will likely trigger significant processing"
            />
          }
          btnText={<FormattedMessage id="restore.institution" defaultMessage="Restore this institution" />}
          onConfirm={deleteItem}
        />
      </HasAccess>
      }
      {!network.deleted && <HasAccess fn={() => canDelete('network', network.key)}>
        <ConfirmButton
          title={
            <FormattedMessage
              id="delete.confirmation.network"
              defaultMessage="Are you sure to delete this network?"
            />
          }
          btnText={<FormattedMessage id="delete.network" defaultMessage="Delete this network" />}
          onConfirm={deleteItem}
        />
      </HasAccess>
      }
    </React.Fragment>
  );
};

NetworkActions.propTypes = {
  network: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

const mapContextToProps = ({ user }) => ({ user });
export default withContext(mapContextToProps)(NetworkActions);