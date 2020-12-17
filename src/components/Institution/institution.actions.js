import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Dropdown, Menu, Modal, Icon, Button } from 'antd';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

// API
import { deleteInstitution, updateInstitution, mergeInstitutions } from '../../api/institution';
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
    const { institution, user } = this.props;
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
    </Menu>;
  };

  callConfirmWindow = actionType => {
    const { institution, intl } = this.props;
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

    const description = intl.formatMessage({id: 'institition.merge.comment', defaultMessage: 'This institution will be deleted after merging.'});
    const mergeLabel = intl.formatMessage({id: 'merge', defaultMessage: 'Merge'});
    const cancelLabel = intl.formatMessage({id: 'cancel', defaultMessage: 'Cancel'});
    Modal.confirm({
      title,
      okText: mergeLabel,
      okType: 'primary',
      cancelText: cancelLabel,
      content: <div>
        <InstitutionSuggest user={user} intl={intl} value={this.state.mergeWithInstitution} onChange={institution => this.setState({mergeWithInstitution: institution})} style={{width: '100%'}}/>
        <div style={{marginTop: 10, color: '#888'}}>
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
    const { institution, onChange } = this.props;
    const { mergeWithInstitution } = this.state;
    mergeInstitutions({institutionKey: institution.key, mergeIntoInstitutionKey: mergeWithInstitution}).then(() => onChange(null, 'crawl')).catch(onChange);
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
    const { uuids } = this.props;
    return (
      // <HasScope uuids={uuids}>
        // <Dropdown.Button onClick={() => this.callConfirmWindow('delete')} overlay={this.renderActionMenu()}>
        //   <FormattedMessage id="delete" defaultMessage="delete" />
        // </Dropdown.Button>
        <HasRole roles={[roles.GRSCICOLL_ADMIN]}>
          <Dropdown overlay={this.renderActionMenu()} arrow>
            <Button><Icon type="more" /></Button>
          </Dropdown>
        </HasRole>
      // </HasScope>
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