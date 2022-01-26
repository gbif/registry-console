import React from 'react';
import PropTypes from 'prop-types';
import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Modal, Menu, Button } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// API
import { deleteInstallation, syncInstallation, updateInstallation } from '../../api/installation';
import { canDelete, canUpdate, canCreate } from '../../api/permissions';
// Wrappers
import withContext from '../hoc/withContext';

/**
 * Installation Actions component
 * Displays buttons depends on user's roles and scope, and item's state
 * @param uuids - active user UUID scope
 * @param installation - active item object
 * @param canBeSynchronized
 * @param onChange - callback to invoke any parent process
 * @param intl - react-intl injected object responsible for localization
 * @param user - active user object from context
 * @returns {*}
 * @constructor
 */
class InstallationActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    const hasDelete = await canDelete('installation', this.props.installation.key);
    const hasUpdate = await canUpdate('installation', this.props.installation.key);
    const hasSynchronize = await canCreate('installation', this.props.installation.key, 'synchronize');
    if (this._isMount) {
      // update state
      this.setState({ hasDelete, hasUpdate, hasSynchronize });
    };
    //else the component is unmounted and no updates should be made
  }

  callConfirmWindow = actionType => {
    const { intl } = this.props;
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
      this.showConfirm(title, actionType);
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

  callAction = actionType => {
    switch (actionType) {
      case 'sync':
        this.synchronize();
        break;
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

  synchronize = () => {
    const { installation, onChange } = this.props;
    syncInstallation(installation.key).then(() => onChange(null, 'sync')).catch(onChange);
  };

  restoreItem = () => {
    const { installation, onChange } = this.props;
    delete installation.deleted;

    updateInstallation(installation).then(() => onChange()).catch(onChange);
  };

  deleteItem = () => {
    const { installation, onChange } = this.props;
    deleteInstallation(installation.key).then(() => onChange()).catch(onChange);
  };

  renderActionMenu = () => {
    const { installation, canBeSynchronized } = this.props;
    return <Menu onClick={event => this.callConfirmWindow(event.key)}>
      {installation.deleted && (
        <Menu.Item key="restore" disabled={!this.state.hasUpdate}>
          <FormattedMessage id="restore.installation" defaultMessage="Restore this installation" />
        </Menu.Item>
      )}
      {!installation.deleted && (
        <Menu.Item key="delete" disabled={!this.state.hasDelete}>
          <FormattedMessage id="delete.installation" defaultMessage="Delete this installation" />
        </Menu.Item>
      )}
      {canBeSynchronized && (
        <Menu.Item key="sync" disabled={!this.state.hasSynchronize}>
          <FormattedMessage id="synchronizeNow" defaultMessage="Synchronize now" />
        </Menu.Item>
      )}
    </Menu>
  };

  render = () => {
    return (
      <React.Fragment>
        <Dropdown overlay={this.renderActionMenu()} arrow>
          <Button><MoreOutlined /></Button>
        </Dropdown>
      </React.Fragment>
    );
  }
}

InstallationActions.propTypes = {
  uuids: PropTypes.array.isRequired,
  installation: PropTypes.object.isRequired,
  canBeSynchronized: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  user: PropTypes.object
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(injectIntl(InstallationActions));