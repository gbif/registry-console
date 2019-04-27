import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// API
import { deletePerson, updatePerson } from '../../api/grscicollPerson';
// Wrappers
import { HasRole, roles } from '../auth';
// Components
import { ConfirmButton } from '../common';

/**
 * person Actions component
 * Displays buttons depends on user's roles and scope, and item's state
 * @param uuids - active user UUID scope
 * @param person - active item object
 * @param onChange - callback to invoke any parent process
 * @returns {*}
 * @constructor
 */
const PersonActions = ({ person, onChange }) => {
  const restoreItem = () => {
    delete person.deleted;

    updatePerson(person).then(() => onChange()).catch(onChange);
  };

  const deleteItem = () => {
    deletePerson(person.key).then(() => onChange()).catch(onChange);
  };


  return (
    <React.Fragment>
      <HasRole roles={[roles.REGISTRY_ADMIN, roles.GRSCICOLL_ADMIN]}>
        {person.deleted ? (
          <ConfirmButton
            title={
              <FormattedMessage
                id="restore.confirmation"
                defaultMessage="Restoring a previously deleted entity will likely trigger significant processing"
              />
            }
            btnText={<FormattedMessage id="restore.person" defaultMessage="Restore this person"/>}
            onConfirm={restoreItem}
          />
        ) : (
          <ConfirmButton
            title={
              <FormattedMessage
                id="delete.confirmation.person"
                defaultMessage="Are you sure to delete this person?"
              />
            }
            btnText={<FormattedMessage id="delete.person" defaultMessage="Delete this person"/>}
            onConfirm={deleteItem}
          />
        )}
      </HasRole>
    </React.Fragment>
  );
};

PersonActions.propTypes = {
  person: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default PersonActions;