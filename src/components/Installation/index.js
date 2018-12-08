import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spin } from 'antd';

import {
  getInstallationOverview,
  updateContact,
  deleteContact,
  createContact,
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
} from '../../api/installation';
import InstallationMenu from './InstallationMenu';
import InstallationDetails from './Details';
import ContactList from '../common/ContactList';
import EndpointList from '../common/EndpointList';
import IdentifierList from '../common/IdentifiersList';
import TagList from '../common/TagList';
import MachineTagList from '../common/MachineTagList';
import CommentList from '../common/CommentList';

class Installation extends Component {
  constructor(props) {
    super(props);

    this.getData = this.getData.bind(this);

    this.state = {
      loading: true,
      error: false,
      data: null,
      counts: {}
    };
  }

  componentWillMount() {
    this.getData();
  }

  getData() {
    this.setState({
      loading: true,
      error: false
    });

    getInstallationOverview(this.props.match.params.key).then(data => {
      this.setState({
        data,
        loading: false,
        error: false,
        counts: {
          contacts: data.installation.contacts.length,
          endpoints: data.installation.endpoints.length,
          identifiers: data.installation.identifiers.length,
          tags: data.installation.tags.length,
          machineTags: data.installation.machineTags.length,
          comments: data.installation.comments.length
        }
      });
    }).catch(() => {
      this.setState({
        error: true
      });
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
    const { match, user } = this.props;
    const key = match.params.key;
    const { data, loading, counts } = this.state;

    return (
      <React.Fragment>
        {!loading && <Route path="/:type?/:key?/:section?" render={() => (
          <InstallationMenu
            counts={counts}
            publishedDataset={data.publishedDataset}
            installations={data.installations}
            hostedDataset={data.hostedDataset}
          >
            <Switch>
              <Route
                exact
                path={`${match.path}`}
                render={() => <InstallationDetails installation={data.installation} refresh={this.getData}/>}
              />

              <Route path={`${match.path}/contact`} render={() =>
                <ContactList
                  data={data.installation.contacts}
                  createContact={data => createContact(key, data)}
                  updateContact={data => updateContact(key, data)}
                  deleteContact={itemKey => deleteContact(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/endpoint`} render={() =>
                <EndpointList
                  data={data.installation.endpoints}
                  createEndpoint={data => createEndpoint(key, data)}
                  deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/identifier`} render={() =>
                <IdentifierList
                  data={data.installation.identifiers}
                  createIdentifier={data => createIdentifier(key, data)}
                  deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/tag`} render={() =>
                <TagList
                  data={data.installation.tags}
                  createTag={data => createTag(key, data)}
                  deleteTag={itemKey => deleteTag(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/machineTag`} render={() =>
                <MachineTagList
                  data={data.installation.machineTags}
                  createMachineTag={data => createMachineTag(key, data)}
                  deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/comment`} render={() =>
                <CommentList
                  data={data.installation.comments}
                  createComment={data => createComment(key, data)}
                  deleteComment={itemKey => deleteComment(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>
            </Switch>
          </InstallationMenu>
        )}
        />}

        {loading && <Spin size="large"/>}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withRouter(Installation));