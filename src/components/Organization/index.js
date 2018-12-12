import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';

import {
  getOrganizationOverview,
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
} from '../../api/organization';
import OrganizationMenu from './OrganizationMenu';
import OrganizationDetails from './Details';
import { CommentList, ContactList, EndpointList, IdentifierList, MachineTagList, TagList } from '../common';
import PublishedDataset from './PublishedDataset';
import HostedDataset from './HostedDataset';
import Installations from './Installations';
import withCommonItemMethods from '../hoc/withCommonItemMethods';

class Organization extends Component {
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

    getOrganizationOverview(this.props.match.params.key).then(data => {
      this.setState({
        data,
        loading: false,
        counts: {
          contacts: data.organization.contacts.length,
          endpoints: data.organization.endpoints.length,
          identifiers: data.organization.identifiers.length,
          tags: data.organization.tags.length,
          machineTags: data.organization.machineTags.length,
          comments: data.organization.comments.length
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
    if (key) {
      this.props.history.push(key);
    }

    this.getData();
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
          <OrganizationMenu
            counts={counts}
            publishedDataset={data ? data.publishedDataset.count : 0}
            installations={data ? data.installations.count : 0}
            hostedDataset={data ? data.hostedDataset.count : 0}
          >
            <Switch>
              <Route
                exact
                path={match.path}
                render={() =>
                  <OrganizationDetails
                    organization={data ? data.organization : null}
                    refresh={key => this.refresh(key)}
                  />
                }
              />

              <Route path={`${match.path}/contact`} render={() =>
                <ContactList
                  data={data.organization.contacts}
                  createContact={data => createContact(key, data)}
                  updateContact={data => updateContact(key, data)}
                  deleteContact={itemKey => deleteContact(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/endpoint`} render={() =>
                <EndpointList
                  data={data.organization.endpoints}
                  createEndpoint={data => createEndpoint(key, data)}
                  deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/identifier`} render={() =>
                <IdentifierList
                  data={data.organization.identifiers}
                  createIdentifier={data => createIdentifier(key, data)}
                  deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/tag`} render={() =>
                <TagList
                  data={data.organization.tags}
                  createTag={data => createTag(key, data)}
                  deleteTag={itemKey => deleteTag(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/machineTag`} render={() =>
                <MachineTagList
                  data={data.organization.machineTags}
                  createMachineTag={data => createMachineTag(key, data)}
                  deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/comment`} render={() =>
                <CommentList
                  data={data.organization.comments}
                  createComment={data => createComment(key, data)}
                  deleteComment={itemKey => deleteComment(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/publishedDataset`} render={() =>
                <PublishedDataset orgKey={match.params.key}/>
              }/>
              <Route path={`${match.path}/hostedDataset`} render={() =>
                <HostedDataset orgKey={match.params.key}/>
              }/>
              <Route path={`${match.path}/installation`} render={() =>
                <Installations orgKey={match.params.key}/>
              }/>
            </Switch>
          </OrganizationMenu>
        )}
        />}

        {loading && <Spin size="large"/>}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withCommonItemMethods(Organization));