import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Dropdown, Menu, Modal, Icon, Button } from 'antd';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

// API
import { deleteCollection, updateCollection, mergeCollections } from '../../api/collection';
// Wrappers
import { hasRole, HasRole, roles } from '../auth';
import withContext from '../hoc/withContext';
// Components
import { CollectionSuggestWithoutContext as CollectionSuggest } from '../common';

const styles = {

};

/**
 * Collection Actions component
 * @param uuids - active user UUID scope
 * @param collection - active item object
 * @param onChange - callback to invoke any parent process
 * @param intl - react-intl injected object responsible for localization
 * @returns {*}
 * @constructor
 */
class CollectionActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mergeWithCollection: undefined
    };
  }

  renderActionMenu = () => {
    const { collection, user } = this.props;
    return <Menu onClick={event => this.callConfirmWindow(event.key)}>
      {collection.deleted && hasRole(user, [roles.GRSCICOLL_ADMIN]) && (
        <Menu.Item key="restore">
          <FormattedMessage id="restore.collection" defaultMessage="Restore this collection" />
        </Menu.Item>
      )}
      {!collection.deleted && hasRole(user, [roles.GRSCICOLL_ADMIN]) && (
        <Menu.Item key="delete">
          <FormattedMessage id="delete.collection" defaultMessage="Delete this collection" />
        </Menu.Item>
      )}
      {hasRole(user, [roles.GRSCICOLL_ADMIN]) && (
        <Menu.Item key="merge">
          <FormattedMessage id="collection.merge" defaultMessage="Merge with other collection" />
        </Menu.Item>
      )}
    </Menu>;
  };

  callConfirmWindow = actionType => {
    const { intl } = this.props;
    let title;

    switch (actionType) {
      case 'delete': {
        title = intl.formatMessage({
          id: 'delete.confirmation.collection',
          defaultMessage: 'Are you sure to delete this collection?'
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
      this.showConfirm(title, actionType);
    }

    if (actionType === 'merge') {
      // open popup with options for which steps to rerun.
      let ms = intl.formatMessage({
        id: 'collection.chooseMergeCollection',
        defaultMessage: 'Choose collection to merge with'
      });
      this.showMergeConfirm(ms);
    }
  };

  showConfirm = (title, actionType) => {
    Modal.confirm({
      title,
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk: () => this.callAction(actionType)
    });
  };

  showMergeConfirm = title => {
    const { intl, user } = this.props;

    const description = intl.formatMessage({ id: 'collection.merge.comment', defaultMessage: 'This collection will be deleted after merging.' });
    const mergeLabel = intl.formatMessage({ id: 'merge', defaultMessage: 'Merge' });
    const cancelLabel = intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' });
    Modal.confirm({
      title,
      okText: mergeLabel,
      okType: 'primary',
      cancelText: cancelLabel,
      content: <div>
        <CollectionSuggest user={user} intl={intl} value={this.state.mergeWithCollection} onChange={collection => this.setState({ mergeWithCollection: collection })} style={{ width: '100%' }} />
        <div style={{ marginTop: 10, color: '#888' }}>
          {description}
        </div>
      </div>,
      onOk: this.merge
    });
  };

  callAction = actionType => {
    switch (actionType) {
      case 'delete':
        this.deleteItem();
        break;
      case 'restore':
        this.restoreItem();
        break;
      default:
        break;
    }
  };

  merge = () => {
    const { collection, onChange } = this.props;
    const { mergeWithCollection } = this.state;
    mergeCollections({ collectionKey: collection.key, mergeIntoCollectionKey: mergeWithCollection }).then(() => onChange(null, 'crawl')).catch(onChange);
  };

  restoreItem = () => {
    const { collection, onChange } = this.props;
    delete collection.deleted;
    updateCollection(collection).then(() => onChange()).catch(onChange);
  };

  deleteItem = () => {
    const { collection, onChange } = this.props;
    deleteCollection(collection.key).then(() => onChange()).catch(onChange);
  };

  render = () => {
    return (
      <HasRole roles={[roles.GRSCICOLL_ADMIN]}>
        <Dropdown overlay={this.renderActionMenu()} arrow>
          <Button><Icon type="more" /></Button>
        </Dropdown>
      </HasRole>
    );
  }
}

CollectionActions.propTypes = {
  collection: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(injectIntl(injectSheet(styles)(CollectionActions)));