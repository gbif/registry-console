import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// API
import { deleteCollection, updateCollection } from '../../api/collection';
// Wrappers
import { HasRole, roles } from '../auth';
// Components
import { ConfirmButton } from '../common';

/**
 * collection Actions component
 * Displays buttons depends on user's roles and scope, and item's state
 * @param uuids - active user UUID scope
 * @param collection - active item object
 * @param onChange - callback to invoke any parent process
 * @returns {*}
 * @constructor
 */
const CollectionActions = ({ collection, onChange }) => {
  const restoreItem = () => {
    delete collection.deleted;

    updateCollection(collection).then(() => onChange()).catch(onChange);
  };

  const deleteItem = () => {
    deleteCollection(collection.key).then(() => onChange()).catch(onChange);
  };


  return (
    <React.Fragment>
      <HasRole roles={[roles.REGISTRY_ADMIN, roles.GRSCICOLL_ADMIN]}>
        {collection.deleted ? (
          <ConfirmButton
            title={
              <FormattedMessage
                id="restore.confirmation"
                defaultMessage="Restoring a previously deleted entity will likely trigger significant processing"
              />
            }
            btnText={<FormattedMessage id="restore.collection" defaultMessage="Restore this collection"/>}
            onConfirm={restoreItem}
          />
        ) : (
          <ConfirmButton
            title={
              <FormattedMessage
                id="delete.confirmation.collection"
                defaultMessage="Are you sure to delete this collection?"
              />
            }
            btnText={<FormattedMessage id="delete.collection" defaultMessage="Delete this collection"/>}
            onConfirm={deleteItem}
          />
        )}
      </HasRole>
    </React.Fragment>
  );
};

CollectionActions.propTypes = {
  collection: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default CollectionActions;