import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';

import { getNodeOverview } from '../../api/node';
import { ItemMenu } from '../widgets';
import NodeDetails from './Details';
import { CommentList, ContactList, EndpointList, IdentifierList, MachineTagList, TagList } from '../common';
import PendingEndorsement from './PendingEndorsement';
import EndorsedOrganizations from './EndorsedOrganizations';
import EndorsedDatasets from './EndorsedDatasets';
import Installations from './Installations';
import Exception404 from '../exception/404';
import MenuConfig from './menu.config';
import withContext from '../hoc/withContext';
import { BreadCrumbs } from '../widgets';
import { getSubMenu } from '../../api/util/helpers';
import AuthRoute from '../AuthRoute';

class NodeItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: null,
      counts: {}
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
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  }

  render() {
    const { match, intl } = this.props;
    const { data, loading, counts } = this.state;
    const listName = intl.formatMessage({ id: 'nodes', defaultMessage: 'Nodes' });
    const submenu = getSubMenu(this.props);

    return (
      <DocumentTitle
        title={intl.formatMessage({ id: 'title.node', defaultMessage: 'Node | GBIF Registry' })}
      >
        <React.Fragment>
          {!loading && <BreadCrumbs listType={[listName]} title={data.node.title} submenu={submenu}/>}

          {!loading && <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={data === null}>
              <Switch>
                <Route exact path={match.path} render={() =>
                  <NodeDetails node={data ? data.node : null}/>
                }/>

                <Route path={`${match.path}/contact`} render={() =>
                  <ContactList data={data.node.contacts} title={data.node.title}/>
                }/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList data={{ title: data.node.title, endpoints: data.node.endpoints }}/>
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList data={{ title: data.node.title, identifiers: data.node.identifiers }}/>
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList data={{ title: data.node.title, tags: data.node.tags }}/>
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList data={{ title: data.node.title, machineTags: data.node.machineTags }}/>
                }/>

                <AuthRoute
                  path={`${match.path}/comment`}
                  component={() =>
                    <CommentList data={{ title: data.node.title, comments: data.node.comments }}/>
                  }
                  roles={['REGISTRY_ADMIN']}
                />

                <Route path={`${match.path}/pending`} render={() =>
                  <PendingEndorsement nodeKey={match.params.key} title={data.node.title}/>
                }/>

                <Route path={`${match.path}/organization`} render={() =>
                  <EndorsedOrganizations nodeKey={match.params.key} title={data.node.title}/>
                }/>

                <Route path={`${match.path}/dataset`} render={() =>
                  <EndorsedDatasets nodeKey={match.params.key} title={data.node.title}/>
                }/>

                <Route path={`${match.path}/installation`} render={() =>
                  <Installations nodeKey={match.params.key} title={data.node.title}/>
                }/>

                <Route component={Exception404}/>
              </Switch>
            </ItemMenu>
          )}
          />}

          {loading && <Spin size="large"/>}
        </React.Fragment>
      </DocumentTitle>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(injectIntl(NodeItem));