import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Dropdown, Menu, Modal } from 'antd';

// APIs
import {
  getDatasetOverview,
  updateContact,
  deleteContact,
  createContact,
  createComment,
  createEndpoint,
  createIdentifier,
  createMachineTag,
  createTag,
  deleteComment,
  deleteEndpoint,
  deleteIdentifier,
  deleteMachineTag,
  deleteTag,
  crawlDataset,
  updateDataset,
  deleteDataset
} from '../../api/dataset';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import PermissionWrapper from '../hoc/PermissionWrapper';
import PageWrapper from '../hoc/PageWrapper';
import withContext from '../hoc/withContext';
import AuthRoute from '../AuthRoute';
// Components
import { ItemMenu, ItemHeader } from '../widgets';
import Exception404 from '../exception/404';
import DatasetDetails from './Details';
import { ContactList, EndpointList, IdentifierList, TagList, MachineTagList, CommentList } from '../common';
import { ConstituentDatasets } from './subtypes/ConstituentDatasets';
import { ProcessHistory } from './subtypes/ProcessHistory';
// Helpers
import { getSubMenu } from '../helpers';

//load dataset and provide via props to children. load based on route key.
//provide children with way to update root.

class Dataset extends React.Component {
  state = {
    loading: true,
    data: null,
    uuids: [],
    counts: {},
    status: 200
  };

  componentDidMount() {
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

    if (dataset) {
      uuids.push(dataset.publishingOrganizationKey);
    }
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

        this.setState({
          dataset: data.dataset,
          uuids,
          loading: false,
          counts: {
            contacts: data.dataset.contacts.length,
            endpoints: data.dataset.endpoints.length,
            identifiers: data.dataset.identifiers.length,
            tags: data.dataset.tags.length,
            machineTags: data.dataset.machineTags.length,
            comments: data.dataset.comments.length,
            constituents: data.constituents.count,
            process: data.process.count,
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
    const { dataset, loading } = this.state;

    if (dataset) {
      return dataset.title;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newDataset', defaultMessage: 'New dataset' });
    }

    return '';
  }

  callConfirmWindow(actionType) {
    const { dataset } = this.state;
    const { intl } = this.props;
    let title;

    switch (actionType) {
      case 'crawl': {
        title = dataset.publishingOrganization.endorsementApproved ?
          intl.formatMessage({
            id: 'endorsed.crawl.message',
            defaultMessage: 'This will trigger a crawl of the dataset.'
          }) :
          intl.formatMessage({
            id: 'notEndorsed.crawl.message',
            defaultMessage: 'This dataset\'s publishing organization is not endorsed yet! This will trigger a crawl of the dataset, and should only be done in a 1_2_27 environment'
          });
        break;
      }
      case 'delete': {
        title = intl.formatMessage({
          id: 'delete.confirmation.dataset',
          defaultMessage: 'Are you sure to delete this dataset?'
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
    const { dataset } = this.state;

    switch (actionType) {
      case 'crawl':
        this.crawl(dataset.key);
        break;
      case 'delete':
        this.deleteDataset(dataset.key);
        break;
      case 'restore':
        this.restoreDataset(dataset);
        break;
      default:
        break;
    }
  }

  crawl = key => {
    crawlDataset(key)
      .then(() => {
        this.props.addInfo({
          status: 200,
          statusText: this.props.intl.formatMessage({ id: 'info.crawling', defaultMessage: 'Crawling in progress' })
        });
      })
      .catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
  };

  restoreDataset(dataset) {
    delete dataset.deleted;

    updateDataset(dataset).then(() => {
      if (this._isMount) {
        this.getData();
      }
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  }

  deleteDataset(key) {
    deleteDataset(key).then(() => {
      if (this._isMount) {
        this.getData();
      }
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  }

  renderActionMenu() {
    const { dataset } = this.state;

    return <Menu onClick={event => this.callConfirmWindow(event.key)}>
      {dataset.deleted && (
        <Menu.Item key="restore">
          <FormattedMessage id="restore.dataset" defaultMessage="Restore this dataset"/>
        </Menu.Item>
      )}
      {!dataset.deleted && (
        <Menu.Item key="delete">
          <FormattedMessage id="delete.dataset" defaultMessage="Delete this dataset"/>
        </Menu.Item>
      )}
    </Menu>;
  };

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { dataset, uuids, loading, counts, status } = this.state;

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
        >
          {dataset && (
            <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
              <React.Fragment>
                <Dropdown.Button onClick={() => this.callConfirmWindow('crawl')} overlay={this.renderActionMenu()}>
                  <FormattedMessage id="crawl" defaultMessage="Crawl"/>
                </Dropdown.Button>
              </React.Fragment>
            </PermissionWrapper>
          )}
        </ItemHeader>

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={dataset === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <DatasetDetails
                    dataset={dataset}
                    uuids={uuids}
                    refresh={key => this.refresh(key)}
                  />
                }/>

                <Route path={`${match.path}/contact`} render={() =>
                  <ContactList
                    contacts={dataset.contacts}
                    uuids={uuids}
                    createContact={itemKey => createContact(key, itemKey)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={data => deleteContact(key, data)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    endpoints={dataset.endpoints}
                    uuids={uuids}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    identifiers={dataset.identifiers}
                    uuids={uuids}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    tags={dataset.tags}
                    uuids={uuids}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    machineTags={dataset.machineTags}
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
                      comments={dataset.comments}
                      uuids={uuids}
                      createComment={data => createComment(key, data)}
                      deleteComment={itemKey => deleteComment(key, itemKey)}
                      updateCounts={this.updateCounts}
                    />
                  }
                  roles={['REGISTRY_ADMIN']}
                />

                <Route path={`${match.path}/constituents`} render={() =>
                  <ConstituentDatasets datasetKey={key}/>
                }/>

                <Route path={`${match.path}/process`} render={() =>
                  <ProcessHistory datasetKey={key}/>
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

const mapContextToProps = ({ addError, addInfo }) => ({ addError, addInfo });

export default withContext(mapContextToProps)(withRouter(injectIntl(Dataset)));