import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';

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
import ItemMenu from '../widgets/ItemMenu';
import OrganizationDetails from './Details';
import { CommentList, ContactList, EndpointList, IdentifierList, MachineTagList, TagList } from '../common';
import PublishedDataset from './PublishedDataset';
import HostedDataset from './HostedDataset';
import Installations from './Installations';
import Exception404 from '../Exception/404';
import withCommonItemMethods from '../hoc/withCommonItemMethods';
import MenuConfig from './MenuConfig';

class Organization extends Component {
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
          comments: data.organization.comments.length,
          publishedDataset: data.publishedDataset.count,
          installations: data.installations.count,
          hostedDataset: data.hostedDataset.count
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

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { data, loading, counts } = this.state;

    return (
      <React.Fragment>
        <DocumentTitle
          title={
            data || loading ?
              intl.formatMessage({ id: 'title.organization', defaultMessage: 'Organization | GBIF Registry' }) :
              intl.formatMessage({ id: 'title.newOrganization', defaultMessage: 'New organization | GBIF Registry' })
          }
        >
          {!loading && <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={data === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <OrganizationDetails
                    organization={data ? data.organization : null}
                    refresh={key => this.refresh(key)}
                  />
                }/>

                <Route path={`${match.path}/contact`} render={() =>
                  <ContactList
                    data={data.organization.contacts}
                    createContact={data => createContact(key, data)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={itemKey => deleteContact(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    data={data.organization.endpoints}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    data={data.organization.identifiers}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    data={data.organization.tags}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    data={data.organization.machineTags}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/comment`} render={() =>
                  <CommentList
                    data={data.organization.comments}
                    createComment={data => createComment(key, data)}
                    deleteComment={itemKey => deleteComment(key, itemKey)}
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

                <Route component={Exception404}/>
              </Switch>
            </ItemMenu>
          )}
          />}
        </DocumentTitle>

        {loading && <Spin size="large"/>}
      </React.Fragment>
    );
  }
}

export default withCommonItemMethods(injectIntl(Organization));