import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { injectIntl } from 'react-intl';

// APIs
import {
  getNodeOverview,
  createEndpoint,
  deleteEndpoint,
  createIdentifier,
  deleteIdentifier,
  createTag,
  deleteTag,
  createMachineTag,
  deleteMachineTag,
  createComment,
  deleteComment
} from '../../api/node';
import { canCreate, canDelete, } from '../../api/permissions';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import { AuthRoute } from '../auth';
import { roles } from '../auth/enums';
import withContext from '../hoc/withContext';
import PageWrapper from '../hoc/PageWrapper';
// Components
import { ItemHeader, ItemMenu } from '../common';
import NodeDetails from './Details';
import { CommentList, ContactList, EndpointList, IdentifierList, MachineTagList, TagList } from '../common/subtypes';
import { PendingEndorsement, EndorsedOrganizations, EndorsedDatasets, Installations } from './nodeSubtypes';
import Exception404 from '../exception/404';
//Helpers
import { getSubMenu } from '../util/helpers';

class NodeItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: null,
      counts: {},
      status: 200
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    this.getData();
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getData() {
    this.setState({ loading: true });

    getNodeOverview(this.props.match.params.key).then(data => {
      // If user lives the page, request will return result anyway and tries to set in to a state
      // which will cause an error
      if (this._isMount) {
        this.setState({
          data,
          loading: false,
          counts: {
            contacts: data.node.contacts.length,
            endpoints: data.node.endpoints.length,
            identifiers: data.node.identifiers.length,
            tags: data.node.tags.length,
            machineTags: data.node.machineTags.length,
            comments: data.node.comments.length,
            installations: data.installations.count,
            datasets: data.endorsedDatasets.count,
            pending: data.pendingEndorsement.count,
            organizations: data.endorsedOrganizations.count
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

  render() {
    const { match, intl } = this.props;
    const { data, loading, counts, status } = this.state;
    const key = match.params.key;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'nodes', defaultMessage: 'Nodes' });
    const submenu = getSubMenu(this.props);
    const pageTitle = intl.formatMessage({ id: 'title.node', defaultMessage: 'Node | GBIF Registry' });

    return (
      <React.Fragment>
        <ItemHeader
          listType={[listName]}
          title={data ? data.node.title : ''}
          submenu={submenu}
          pageTitle={pageTitle}
          status={status}
          loading={loading}
          usePaperWidth
        />

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={data === null}>
              <Switch>
                <Route exact path={match.path} render={() =>
                  <NodeDetails node={data ? data.node : null}/>
                }/>

                <Route path={`${match.path}/contact`} render={() =>
                  <ContactList contacts={data.node.contacts}
                  permissions={{roles: [roles.REGISTRY_ADMIN]}}
                  />
                }/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    endpoints={data.node.endpoints}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    canCreate={() =>      canCreate('node', key, 'endpoint')}
                    canDelete={itemKey => canDelete('node', key, 'endpoint', itemKey)}
                    updateCounts={this.updateCounts}
                    permissions={{roles: [roles.REGISTRY_ADMIN]}}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    identifiers={data.node.identifiers}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    canCreate={() =>      canCreate('node', key, 'identifier')}
                    canDelete={itemKey => canDelete('node', key, 'identifier', itemKey)}
                    updateCounts={this.updateCounts}
                    permissions={{roles: [roles.REGISTRY_ADMIN]}}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    tags={data.node.tags}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    canCreate={() =>      canCreate('node', key, 'tag')}
                    canDelete={itemKey => canDelete('node', key, 'tag', itemKey)}
                    updateCounts={this.updateCounts}
                    permissions={{roles: [roles.REGISTRY_ADMIN]}}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    machineTags={data.node.machineTags}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    canCreate={() =>      canCreate('node', key, 'machineTag')}
                    canDelete={itemKey => canDelete('node', key, 'machineTag', itemKey)}
                    updateCounts={this.updateCounts}
                    permissions={{roles: [roles.REGISTRY_ADMIN]}}
                  />
                }/>

                <AuthRoute
                  path={`${match.path}/comment`}
                  component={() =>
                    <CommentList
                      comments={data.node.comments}
                      createComment={data => createComment(key, data)}
                      deleteComment={itemKey => deleteComment(key, itemKey)}
                      canCreate={() =>      canCreate('node', key, 'comment')}
                      canDelete={itemKey => canDelete('node', key, 'comment', itemKey)}
                      updateCounts={this.updateCounts}
                    />
                  }
                  roles={'REGISTRY_ADMIN'}
                />

                <Route path={`${match.path}/pending`} render={() =>
                  <PendingEndorsement nodeKey={match.params.key}/>
                }/>

                <Route path={`${match.path}/organization`} render={() =>
                  <EndorsedOrganizations nodeKey={match.params.key}/>
                }/>

                <Route path={`${match.path}/dataset`} render={() =>
                  <EndorsedDatasets nodeKey={match.params.key}/>
                }/>

                <Route path={`${match.path}/installation`} render={() =>
                  <Installations nodeKey={match.params.key}/>
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

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(injectIntl(NodeItem));