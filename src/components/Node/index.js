import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';

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
import NodeMenu from './NodeMenu';
import NodeDetails from './Details';
import { CommentList, ContactList, EndpointList, IdentifierList, MachineTagList, TagList } from '../common';
import PendingEndorsement from './PendingEndorsement';
import EndorsedOrganizations from './EndorsedOrganizations';
import EndorsedDatasets from './EndorsedDatasets';
import Installations from './Installations';
import withCommonItemMethods from '../hoc/withCommonItemMethods';

class NodeItem extends Component {
  constructor(props) {
    super(props);

    this.getData = this.getData.bind(this);

    this.state = {
      loading: true,
      data: null,
      counts: {
        contacts: 0,
        endpoints: 0,
        identifiers: 0,
        tags: 0,
        machineTags: 0,
        comments: 0
      }
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
          comments: data.node.comments.length
        }
      });
    }).catch(() => {
      this.props.showNotification(
        'error',
        this.props.intl.formatMessage({ id: 'error.message', defaultMessage: 'Error' }),
        this.props.intl.formatMessage({
          id: 'error.description',
          defaultMessage: 'Something went wrong. Please, keep calm and repeat your action again.'
        })
      );
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
    const { match, user } = this.props;
    const key = match.params.key;
    const { data, loading, counts } = this.state;

    return (
      <React.Fragment>
        {!loading && <Route path="/:type?/:key?/:section?" render={() => (
          <NodeMenu
            counts={counts}
            installations={data ? data.installations.count : 0}
            datasets={data ? data.endorsedDatasets.count : 0}
            pending={data ? data.pendingEndorsement.count : 0}
            organizations={data ? data.endorsedOrganizations.count : 0}
          >
            <Switch>
              <Route
                exact
                path={match.path}
                render={() => <NodeDetails node={data ? data.node : null} refresh={key => this.refresh(key)}/>}
              />

              <Route path={`${match.path}/contact`} render={() => <ContactList data={data.node.contacts}/>}/>

              <Route path={`${match.path}/endpoint`} render={() =>
                <EndpointList
                  data={data.node.endpoints}
                  createEndpoint={data => createEndpoint(key, data)}
                  deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/identifier`} render={() =>
                <IdentifierList
                  data={data.node.identifiers}
                  createIdentifier={data => createIdentifier(key, data)}
                  deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/tag`} render={() =>
                <TagList
                  data={data.node.tags}
                  createTag={data => createTag(key, data)}
                  deleteTag={itemKey => deleteTag(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/machineTag`} render={() =>
                <MachineTagList
                  data={data.node.machineTags}
                  createMachineTag={data => createMachineTag(key, data)}
                  deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/comment`} render={() =>
                <CommentList
                  data={data.node.comments}
                  createComment={data => createComment(key, data)}
                  deleteComment={itemKey => deleteComment(key, itemKey)}
                  user={user}
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
            </Switch>
          </NodeMenu>
        )}
        />}

        {loading && <Spin size="large"/>}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withCommonItemMethods(injectIntl(NodeItem)));