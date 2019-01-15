import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Dropdown, Menu, Modal } from 'antd';
import PropTypes from 'prop-types';

// API
import { crawlDataset, deleteDataset, updateDataset } from '../../api/dataset';
// Wrappers
import { HasScope } from '../auth';

/**
 * Dataset Actions component
 * @param uuids - active user UUID scope
 * @param dataset - active item object
 * @param onChange - callback to invoke any parent process
 * @param intl - react-intl injected object responsible for localization
 * @returns {*}
 * @constructor
 */
const DatasetActions = ({ uuids, dataset, onChange, intl }) => {
  const renderActionMenu = () => {
    return <Menu onClick={event => callConfirmWindow(event.key)}>
      {dataset.deleted && (
        <Menu.Item key="restore">
          <FormattedMessage id="restore.dataset" defaultMessage="Restore this dataset"/>
        </Menu.Item>
      )}
      {!dataset.deleted && (
        <Menu.Item key="delete">
          <FormattedMessage id="delete.dataset" defaultMessage="Delete this dataset"/>
        </Menu.Item>
      )}
    </Menu>;
  };

  const callConfirmWindow = actionType => {
    let title;

    switch (actionType) {
      case 'crawl': {
        title = dataset.publishingOrganization.endorsementApproved ?
          intl.formatMessage({
            id: 'endorsed.crawl.message',
            defaultMessage: 'This will trigger a crawl of the dataset.'
          }) :
          intl.formatMessage({
            id: 'notEndorsed.crawl.message',
            defaultMessage: 'This dataset\'s publishing organization is not endorsed yet! This will trigger a crawl of the dataset, and should only be done in a 1_2_27 environment'
          });
        break;
      }
      case 'delete': {
        title = intl.formatMessage({
          id: 'delete.confirmation.dataset',
          defaultMessage: 'Are you sure to delete this dataset?'
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
        crawl();
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

  const crawl = () => {
    crawlDataset(dataset.key).then(() => onChange(null, 'crawl')).catch(onChange);
  };

  const restoreItem = () => {
    delete dataset.deleted;

    updateDataset(dataset).then(() => onChange()).catch(onChange);
  };

  const deleteItem = () => {
    deleteDataset(dataset.key).then(() => onChange()).catch(onChange);
  };

  return (
    <HasScope uuids={uuids}>
      <Dropdown.Button onClick={() => callConfirmWindow('crawl')} overlay={renderActionMenu()}>
        <FormattedMessage id="crawl" defaultMessage="Crawl"/>
      </Dropdown.Button>
    </HasScope>
  );
};

DatasetActions.propTypes = {
  uuids: PropTypes.array.isRequired,
  dataset: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
};

export default injectIntl(DatasetActions);