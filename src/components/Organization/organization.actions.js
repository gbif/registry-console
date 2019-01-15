import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// API
import { deleteOrganization, updateOrganization } from '../../api/organization';
// Wrappers
import { HasScope } from '../auth';
// Components
import { ConfirmButton } from '../common';

const OrganizationActions = ({ uuids, organization, onChange }) => {
  const restoreItem = () => {
    delete organization.deleted;

    updateOrganization(organization).then(() => onChange()).catch(onChange);
  };

  const deleteItem = () => {
    deleteOrganization(organization.key).then(() => onChange()).catch(onChange);
  };

  return (
    <HasScope uuids={uuids}>
      {organization.deleted ? (
        <ConfirmButton
          title={
            <FormattedMessage
              id="restore.confirmation"
              defaultMessage="Restoring a previously deleted entity will likely trigger significant processing"
            />
          }
          btnText={<FormattedMessage id="restore.organization" defaultMessage="Restore this organization"/>}
          onConfirm={restoreItem}
        />
      ) : (
        <ConfirmButton
          title={
            <FormattedMessage
              id="delete.confirmation.organization"
              defaultMessage="Are you sure to delete this organization?"
            />
          }
          btnText={<FormattedMessage id="delete.organization" defaultMessage="Delete this organization"/>}
          onConfirm={deleteItem}
        />
      )}
    </HasScope>
  );
};

OrganizationActions.propTypes = {
  uuids: PropTypes.array.isRequired,
  organization: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default OrganizationActions;