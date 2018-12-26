import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import { getNodeOverview } from '../../api/node';
import { ItemHeader, ItemMenu } from '../widgets';
import NodeDetails from './Details';
import { CommentList, ContactList, EndpointList, IdentifierList, MachineTagList, TagList } from '../common';
import PendingEndorsement from './PendingEndorsement';
import EndorsedOrganizations from './EndorsedOrganizations';
import EndorsedDatasets from './EndorsedDatasets';
import Installations from './Installations';
import Exception404 from '../exception/404';
import MenuConfig from './menu.config';
import { getSubMenu } from '../helpers';
import AuthRoute from '../AuthRoute';
import withContext from '../hoc/withContext';
import PageWrapper from '../hoc/PageWrapper';

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
    this.getData();
  }

  getData() {
    this.setState({ loading: true });

    getNodeOverview(this.props.match.params.key).then(data => {
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
    }).catch(error => {
      if (error.response.status === 404 || error.response.status === 500) {
        this.setState({ status: error.response.status });
      } else {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      }
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    const { match, intl } = this.props;
    const { data, loading, counts, status } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'nodes', defaultMessage: 'Nodes' });
    const submenu = getSubMenu(this.props);
    const pageTitle = intl.formatMessage({ id: 'title.node', defaultMessage: 'Node | GBIF Registry' });

    return (
      <PageWrapper status={status} loading={loading}>
        <ItemHeader listType={[listName]} title={data ? data.node.title : ''} submenu={submenu} pageTitle={pageTitle}/>

        <Route path="/:type?/:key?/:section?" render={() => (
          <ItemMenu counts={counts} config={MenuConfig} isNew={data === null}>
            <Switch>
              <Route exact path={match.path} render={() =>
                <NodeDetails node={data ? data.node : null}/>
              }/>

              <Route path={`${match.path}/contact`} render={() =>
                <ContactList data={data.node.endpoints} uid={[]}/>
              }/>

              <Route path={`${match.path}/endpoint`} render={() =>
                <EndpointList data={data.node.endpoints} uid={[]}/>
              }/>

              <Route path={`${match.path}/identifier`} render={() =>
                <IdentifierList data={data.node.identifiers} uid={[]}/>
              }/>

              <Route path={`${match.path}/tag`} render={() =>
                <TagList data={data.node.tags} uid={[]}/>
              }/>

              <Route path={`${match.path}/machineTag`} render={() =>
                <MachineTagList data={data.node.machineTags} uid={[]}/>
              }/>

              <AuthRoute
                path={`${match.path}/comment`}
                component={() =>
                  <CommentList data={data.node.comments} uid={[]}/>
                }
                roles={['REGISTRY_ADMIN']}
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
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(injectIntl(NodeItem));