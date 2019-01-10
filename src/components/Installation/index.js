import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Dropdown, Modal, Menu } from 'antd';

// APIs
import {
  getInstallationOverview,
  updateContact,
  deleteContact,
  createContact,
  createEndpoint,
  deleteEndpoint,
  createMachineTag,
  deleteMachineTag,
  createComment,
  deleteComment,
  syncInstallation,
  updateInstallation,
  deleteInstallation
} from '../../api/installation';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import AuthRoute from '../AuthRoute';
import PermissionWrapper from '../hoc/PermissionWrapper';
import PageWrapper from '../hoc/PageWrapper';
import withContext from '../hoc/withContext';
// Components
import { ConfirmButton, ItemHeader, ItemMenu } from '../common';
import InstallationDetails from './Details';
import { ContactList, EndpointList, MachineTagList, CommentList } from '../common/subtypes';
import { ServedDataset, SyncHistory } from './installationSubtypes';
import Exception404 from '../exception/404';
// Helpers
import { getSubMenu } from '../helpers';

class Installation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: null,
      uuids: [],
      counts: {},
      status: 200
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    if (this.props.match.params.key) {
      this.getData();
    } else {
      this.setState({
        data: null,
        loading: false
      });
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getUUIDS = data => {
    const uuids = [];

    if (data) {
      uuids.push(data.installation.organizationKey);
    }
    // Dataset can have one publishing but another hosting organization
    // In that case both of them should have permissions
    if (data.organization) {
      uuids.push(data.organization.endorsingNodeKey);
    }

    return uuids;
  };

  getData() {
    this.setState({ loading: true });

    getInstallationOverview(this.props.match.params.key).then(data => {
      // If user lives the page, request will return result anyway and tries to set in to a state
      // which will cause an error
      if (this._isMount) {
        // Taken an array of UIDs to check user permissions
        const uuids = this.getUUIDS(data);

        this.setState({
          installation: data.installation,
          uuids,
          loading: false,
          error: false,
          counts: {
            contacts: data.installation.contacts.length,
            endpoints: data.installation.endpoints.length,
            machineTags: data.installation.machineTags.length,
            comments: data.installation.comments.length,
            servedDataset: data.servedDataset.count,
            syncHistory: data.syncHistory.count
          }
        });
      }
    }).catch(error => {
      // Important for us due to the case of requests cancellation on unmount
      // Because in that case the request will be marked as cancelled=failed
      // and catch statement will try to update a state of unmounted component
      // which will throw an exception
      if (this._isMount) {
        this.setState({ status: error.response.status, loading: false });
        if (![404, 500, 523].includes(error.response.status)) {
          this.props.addError({ status: error.response.status, statusText: error.response.data });
        }
      }
    });
  }

  refresh = key => {
    if (key) {
      this.props.history.push(key);
    } else {
      this.getData();
    }
  };

  updateCounts = (key, value) => {
    this.setState(state => {
      return {
        counts: {
          ...state.counts,
          [key]: value
        }
      };
    });
  };

  getTitle() {
    const { intl } = this.props;
    const { installation, loading } = this.state;

    if (installation) {
      return installation.title;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newInstallation', defaultMessage: 'New installation' });
    }

    return '';
  };

  callConfirmWindow(actionType) {
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
      onOk: () => {
        this.callAction(actionType);
      }
    });
  };

  callAction(actionType) {
    switch (actionType) {
      case 'crawl':
        this.synchronize();
        break;
      case 'delete':
        this.deleteInstallation();
        break;
      case 'restore':
        this.restoreInstallation();
        break;
      default:
        break;
    }
  }

  synchronize() {
    const { installation } = this.state;

    syncInstallation(installation.key)
      .then(() => {
        this.props.addInfo({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'info.synchronizing',
            defaultMessage: 'Synchronization in progress'
          })
        });
      })
      .catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
  };

  restoreInstallation() {
    const { installation } = this.state;
    delete installation.deleted;

    updateInstallation(installation).then(() => {
      if (this._isMount) {
        this.getData();
      }
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  }

  deleteInstallation() {
    const { installation } = this.state;

    deleteInstallation(installation.key).then(() => {
      if (this._isMount) {
        this.getData();
      }
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  }

  renderActionMenu() {
    const { installation } = this.state;

    return <Menu onClick={event => this.callConfirmWindow(event.key)}>
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

  render() {
    const { match, intl, syncInstallationTypes } = this.props;
    const key = match.params.key;
    const { installation, uuids, loading, counts, status } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'installations', defaultMessage: 'Installations' });
    const submenu = getSubMenu(this.props);
    const pageTitle = installation || loading ?
      intl.formatMessage({ id: 'title.installation', defaultMessage: 'Installation | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newInstallation', defaultMessage: 'New installation | GBIF Registry' });
    const title = this.getTitle();
    // Message to show to the user if he wants to sync installation
    const canBeSynchronized = installation && syncInstallationTypes && syncInstallationTypes.includes(installation.type);

    return (
      <React.Fragment>
        <ItemHeader
          listType={[listName]}
          title={title}
          submenu={submenu}
          pageTitle={pageTitle}
          status={status}
          loading={loading}
        >
          {installation && (
            <React.Fragment>
              {canBeSynchronized ? (
                <PermissionWrapper uuids={[]} roles={['REGISTRY_ADMIN']}>
                  <Dropdown.Button onClick={() => this.callConfirmWindow('sync')} overlay={this.renderActionMenu()}>
                    <FormattedMessage id="synchronizeNow" defaultMessage="Synchronize now"/>
                  </Dropdown.Button>
                </PermissionWrapper>
              ) : (
                <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  {installation.deleted ? (
                    <ConfirmButton
                      title={
                        <FormattedMessage
                          id="restore.confirmation"
                          defaultMessage="Restoring a previously deleted entity will likely trigger significant processing"
                        />
                      }
                      btnText={<FormattedMessage id="restore.installation" defaultMessage="Restore this installation"/>}
                      onConfirm={() => this.restoreInstallation()}
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
                      onConfirm={() => this.deleteInstallation()}
                    />
                  )}
                </PermissionWrapper>
              )}
            </React.Fragment>
          )}
        </ItemHeader>

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={installation === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <InstallationDetails
                    uuids={uuids}
                    installation={installation}
                    refresh={key => this.refresh(key)}
                  />
                }/>

                <Route path={`${match.path}/contact`} render={() =>
                  <ContactList
                    contacts={installation.contacts}
                    uuids={uuids}
                    createContact={data => createContact(key, data)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={itemKey => deleteContact(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    endpoints={installation.endpoints}
                    uuids={uuids}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    machineTags={installation.machineTags}
                    uuids={uuids}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <AuthRoute
                  path={`${match.path}/comment`}
                  component={() =>
                    <CommentList
                      comments={installation.comments}
                      uuids={uuids}
                      createComment={data => createComment(key, data)}
                      deleteComment={itemKey => deleteComment(key, itemKey)}
                      updateCounts={this.updateCounts}
                    />
                  }
                  roles={['REGISTRY_ADMIN']}
                />

                <Route path={`${match.path}/servedDatasets`} render={() =>
                  <ServedDataset instKey={match.params.key}/>
                }/>

                <Route path={`${match.path}/synchronizationHistory`} render={() =>
                  <SyncHistory instKey={match.params.key}/>
                }/>

                <Route component={Exception404}/>
              </Switch>
            </ItemMenu>
          )}
          />
        </PageWrapper>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError, addInfo, syncInstallationTypes }) => ({
  addError,
  addInfo,
  syncInstallationTypes
});

export default withContext(mapContextToProps)(withRouter(injectIntl(Installation)));