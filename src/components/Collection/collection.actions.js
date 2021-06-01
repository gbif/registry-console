import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Dropdown, Menu, Modal, Icon, Button, Input } from 'antd';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

// API
import { suggestDeleteCollection, suggestMergeCollection, deleteCollection, updateCollection, mergeCollections } from '../../api/collection';
import { canDelete, canCreate, canUpdate } from '../../api/permissions';
// Wrappers
import withContext from '../hoc/withContext';
// Components
import { CollectionSuggestWithoutContext as CollectionSuggest } from '../common';

const { TextArea } = Input;

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
      mergeWithCollection: undefined,
      proposerEmail: props.user ? props.user.email : null
    };
  }


  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    this.getPermissions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.getPermissions();
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getPermissions = async () => {
    this.setState({ loadingPermissions: true });
    const hasDelete = await canDelete('grscicoll/collection', this.props.collection.key);
    const hasUpdate = await canUpdate('grscicoll/collection', this.props.collection.key);
    const hasMerge = await canCreate('grscicoll/collection', this.props.collection.key, 'merge');
    if (this._isMount) {
      // update state
      this.setState({ hasDelete, hasUpdate, hasMerge });
    };
    //else the component is unmounted and no updates should be made
  }

  renderActionMenu = () => {
    const { collection } = this.props;
    return <Menu onClick={event => this.callConfirmWindow(event.key)}>
      {collection.deleted && (
        <Menu.Item key="restore" disabled={!this.state.hasUpdate}>
          <FormattedMessage id="restore.collection" defaultMessage="Restore this collection" />
        </Menu.Item>
      )}
      {!collection.deleted && (
        <Menu.Item key="delete">
          <FormattedMessage id="delete.collection" defaultMessage="Delete this collection" />
        </Menu.Item>
      )}
      <Menu.Item key="merge">
        <FormattedMessage id="collection.merge" defaultMessage="Merge with other collection" />
      </Menu.Item>
    </Menu>;
  };

  callConfirmWindow = actionType => {
    const { intl } = this.props;
    let title;

    switch (actionType) {
      case 'delete': {
        title = <>{intl.formatMessage({
          id: 'delete.confirmation.collection',
          defaultMessage: 'Are you sure you want to delete this collection?'
        })}{this.state.hasDelete ? null : <div>You can only suggest this action</div>}</>;
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

  showSuggestConfirm = ({title, action}) => {
    // const { intl, user } = this.props;
    // const description = intl.formatMessage({ id: 'collection.merge.comment', defaultMessage: 'This collection will be deleted after merging.' });
    // const mergeLabel = intl.formatMessage({ id: 'merge', defaultMessage: 'Merge' });
    // const cancelLabel = intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' });
    Modal.confirm({
      title,
      okText: 'Send suggestion',
      okType: 'primary',
      cancelText: 'Cancel',
      content: <div>
        <Input onChange={e => this.setState({proposerEmail: e.target.value})} type="text" defaultValue={this.state.proposerEmail} placeholder="email" style={{marginBottom: 12}}></Input>
        <TextArea onChange={e => this.setState({suggestComment: e.target.value})} type="text" placeholder="comment"></TextArea>
      </div>,
      onOk: action
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
    if (this.state.hasDelete) {
      mergeCollections({ collectionKey: collection.key, mergeIntoCollectionKey: mergeWithCollection }).then(() => onChange(null, 'crawl')).catch(onChange);
    } else {
      this.showSuggestConfirm({
        title: <FormattedMessage id="suggestion.pleaseProvideEmailAndComment" defaultMessage='You are about to leave a suggestion, please provide your email and a comment' />,
        action: () => {
          suggestMergeCollection({mergeTargetKey: mergeWithCollection, entityKey: collection.key, comments: [this.state.suggestComment], proposerEmail: this.state.proposerEmail})
            .then(() => this.props.addSuccess({statusText: <FormattedMessage id="suggestion.suggestionLogged" defaultMessage="Thank you. Your suggestion has been logged" />}))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            })
        }
      });
    }
  };

  restoreItem = () => {
    const { collection, onChange } = this.props;
    delete collection.deleted;
    updateCollection(collection).then(() => onChange()).catch(onChange);
  };

  deleteItem = () => {
    const { collection, onChange } = this.props;
    if (this.state.hasDelete) {
      deleteCollection(collection.key).then(() => onChange()).catch(onChange);
    } else {
      this.showSuggestConfirm({
        title: <FormattedMessage id="suggestion.pleaseProvideEmailAndComment" defaultMessage='You are about to leave a suggestion, please provide your email and a comment' />, 
        action: () => {
          suggestDeleteCollection({entityKey: collection.key, comments: [this.state.suggestComment], proposerEmail: this.state.proposerEmail})
            .then(() => this.props.addSuccess({statusText: <FormattedMessage id="suggestion.suggestionLogged" defaultMessage="Thank you. Your suggestion has been logged" />}))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            })
        }
      });
    }
  };

  render = () => {
    return (
      <Dropdown overlay={this.renderActionMenu()} arrow>
        <Button><Icon type="more" />
          <FormattedMessage id="more" defaultMessage="More" />
        </Button>
      </Dropdown>
    );
  }
}

CollectionActions.propTypes = {
  collection: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

const mapContextToProps = ({ user, addSuccess }) => ({ user, addSuccess });

export default withContext(mapContextToProps)(injectIntl(injectSheet(styles)(CollectionActions)));