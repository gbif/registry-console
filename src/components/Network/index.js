import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Route, Switch, withRouter } from 'react-router-dom';

// APIs
import {
  getNetwork,
  createComment,
  createContact,
  createEndpoint,
  createIdentifier,
  createMachineTag,
  createTag,
  deleteComment,
  deleteContact,
  deleteEndpoint,
  deleteIdentifier,
  deleteMachineTag,
  deleteTag,
  updateContact,
  addConstituentDataset,
  deleteConstituentDataset
} from '../../api/network';
// Wrappers
import { AuthRoute } from '../auth';
import Exception404 from '../exception/404';
import PageWrapper from '../hoc/PageWrapper';
import withContext from '../hoc/withContext';
// Configuration
import MenuConfig from './menu.config';
// Components
import NetworkDetails from './Details';
import { CreationFeedback, ItemHeader, ItemMenu } from '../common';
import { CommentList, ContactList, EndpointList, IdentifierList, MachineTagList, TagList } from '../common/subtypes';
import ConstituentDatasets from './subtypes/ConstituentDatasets';
import Actions from './network.actions';
// Helpers
import { getSubMenu, generateKey } from '../util/helpers';

class Network extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      network: null,
      counts: {},
      status: 200,
      isNew: false,
      constituentKey: generateKey()
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

  getData() {
    this.setState({ loading: true });

    getNetwork(this.props.match.params.key).then(({ data }) => {
      // If user lives the page, request will return result anyway and tries to set in to a state
      // which will cause an error
      if (this._isMount) {
        this.setState({
          network: data,
          loading: false,
          counts: {
            contacts: data.contacts.length,
            endpoints: data.endpoints.length,
            identifiers: data.identifiers.length,
            tags: data.tags.length,
            machineTags: data.machineTags.length,
            comments: data.comments.length,
            constituents: data.numConstituents
          }
        });
      }
    }).catch(err => {
      // Important for us due to the case of requests cancellation on unmount
      // Because in that case the request will be marked as cancelled=failed
      // and catch statement will try to update a state of unmounted component
      // which will throw an exception
      if (this._isMount) {
        this.setState({ status: err.response.status, loading: false });
        if (![404, 500, 523].includes(err.response.status)) {
          this.props.addError({ status: err.response.status, statusText: err.response.data });
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

  update(error) {
    // If component was unmounted interrupting changes
    if (!this._isMount) {
      return;
    }

    if (error) {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
      return;
    }

    this.getData();
  }

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

  getTitle = () => {
    const { intl } = this.props;
    const { network, loading } = this.state;

    if (network) {
      return network.title;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newNetwork', defaultMessage: 'New network' });
    }

    return '';
  };

  addDataset(networkKey, dataset) {
    addConstituentDataset(networkKey, dataset).then(() => {
      // If we generate a new key for the child component, React will rerender it
      this.setState({ constituentKey: generateKey() });
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenAdded.constituentDataset',
          defaultMessage: 'Constituent dataset has been added'
        })
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  }

  deleteDataset(networkKey, datasetKey) {
    deleteConstituentDataset(networkKey, datasetKey).then(() => {
      // If we generate a new key for the child component, React will rerender it
      this.setState({ constituentKey: generateKey() });
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenDeleted.constituentDataset',
          defaultMessage: 'Constituent dataset has been deleted'
        })
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    })
  }

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { network, loading, counts, status, isNew, constituentKey } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'networks', defaultMessage: 'Networks' });
    const submenu = getSubMenu(this.props);
    const pageTitle = network || loading ?
      intl.formatMessage({ id: 'title.network', defaultMessage: 'Network | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newNetwork', defaultMessage: 'New network | GBIF Registry' });
    const title = this.getTitle();

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
          {network && (
            <Actions network={network} onChange={error => this.update(error)}/>
          )}
        </ItemHeader>

        {isNew && !loading && (
          <CreationFeedback
            title={<FormattedMessage
              id="beenCreated.network.title"
              defaultMessage="Network has been created successfully!"
            />}
          />
        )}

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={network === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <NetworkDetails
                    network={network}
                    refresh={key => this.refresh(key)}
                  />
                }/>

                <Route path={`${match.path}/contact`} render={() =>
                  <ContactList
                    contacts={network.contacts}
                    uuids={[]}
                    createContact={data => createContact(key, data)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={itemKey => deleteContact(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    endpoints={network.endpoints}
                    uuids={[]}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    identifiers={network.identifiers}
                    uuids={[]}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    tags={network.tags}
                    uuids={[]}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    machineTags={network.machineTags}
                    uuids={[]}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <AuthRoute
                  path={`${match.path}/comment`}
                  component={() =>
                    <CommentList
                      comments={network.comments}
                      uuids={[]}
                      createComment={data => createComment(key, data)}
                      deleteComment={itemKey => deleteComment(key, itemKey)}
                      updateCounts={this.updateCounts}
                    />
                  }
                  roles={'REGISTRY_ADMIN'}
                />

                <Route path={`${match.path}/constituents`} render={() =>
                  <ConstituentDatasets
                    key={constituentKey}
                    network={network}
                    addDataset={(networkKey, dataset) => this.addDataset(networkKey, dataset)}
                    deleteDataset={(networkKey, datasetKey) => this.deleteDataset(networkKey, datasetKey)}
                  />
                }/>

                <Route component={Exception404}/>
              </Switch>
            </ItemMenu>
          )}/>
        </PageWrapper>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError, addSuccess }) => ({ addError, addSuccess });

export default withContext(mapContextToProps)(withRouter(injectIntl(Network)));