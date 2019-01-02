import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Button, Popconfirm } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

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
  deleteComment, syncInstallation
} from '../../api/installation';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import AuthRoute from '../AuthRoute';
import PermissionWrapper from '../hoc/PermissionWrapper';
import PageWrapper from '../hoc/PageWrapper';
import withContext from '../hoc/withContext';
// Components
import { ItemHeader, ItemMenu } from '../widgets';
import InstallationDetails from './Details';
import { ContactList, EndpointList, MachineTagList, CommentList } from '../common';
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
      uid: [],
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

  getUIDs = data => {
    const uid = [];

    if (data) {
      uid.push(data.installation.organizationKey);
    }
    // Dataset can have one publishing but another hosting organization
    // In that case both of them should have permissions
    if (data.organization) {
      uid.push(data.organization.endorsingNodeKey);
    }

    return uid;
  };

  getData() {
    this.setState({ loading: true });

    getInstallationOverview(this.props.match.params.key).then(data => {
      // If user lives the page, request will return result anyway and tries to set in to a state
      // which will cause an error
      if (this._isMount) {
        // Taken an array of UIDs to check user permissions
        const uid = this.getUIDs(data);

        this.setState({
          data,
          uid,
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
        if (![404, 500].includes(error.response.status)) {
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

  synchronize = key => {
    syncInstallation(key)
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

  getTitle = () => {
    const { intl } = this.props;
    const { data, loading } = this.state;

    if (data) {
      return data.installation.title;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newInstallation', defaultMessage: 'New installation' });
    }

    return '';
  };

  render() {
    const { match, intl, syncInstallationTypes } = this.props;
    const key = match.params.key;
    const { data, uid, loading, counts, status } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'installations', defaultMessage: 'Installations' });
    const submenu = getSubMenu(this.props);
    const pageTitle = data || loading ?
      intl.formatMessage({ id: 'title.installation', defaultMessage: 'Installation | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newInstallation', defaultMessage: 'New installation | GBIF Registry' });
    const title = this.getTitle();

    // Message to show to the user if he wants to sync installation
    const canBeSynchronized = data && syncInstallationTypes && syncInstallationTypes.includes(data.installation.type);
    const message = intl.formatMessage({
      id: 'installation.sync.message',
      defaultMessage: 'This will trigger a synchronization of the installation.'
    });

    return (
      <React.Fragment>
        <ItemHeader listType={[listName]} title={title} submenu={submenu} pageTitle={pageTitle} loading={loading}>
          {data && !submenu && canBeSynchronized && (
            <PermissionWrapper uid={[]} roles={['REGISTRY_ADMIN']}>
              <Popconfirm
                placement="topRight"
                title={message}
                onConfirm={() => this.synchronize(data.installation.key)}
                okText={<FormattedMessage id="synchronize" defaultMessage="Synchronize"/>}
                cancelText={<FormattedMessage id="no" defaultMessage="No"/>}
              >
                <Button type="primary" htmlType="button">
                  <FormattedMessage id="synchronizeNow" defaultMessage="Synchronize now"/>
                </Button>
              </Popconfirm>
            </PermissionWrapper>
          )}
        </ItemHeader>

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={data === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <InstallationDetails
                    uid={uid}
                    installation={data ? data.installation : null}
                    refresh={key => this.refresh(key)}
                  />
                }/>

                <Route path={`${match.path}/contact`} render={() =>
                  <ContactList
                    data={data.installation.contacts}
                    uid={uid}
                    createContact={data => createContact(key, data)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={itemKey => deleteContact(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    data={data.installation.endpoints}
                    uid={uid}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    data={data.installation.machineTags}
                    uid={uid}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <AuthRoute
                  path={`${match.path}/comment`}
                  component={() =>
                    <CommentList
                      data={data.installation.comments}
                      uid={uid}
                      createComment={data => createComment(key, data)}
                      deleteComment={itemKey => deleteComment(key, itemKey)}
                      update={this.updateCounts}
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