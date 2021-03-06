import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// API
import { deletePerson, updatePerson } from '../../api/grscicollPerson';
import { canDelete, canUpdate } from '../../api/permissions';
// Wrappers
import { HasAccess } from '../auth';
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
      {person.deleted && <HasAccess fn={() => canUpdate('grscicoll/person', person.key)}>
        <ConfirmButton
          title={
            <FormattedMessage
              id="restore.confirmation"
              defaultMessage="Restoring a previously deleted entity will likely trigger significant processing"
            />
          }
          btnText={<FormattedMessage id="restore.person" defaultMessage="Restore this person" />}
          onConfirm={restoreItem}
        />
      </HasAccess>
      }
      {!person.deleted && <HasAccess fn={() => canDelete('grscicoll/person', person.key)}>
        <ConfirmButton
          title={
            <FormattedMessage
              id="delete.confirmation.person"
              defaultMessage="Are you sure to delete this person?"
            />
          }
          btnText={<FormattedMessage id="delete.person" defaultMessage="Delete this person" />}
          onConfirm={deleteItem}
        />
      </HasAccess>
      }
    </React.Fragment>
  );
};

PersonActions.propTypes = {
  person: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default PersonActions;