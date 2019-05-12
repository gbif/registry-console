import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
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
  deleteComment
} from '../../api/installation';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import { AuthRoute } from '../auth';
import PageWrapper from '../hoc/PageWrapper';
import withContext from '../hoc/withContext';
// Components
import { CreationFeedback, ItemHeader, ItemMenu } from '../common';
import InstallationDetails from './Details';
import { ContactList, EndpointList, MachineTagList, CommentList } from '../common/subtypes';
import { ServedDataset, SyncHistory } from './installationSubtypes';
import Exception404 from '../exception/404';
import Actions from './installation.actions';
import SyncState from './syncState';
// Helpers
import { getSubMenu } from '../util/helpers';

class Installation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      installation: null,
      uuids: [],
      counts: {},
      status: 200,
      isNew: false
    };
  }

  componentDidMount() {
    this.checkRouterState();
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
    // User with a Node scope of endorsing node of publishing organization
    // should be able to edit installation
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
      this.props.history.push(key, { isNew: true });
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

  checkRouterState() {
    const { history } = this.props;
    // If we set router state previously, we'll update component's state and reset router's state
    if (history.location && history.location.state && history.location.state.isNew) {
      this.setState({ isNew: true });
      const state = { ...history.location.state };
      delete state.isNew;
      history.replace({ ...history.location, state });
    }
  }

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

  update(error, actionType) {
    // If component was unmounted interrupting changes
    if (!this._isMount) {
      return;
    }

    if (error) {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
      return;
    }

    if (actionType === 'sync') {
      this.props.addInfo({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'info.synchronizing',
          defaultMessage: 'Synchronization in progress'
        })
      });
      return;
    }

    this.getData();
  }

  /**
   * As we have only one such case I implemented rules for sync state right here instead of menu.config.js
   * If installation has type === 'IPT_INSTALLATION', we'll display last menu item
   * Other way we'll not
   * @returns {{settings, menu}|{menu: *}}
   */
  getMenuConfig = () => {
    const { installation } = this.state;

    if (!installation || installation.type === 'IPT_INSTALLATION') {
      return MenuConfig;
    }

    return {
      menu: MenuConfig.menu.slice(0, MenuConfig.menu.length - 1)
    }
  };

  render() {
    const { match, intl, syncInstallationTypes } = this.props;
    const key = match.params.key;
    const { installation, uuids, loading, counts, status, isNew } = this.state;

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
          usePaperWidth
        >
          {installation && (
            <Actions
              uuids={uuids}
              installation={installation}
              canBeSynchronized={canBeSynchronized}
              onChange={(error, actionType) => this.update(error, actionType)}
            />
          )}
        </ItemHeader>

        {isNew && !loading && (
          <CreationFeedback
            title={<FormattedMessage
              id="beenCreated.installation.title"
              defaultMessage="Installation has been created successfully!"
            />}
          />
        )}

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={this.getMenuConfig()} uuids={uuids} isNew={installation === null}>
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
                  uuids={uuids}
                />

                <Route path={`${match.path}/servedDatasets`} render={() =>
                  <ServedDataset instKey={match.params.key}/>
                }/>

                <Route path={`${match.path}/synchronizationHistory`} render={() =>
                  <SyncHistory instKey={match.params.key}/>
                }/>

                {installation && installation.type === 'IPT_INSTALLATION' && (
                  <Route path={`${match.path}/syncState`} render={() =>
                    <SyncState endpoints={installation.endpoints}/>
                  }/>
                )}

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