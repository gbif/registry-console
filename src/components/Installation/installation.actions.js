import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Modal, Menu } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// API
import { deleteInstallation, syncInstallation, updateInstallation } from '../../api/installation';
// Wrappers
import { HasRole, HasScope } from '../auth';
// Components
import { ConfirmButton } from '../common';

const InstallationActions = ({ uuids, installation, canBeSynchronized, onChange, intl }) => {
  const callConfirmWindow = actionType => {
    let title;

    switch (actionType) {
      case 'sync': {
        title = intl.formatMessage({
          id: 'installation.sync.message',
          defaultMessage: 'This will trigger a synchronization of the installation.'
        });
        break;
      }
      case 'delete': {
        title = intl.formatMessage({
          id: 'delete.confirmation.installation',
          defaultMessage: 'Are you sure to delete this installation?'
        });
        break;
      }
      case 'restore': {
        title = intl.formatMessage({
          id: 'restore.confirmation',
          defaultMessage: 'Restoring a previously deleted entity will likely trigger significant processing'
        });
        break;
      }
      default:
        break;
    }

    if (title) {
      showConfirm(title, actionType);
    }
  };

  const showConfirm = (title, actionType) => {
    Modal.confirm({
      title,
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk: () => callAction(actionType)
    });
  };

  const callAction = actionType => {
    switch (actionType) {
      case 'crawl':
        synchronize();
        break;
      case 'delete':
        deleteItem();
        break;
      case 'restore':
        restoreItem();
        break;
      default:
        break;
    }
  };

  const synchronize = () => {
    syncInstallation(installation.key).then(() => onChange(null, 'sync')).catch(onChange);
  };

  const restoreItem = () => {
    delete installation.deleted;

    updateInstallation(installation).then(() => onChange()).catch(onChange);
  };

  const deleteItem = () => {
    deleteInstallation(installation.key).then(() => onChange()).catch(onChange);
  };

  const renderActionMenu = () => {
    return <Menu onClick={event => callConfirmWindow(event.key)}>
      {installation.deleted && (
        <Menu.Item key="restore">
          <FormattedMessage id="restore.installation" defaultMessage="Restore this installation"/>
        </Menu.Item>
      )}
      {!installation.deleted && (
        <Menu.Item key="delete">
          <FormattedMessage id="delete.installation" defaultMessage="Delete this installation"/>
        </Menu.Item>
      )}
    </Menu>;
  };

  return (
    <React.Fragment>
      {canBeSynchronized ? (
        <HasRole roles={'REGISTRY_ADMIN'}>
          <Dropdown.Button onClick={() => callConfirmWindow('sync')} overlay={renderActionMenu()}>
            <FormattedMessage id="synchronizeNow" defaultMessage="Synchronize now"/>
          </Dropdown.Button>
        </HasRole>
      ) : (
        <HasScope uuids={uuids}>
          {installation.deleted ? (
            <ConfirmButton
              title={
                <FormattedMessage
                  id="restore.confirmation"
                  defaultMessage="Restoring a previously deleted entity will likely trigger significant processing"
                />
              }
              btnText={<FormattedMessage id="restore.installation" defaultMessage="Restore this installation"/>}
              onConfirm={restoreItem}
            />
          ) : (
            <ConfirmButton
              title={
                <FormattedMessage
                  id="delete.confirmation.installation"
                  defaultMessage="Are you sure to delete this installation?"
                />
              }
              btnText={<FormattedMessage id="delete.installation" defaultMessage="Delete this installation"/>}
              onConfirm={deleteItem}
            />
          )}
        </HasScope>
      )}
    </React.Fragment>
  );
};

InstallationActions.propTypes = {
  uuids: PropTypes.array.isRequired,
  installation: PropTypes.object.isRequired,
  canBeSynchronized: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
};

export default injectIntl(InstallationActions);