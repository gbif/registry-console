import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// API
import { deleteInstitution, updateInstitution } from '../../api/institution';
// Wrappers
import { HasRole } from '../auth';
// Components
import { ConfirmButton } from '../common';

/**
 * institution Actions component
 * Displays buttons depends on user's roles and scope, and item's state
 * @param uuids - active user UUID scope
 * @param institution - active item object
 * @param onChange - callback to invoke any parent process
 * @returns {*}
 * @constructor
 */
const InstitutionActions = ({ institution, onChange }) => {
  const restoreItem = () => {
    delete institution.deleted;

    updateInstitution(institution).then(() => onChange()).catch(onChange);
  };

  const deleteItem = () => {
    deleteInstitution(institution.key).then(() => onChange()).catch(onChange);
  };


  return (
    <React.Fragment>
      <HasRole roles={'REGISTRY_ADMIN'}>
        {institution.deleted ? (
          <ConfirmButton
            title={
              <FormattedMessage
                id="restore.confirmation"
                defaultMessage="Restoring a previously deleted entity will likely trigger significant processing"
              />
            }
            btnText={<FormattedMessage id="restore.institution" defaultMessage="Restore this institution"/>}
            onConfirm={restoreItem}
          />
        ) : (
          <ConfirmButton
            title={
              <FormattedMessage
                id="delete.confirmation.institution"
                defaultMessage="Are you sure to delete this institution?"
              />
            }
            btnText={<FormattedMessage id="delete.institution" defaultMessage="Delete this institution"/>}
            onConfirm={deleteItem}
          />
        )}
      </HasRole>
    </React.Fragment>
  );
};

InstitutionActions.propTypes = {
  institution: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default InstitutionActions;