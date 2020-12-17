import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Dropdown, Menu, Modal, Icon, Input, Button, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

// API
import { deleteInstitution, updateInstitution, mergeInstitutions, convertToCollection } from '../../api/institution';
// Wrappers
import { hasRole, HasRole, roles } from '../auth';
import withContext from '../hoc/withContext';
// Components
import { InstitutionSuggestWithoutContext as InstitutionSuggest } from '../common';

const styles = {

};

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
      mergeWithInstitution: undefined
    };
  }

  renderActionMenu = () => {
    const { institution, collectionCount, user } = this.props;

    return <Menu onClick={event => this.callConfirmWindow(event.key)}>
      {institution.deleted && hasRole(user, [roles.GRSCICOLL_ADMIN]) && (
        <Menu.Item key="restore">
          <FormattedMessage id="restore.institution" defaultMessage="Restore this institution" />
        </Menu.Item>
      )}
      {!institution.deleted && hasRole(user, [roles.GRSCICOLL_ADMIN]) && (
        <Menu.Item key="delete">
          <FormattedMessage id="delete.institution" defaultMessage="Delete this institution" />
        </Menu.Item>
      )}
      {hasRole(user, [roles.GRSCICOLL_ADMIN]) && (
        <Menu.Item key="merge">
          <FormattedMessage id="institution.merge" defaultMessage="Merge with other institution" />
        </Menu.Item>
      )}
      {hasRole(user, [roles.GRSCICOLL_ADMIN]) && (
        <Menu.Item key="convert">
          <FormattedMessage id="institution.convertToCollection" defaultMessage="Convert to collection" />
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
          id: 'delete.confirmation.institution',
          defaultMessage: 'Are you sure to delete this institution?'
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
      content: <div>
        <InstitutionSuggest user={user} intl={intl} value={this.state.mergeWithInstitution} onChange={institution => this.setState({ mergeWithInstitution: institution })} style={{ width: '100%' }} />
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

    function Content({onChange, user, intl}) {
      const [config, setConfig] = useState({});
      return <div>
        <Checkbox onChange={() => {
          const c = {value: undefined, asNew: !config.asNew}
          onChange(c);
          setConfig(c);
        }} checked={config.asNew}>{createNewInstitution}</Checkbox>
        {!config.asNew && <div>
          <InstitutionSuggest user={user} intl={intl} value={config.uuid} onChange={uuid => {
            const c = {value: uuid, asNew: false}
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
            const c = {value: e.target.value, asNew: true}
            onChange(c);
            setConfig(c);
          }}/>
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
    mergeInstitutions({ institutionKey: institution.key, mergeIntoInstitutionKey: mergeWithInstitution }).then(() => onChange(null, 'crawl')).catch(onChange);
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
    convertToCollection({ institutionKey: institution.key, body }).then(() => onChange(null, 'crawl')).catch(onChange);
  };

  restoreItem = () => {
    const { institution, onChange } = this.props;
    delete institution.deleted;
    updateInstitution(institution).then(() => onChange()).catch(onChange);
  };

  deleteItem = () => {
    const { institution, onChange } = this.props;
    deleteInstitution(institution.key).then(() => onChange()).catch(onChange);
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

InstitutionActions.propTypes = {
  // uuids: PropTypes.array.isRequired,
  institution: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(injectIntl(injectSheet(styles)(InstitutionActions)));