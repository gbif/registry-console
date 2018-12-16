import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';

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
import { ItemMenu } from '../widgets';
import NodeDetails from './Details';
import { CommentList, ContactList, EndpointList, IdentifierList, MachineTagList, TagList } from '../common';
import PendingEndorsement from './PendingEndorsement';
import EndorsedOrganizations from './EndorsedOrganizations';
import EndorsedDatasets from './EndorsedDatasets';
import Installations from './Installations';
import Exception404 from '../Exception/404';
import MenuConfig from './MenuConfig';
import { addError } from '../../actions/errors';
import withContext from '../hoc/withContext';

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
    if (this.props.match.params.key) {
      this.getData();
    } else {
      this.setState({
        data: null,
        loading: false
      });
    }
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
      this.props.setItem(data.node);
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  }

  refresh = key => {
    this.props.history.push(key);
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

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { data, loading, counts } = this.state;

    return (
      <DocumentTitle
        title={
          data || loading ?
            intl.formatMessage({ id: 'title.node', defaultMessage: 'Node | GBIF Registry' }) :
            intl.formatMessage({ id: 'title.newNode', defaultMessage: 'New node | GBIF Registry' })
        }
      >
        <React.Fragment>
          {!loading && <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={data === null}>
              <Switch>
                <Route exact path={match.path} render={() =>
                  <NodeDetails node={data ? data.node : null} refresh={key => this.refresh(key)}/>
                }/>

                <Route path={`${match.path}/contact`} render={() => <ContactList data={data.node.contacts}/>}/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    data={data.node.endpoints}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    data={data.node.identifiers}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    data={data.node.tags}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    data={data.node.machineTags}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/comment`} render={() =>
                  <CommentList
                    data={data.node.comments}
                    createComment={data => createComment(key, data)}
                    deleteComment={itemKey => deleteComment(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/pending`} render={() =>
                  <PendingEndorsement orgKey={match.params.key}/>
                }/>

                <Route path={`${match.path}/organization`} render={() =>
                  <EndorsedOrganizations orgKey={match.params.key}/>
                }/>

                <Route path={`${match.path}/dataset`} render={() =>
                  <EndorsedDatasets orgKey={match.params.key}/>
                }/>

                <Route path={`${match.path}/installation`} render={() =>
                  <Installations orgKey={match.params.key}/>
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

const mapDispatchToProps = { addError: addError };
const mapContextToProps = ({ setItem }) => ({ setItem });

export default withContext(mapContextToProps)(connect(null, mapDispatchToProps)(injectIntl(NodeItem)));