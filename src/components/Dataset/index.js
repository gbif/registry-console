import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Switch as UiSwitch } from 'antd';

// APIs
import {
  getDatasetOverview,
  updateContact,
  deleteContact,
  createContact,
  createComment,
  createEndpoint,
  createIdentifier,
  createTag,
  deleteComment,
  deleteEndpoint,
  deleteIdentifier,
  createMachineTag,
  deleteMachineTag,
  deleteTag,
} from '../../api/dataset';
import { canCreate, canUpdate, canDelete, } from '../../api/permissions';
import { addConstituentDataset, deleteConstituentDataset } from '../../api/network';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import PageWrapper from '../hoc/PageWrapper';
import withContext from '../hoc/withContext';
import { AuthRoute, HasAccess } from '../auth';
import { roles } from '../auth/enums';
// Components
import { ItemMenu, ItemHeader, CreationFeedback, ConfirmButton } from '../common';
import Exception404 from '../exception/404';
import DatasetDetails from './Details';
import {
  ContactList,
  DefaultValueList,
  EndpointList,
  IdentifierList,
  TagList,
  MachineTagList,
  CommentList
} from '../common/subtypes';
import { ConstituentDatasets } from './subtypes/ConstituentDatasets';
import Networks from './subtypes/Networks';
import { ProcessHistory } from './subtypes/ProcessHistory';
import PipelineHistory from './subtypes/PipelineHistory';
import Actions from './dataset.actions';
// Helpers
import { getSubMenu, defaultNameSpace } from '../util/helpers';

//load dataset and provide via props to children. load based on route key.
//provide children with way to update root.

class Dataset extends React.Component {
  state = {
    loading: true,
    dataset: null,
    machineTags: [],
    defaultValues: [],
    uuids: [],
    counts: {},
    status: 200,
    isNew: false,
    networkKey: Date.now()
  };

  componentDidMount() {
    this.checkRouterState();
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    if (this.props.match.params.key) {
      this.getData();
    } else {
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getUUIDS = dataset => {
    const uuids = [];

    uuids.push(dataset.publishingOrganizationKey);
    // Getting the node of publishing organization
    uuids.push(dataset.publishingOrganization.endorsingNodeKey);

    // Dataset can have one publishing but another hosting organization
    // In that case both of them should have permissions
    if (dataset.installation) {
      uuids.push(dataset.installation.organizationKey);
    }

    return uuids;
  };

  getData() {
    this.setState({ loading: true });

    getDatasetOverview(this.props.match.params.key).then(data => {
      // If user lives the page, request will return result anyway and tries to set in to a state
      // which will cause an error
      if (this._isMount) {
        // Taken an array of UUIDS to check user permissions
        const uuids = this.getUUIDS(data.dataset);
        const machineTags = data.dataset.machineTags.filter(item => item.namespace !== defaultNameSpace);
        const defaultValues = data.dataset.machineTags.filter(item => item.namespace === defaultNameSpace);

        // get stats related to ID checks in pipelines namepsace of machine tags
        const idThresholdPercent = data.dataset.machineTags.filter(item => item.namespace === 'pipelines.gbif.org' && item.name === 'id_threshold_percent')[0];
        const idThresholdSkip = data.dataset.machineTags.filter(item => item.namespace === 'pipelines.gbif.org' && item.name === 'id_threshold_skip')[0];

        this.setState({
          dataset: data.dataset,
          uuids,
          loading: false,
          counts: {
            contacts: data.dataset.contacts.length,
            endpoints: data.dataset.endpoints.length,
            identifiers: data.dataset.identifiers.length,
            tags: data.dataset.tags.length,
            machineTags: machineTags.length,
            defaultValues: defaultValues.length,
            comments: data.dataset.comments.length,
            constituents: data.constituents.count,
            networks: data.networks.count,
            process: data.process.count,
            history: data.pipelineHistory.count,
          },
          idThresholdPercent,
          idThresholdMachineTag: idThresholdPercent?.value || 50,
          idThresholdSkip,
          machineTags,
          defaultValues
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
    const { dataset, loading } = this.state;

    if (dataset) {
      return dataset.title;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newDataset', defaultMessage: 'New dataset' });
    }

    return '';
  }

  update(error, actionType) {
    // If component was unmounted interrupting changes
    if (!this._isMount) {
      return;
    }

    if (error) {
      if (error.response) {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      } else {
        this.props.addError({ status: 500, statusText: error.message });
      }
      return;
    }

    if (actionType === 'crawl') {
      this.props.addInfo({
        status: 200,
        statusText: this.props.intl.formatMessage({ id: 'info.crawling', defaultMessage: 'Crawling in progress' })
      });
      return;
    }

    this.getData();
  }

  addToNetwork(networkKey, dataset) {
    addConstituentDataset(networkKey, dataset).then(() => {
      this.updateNetworks(1);
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenAdded.datasetToNetwork',
          defaultMessage: 'Dataset has been added to the network'
        })
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  }

  deleteFromNetwork(networkKey, datasetKey) {
    deleteConstituentDataset(networkKey, datasetKey).then(() => {
      this.updateNetworks(-1);
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenDeleted.datasetFromNetwork',
          defaultMessage: 'Dataset has been deleted from network'
        })
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    })
  }

  updateNetworks = direction => {
    this.setState(state => {
      return {
        networkKey: Date.now(), // If we generate a new key for the child component, React will rerender it
        counts: {
          ...state.counts,
          networks: state.counts.networks + direction
        }
      };
    });
  };

  render() {
    const { match, intl, addError, addInfo } = this.props;
    const key = match.params.key;
    const { dataset, machineTags, defaultValues, uuids, loading, counts, status, isNew, networkKey, idThresholdSkip, idThresholdPercent } = this.state;

    const parsedThreshold = Number.parseFloat(this.state.idThresholdMachineTag);
    const invalidThreshold = !parsedThreshold || parsedThreshold < 1 || parsedThreshold > 99;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'datasets', defaultMessage: 'Datasets' });
    const submenu = getSubMenu(this.props);
    const pageTitle = dataset || loading ?
      intl.formatMessage({ id: 'title.dataset', defaultMessage: 'Dataset | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newDataset', defaultMessage: 'New dataset | GBIF Registry' });
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
          {dataset && (
            <Actions uuids={uuids} addInfo={addInfo} addError={addError} dataset={dataset} onChange={(error, actionType) => this.update(error, actionType)} />
          )}
        </ItemHeader>

        {isNew && !loading && (
          <CreationFeedback
            title={<FormattedMessage
              id="beenCreated.dataset.title"
              defaultMessage="Dataset has been created successfully!"
            />}
            message={<FormattedMessage
              id="beenCreated.dataset.message"
              defaultMessage="It can take 10 minutes for the dataset to show on the website. Please take into account that dataset needs to be crawled and updated what can take hours."
            />}
          />
        )}

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} uuids={uuids} isNew={dataset === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <DatasetDetails
                    dataset={dataset}
                    uuids={uuids}
                    refresh={key => this.refresh(key)}
                  />
                } />

                <Route path={`${match.path}/contact`} render={() =>
                  <ContactList
                    contacts={dataset.contacts}
                    permissions={{ uuids: uuids }}
                    createContact={itemKey => createContact(key, itemKey)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={data => deleteContact(key, data)}
                    canCreate={() => canCreate('dataset', key, 'contact')}
                    canUpdate={data => canUpdate('dataset', key, 'contact', data.key)}
                    canDelete={itemKey => canDelete('dataset', key, 'contact', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                } />

                <Route path={`${match.path}/defaultValue`} render={() =>
                  <DefaultValueList
                    defaultValues={defaultValues}
                    permissions={{ uuids: uuids }}
                    createValue={data => createMachineTag(key, data)}
                    deleteValue={itemKey => deleteMachineTag(key, itemKey)}
                    canCreate={() => canCreate('dataset', key, 'machineTag')}
                    canDelete={itemKey => canDelete('dataset', key, 'machineTag', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                } />

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    endpoints={dataset.endpoints}
                    permissions={{ uuids: uuids }}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    canCreate={() => canCreate('dataset', key, 'endpoint')}
                    canDelete={itemKey => canDelete('dataset', key, 'endpoint', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                } />

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    identifiers={dataset.identifiers}
                    permissions={{ uuids: uuids }}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    canCreate={() => canCreate('dataset', key, 'identifier')}
                    canDelete={itemKey => canDelete('dataset', key, 'identifier', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                } />

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    tags={dataset.tags}
                    permissions={{ uuids: uuids }}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    canCreate={() => canCreate('dataset', key, 'tag')}
                    canDelete={itemKey => canDelete('dataset', key, 'tag', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                } />

                <Route path={`${match.path}/machineTag`} render={() =>
                  <>
                    <MachineTagList
                      machineTags={machineTags}
                      permissions={{ roles: [roles.REGISTRY_ADMIN] }}
                      createMachineTag={data => createMachineTag(key, data)}
                      deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                      canCreate={() => canCreate('dataset', key, 'machineTag')}
                      canDelete={itemKey => canDelete('dataset', key, 'machineTag', itemKey)}
                      updateCounts={() => {
                        this.getData();
                      }}
                    />
                    <HasAccess fn={() =>canCreate('dataset', key, 'machineTag')}>
                      <div style={{ marginTop: 48 }}>
                        <h3>Shortcuts for frequently used machine tags</h3>
                        <div style={{ padding: 12, border: '1px solid #eee', marginBottom: 12 }}>
                          <h4>ID checks</h4>
                          <UiSwitch
                            checkedChildren={<FormattedMessage id="sdfsdf" defaultMessage="Is disabled" />}
                            unCheckedChildren={<FormattedMessage id="sdfsdf" defaultMessage="Is enabled" />}
                            onChange={() => {
                              const skipTests = idThresholdSkip?.value === 'true';
                              if (skipTests) {
                                deleteMachineTag(key, idThresholdSkip.key)
                              } else {
                                createMachineTag(key, {
                                  namespace: "pipelines.gbif.org",
                                  name: "id_threshold_skip",
                                  value: "true"
                                })
                              }
                              this.getData();
                            }}
                            checked={idThresholdSkip?.value === 'true'}
                          />
                          {idThresholdSkip?.value !== 'true' && <div>
                            <div>
                              Threshold <input placeholder="1-99" value={this.state.idThresholdMachineTag} onChange={(e) => this.setState({ idThresholdMachineTag: e.currentTarget.value })} />
                              <Button type="primary" style={{marginLeft: 8}} onClick={() => {
                                if (idThresholdPercent) {
                                  // delete existing before adding a new one
                                  deleteMachineTag(key, idThresholdPercent.key);
                                }
                                createMachineTag(key, {
                                  namespace: "pipelines.gbif.org",
                                  name: "id_threshold_percent",
                                  value: parsedThreshold
                                })
                                this.getData();
                              }}>Update threshold</Button>
                            </div>
                            {!invalidThreshold && <div style={{ color: '#aaa' }}>Fail the dataset interpretation if amount of new IDs is more than {parsedThreshold || 50}%</div>}
                            {invalidThreshold && <div style={{ color: 'tomato' }}>Should be a number between 1-99</div>}
                          </div>}
                        </div>
                      </div>
                    </HasAccess>
                  </>
                } />

                <AuthRoute
                  path={`${match.path}/comment`}
                  component={() =>
                    <CommentList
                      comments={dataset.comments}
                      permissions={{ uuids: uuids }}
                      createComment={data => createComment(key, data)}
                      deleteComment={itemKey => deleteComment(key, itemKey)}
                      canCreate={() => canCreate('dataset', key, 'comment')}
                      canDelete={itemKey => canDelete('dataset', key, 'comment', itemKey)}
                      updateCounts={this.updateCounts}
                    />
                  }
                  uuids={uuids}
                />

                <Route path={`${match.path}/constituents`} render={() =>
                  <ConstituentDatasets datasetKey={key} />
                } />

                <Route path={`${match.path}/networks`} render={() =>
                  <Networks
                    key={networkKey}
                    dataset={dataset}
                    addToNetwork={(networkKey, dataset) => this.addToNetwork(networkKey, dataset)}
                    deleteFromNetwork={(networkKey, datasetKey) => this.deleteFromNetwork(networkKey, datasetKey)}
                  />
                } />

                <Route path={`${match.path}/crawling-history`} render={() =>
                  <ProcessHistory datasetKey={key} />
                } />

                <Route path={`${match.path}/ingestion-history`} render={() =>
                  <PipelineHistory datasetKey={key} />
                } />

                <Route component={Exception404} />
              </Switch>
            </ItemMenu>
          )}
          />
        </PageWrapper>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError, addInfo, addSuccess }) => ({ addError, addInfo, addSuccess });

export default withContext(mapContextToProps)(withRouter(injectIntl(Dataset)));