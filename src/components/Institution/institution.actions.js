import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Modal, Input, Button, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom';
import config from '../../api/util/config';

// API
import { suggestConvertInstitution, suggestDeleteInstitution, suggestMergeInstitution, deleteInstitution, updateInstitution, mergeInstitutions, convertToCollection } from '../../api/institution';
import { canDelete, canCreate, canUpdate } from '../../api/permissions';
// Wrappers
import withContext from '../hoc/withContext';
// Components
import { InstitutionSuggestWithoutContext as InstitutionSuggest } from '../common';

const { TextArea } = Input;

const styles = {};

/**
 * Institution Actions component
 * @param uuids - active user UUID scope
 * @param institution - active item object
 * @param onChange - callback to invoke any parent process
 * @param intl - react-intl injected object responsible for localization
 * @returns {*}
 * @constructor
 */
class InstitutionActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mergeWithInstitution: undefined,
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
    const hasDelete = await canDelete('grscicoll/institution', this.props.institution.key);
    const hasUpdate = await canUpdate('grscicoll/institution', this.props.institution.key);
    const hasMerge = await canCreate('grscicoll/institution', this.props.institution.key, 'merge');
    const hasConvertToCollection = await canCreate('grscicoll/institution', this.props.institution.key, 'convertToCollection');
    if (this._isMount) {
      // update state
      this.setState({ hasDelete, hasUpdate, hasMerge, hasConvertToCollection });
    };
    //else the component is unmounted and no updates should be made
  }

  renderActionMenu = () => {
    const { institution } = this.props;

    return <Menu onClick={event => this.callConfirmWindow(event.key)}>
      {institution.deleted && (
        <Menu.Item key="restore" disabled={!this.state.hasUpdate}>
          <FormattedMessage id="restore.institution" defaultMessage="Restore this institution" />
        </Menu.Item>
      )}
      {!institution.deleted && (
        <Menu.Item key="delete">
          <FormattedMessage id="delete.institution" defaultMessage="Delete this institution" />
          {!this.state.hasDelete && <span style={{ color: '#aaa', marginLeft: 8 }}>
            <FormattedMessage id="suggest" defaultMessage="Suggest" />
          </span>}
        </Menu.Item>
      )}
      {!institution.deleted && (
        <Menu.Item key="merge">
          <FormattedMessage id="institution.merge" defaultMessage="Merge with other institution" />
          {!this.state.hasMerge && <span style={{ color: '#aaa', marginLeft: 8 }}>
            <FormattedMessage id="suggest" defaultMessage="Suggest" />
          </span>}
        </Menu.Item>
      )}
      {!institution.deleted && (
        <Menu.Item key="convert">
          <FormattedMessage id="institution.convertToCollection" defaultMessage="Convert to collection" />
          {!this.state.hasConvertToCollection && <span style={{ color: '#aaa', marginLeft: 8 }}>
            <FormattedMessage id="suggest" defaultMessage="Suggest" />
          </span>}
        </Menu.Item>
      )}
      <Menu.Item key="create">
        <Link to={`/institution/create`}>
          <FormattedMessage id="institution.create" defaultMessage="Create new institution" />
        </Link>
      </Menu.Item>
      <Menu.Item key="createCollection">
        <Link to={`/collection/create`}>
          <FormattedMessage id="collection.create" defaultMessage="Create new collection" />
        </Link>
      </Menu.Item>
      
      <Menu.Item key="latimerCore">
        <a download="latimer-core" href={`${config.dataApi_v1}/grscicoll/institution/latimerCore/${institution.key}`}>
          <FormattedMessage id="downloadAsLatimerCore" defaultMessage="Download as Latimer Core" />
        </a>
      </Menu.Item>
    </Menu>;
  };

  callConfirmWindow = actionType => {
    const { intl } = this.props;
    let title;

    switch (actionType) {
      case 'delete': {
        title = <div>
          {intl.formatMessage({
            id: 'delete.confirmation.collection',
            defaultMessage: 'Are you sure you want to delete this collection? '
          })
          }
          {!this.state.hasDelete && <div>
            {intl.formatMessage({
              id: "suggest.youCanOnlySuggest",
              defaultMessage: "You can only suggest this action"
            })
            }
          </div>}
        </div>;
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
        id: 'institution.chooseMergeInstitution',
        defaultMessage: 'Choose institution to merge with'
      });
      this.showMergeConfirm(ms);
    }

    if (actionType === 'convert') {
      this.showConvertModal();
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
    const description = intl.formatMessage({ id: 'institition.merge.comment', defaultMessage: 'This institution will be deleted after merging.' });
    const mergeLabel = intl.formatMessage({ id: 'merge', defaultMessage: 'Merge' });
    const cancelLabel = intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' });
    Modal.confirm({
      title,
      okText: mergeLabel,
      okType: 'primary',
      cancelText: cancelLabel,
      content: <div style={{ paddingRight: '12px' }}> 
        <InstitutionSuggest hiddenEntries={[this?.props?.institution?.key]} user={user} intl={intl} value={this.state.mergeWithInstitution} onChange={institution => this.setState({ mergeWithInstitution: institution })} style={{ width: '100%' }} />
        <div style={{ marginTop: 10, color: '#888' }}>
          {description}
        </div>
      </div>,
      onOk: this.merge
    });
  };

  showConvertModal = () => {
    const { intl, user, collectionCount } = this.props;
    const title = 'Convert to collection';
    const description = intl.formatMessage({ id: 'institition.convert.comment', defaultMessage: 'This institution will be deleted after merging.' });
    const createNewInstitution = intl.formatMessage({ id: 'institition.convert.createNew', defaultMessage: 'Create new institution' });
    const institutionNamePlaceholder = intl.formatMessage({ id: 'institution.convert.newName', defaultMessage: 'New institution name' });
    const mergeLabel = intl.formatMessage({ id: 'convert', defaultMessage: 'Convert' });
    const cancelLabel = intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' });

    function Content({ onChange, user, intl }) {
      const [config, setConfig] = useState({});
      return <div>
        <Checkbox onChange={() => {
          const c = { value: undefined, asNew: !config.asNew }
          onChange(c);
          setConfig(c);
        }} checked={config.asNew}>{createNewInstitution}</Checkbox>
        {!config.asNew && <div>
          <InstitutionSuggest user={user} intl={intl} value={config.uuid} onChange={uuid => {
            const c = { value: uuid, asNew: false }
            onChange(c);
            setConfig(c);
          }} style={{ width: '100%' }} />
          <div style={{ marginTop: 10, color: '#888' }}>
            {description}
          </div>
          {collectionCount > 0 && <div style={{ marginTop: 10, color: 'tomato' }}>Contains collections</div>}
        </div>}
        {config.asNew && <div>
          <Input placeholder={institutionNamePlaceholder} onChange={e => {
            const c = { value: e.target.value, asNew: true }
            onChange(c);
            setConfig(c);
          }} />
          <div style={{ marginTop: 10, color: '#888' }}>
            {description}
          </div>
        </div>}
      </div>;
    }

    Modal.confirm({
      title,
      okText: mergeLabel,
      okType: 'primary',
      cancelText: cancelLabel,
      content: <Content
        onChange={convertConfig => this.setState({ convertConfig })}
        user={user}
        intl={intl}
      />,
      onOk: this.convert
    });
  };

  showSuggestConfirm = ({ title, action }) => {
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
        <Input onChange={e => this.setState({ proposerEmail: e.target.value })} defaultvalue={this.state.proposerEmail} type="text" placeholder="email" style={{ marginBottom: 12 }}></Input>
        <TextArea onChange={e => this.setState({ suggestComment: e.target.value })} type="text" placeholder="comment"></TextArea>
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
    const { institution, onChange } = this.props;
    const { mergeWithInstitution } = this.state;
    if (this.state.hasDelete) {
      mergeInstitutions({ institutionKey: institution.key, mergeIntoInstitutionKey: mergeWithInstitution }).then(() => onChange(null, 'crawl')).catch(onChange);
    } else {
      this.showSuggestConfirm({
        title: this.props.intl.formatMessage({id:"suggestion.pleaseProvideEmailAndComment", defaultMessage:'You are about to leave a suggestion, please provide your email and a comment'}),
        action: () => {
          suggestMergeInstitution({ mergeTargetKey: mergeWithInstitution, entityKey: institution.key, comments: [this.state.suggestComment], proposerEmail: this.state.proposerEmail })
          .then(() => this.props.addSuccess({ statusText: this.props.intl.formatMessage({id:"suggestion.suggestionLogged", defaultMessage:"Thank you. Your suggestion has been logged"}) }))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            })
        }
      });
    }
  };

  convert = () => {
    const { institution, onChange } = this.props;
    const { convertConfig } = this.state;
    if (typeof convertConfig.value === 'undefined') {
      alert('No new institution selected. Action cancelled');
      return;
    }

    let body = {};
    if (convertConfig.asNew) {
      body.nameForNewInstitution = convertConfig.value;
    } else {
      body.institutionForNewCollectionKey = convertConfig.value;
    }

    if (this.state.hasConvertToCollection) {
      convertToCollection({ institutionKey: institution.key, body }).then(() => onChange(null, 'crawl')).catch(onChange);
    } else {
      this.showSuggestConfirm({
        title: this.props.intl.formatMessage({id: "suggestion.pleaseProvideEmailAndComment", defaultMessage: 'You are about to leave a suggestion, please provide your email and a comment'}),
        action: () => {
          suggestConvertInstitution({
            institutionForConvertedCollection: body.institutionForNewCollectionKey,
            nameForNewInstitutionForConvertedCollection: body.nameForNewInstitution,
            entityKey: institution.key,
            comments: [this.state.suggestComment],
            proposerEmail: this.state.proposerEmail
          })
            .then(() => this.props.addSuccess({ statusText: this.props.intl.formatMessage({id:"suggestion.suggestionLogged", defaultMessage:"Thank you. Your suggestion has been logged"}) }))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            })
        }
      });
    }

  };

  restoreItem = () => {
    const { institution, onChange } = this.props;
    delete institution.deleted;
    updateInstitution(institution).then(() => onChange()).catch(onChange);
  };

  deleteItem = () => {
    const { institution, onChange } = this.props;
    if (this.state.hasDelete) {
      deleteInstitution(institution.key).then(() => onChange()).catch(onChange);
    } else {
      this.showSuggestConfirm({
        title: this.props.intl.formatMessage({id: "suggestion.pleaseProvideEmailAndComment", defaultMessage: 'You are about to leave a suggestion, please provide your email and a comment'}),
        action: () => {
          suggestDeleteInstitution({ entityKey: institution.key, comments: [this.state.suggestComment], proposerEmail: this.state.proposerEmail })
          .then(() => this.props.addSuccess({ statusText: this.props.intl.formatMessage({id:"suggestion.suggestionLogged", defaultMessage:"Thank you. Your suggestion has been logged"}) }))
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
        <Button><MoreOutlined />
          <FormattedMessage id="more" defaultMessage="More" />
        </Button>
      </Dropdown>
    );
  }
}

InstitutionActions.propTypes = {
  // uuids: PropTypes.array.isRequired,
  institution: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

const mapContextToProps = ({ addError, addSuccess, user }) => ({ user, addError, addSuccess });

export default withContext(mapContextToProps)(injectIntl(injectSheet(styles)(InstitutionActions)));