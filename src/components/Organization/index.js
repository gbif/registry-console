import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
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
import { ItemMenu } from '../widgets';
import OrganizationDetails from './Details';
import { CommentList, ContactList, EndpointList, IdentifierList, MachineTagList, TagList } from '../common';
import PublishedDataset from './PublishedDataset';
import HostedDataset from './HostedDataset';
import Installations from './Installations';
import Exception404 from '../exception/404';
import MenuConfig from './menu.config';
import withContext from '../hoc/withContext';
import BreadCrumbs from '../widgets/BreadCrumbs';
import { getSubMenu } from '../../api/util/helpers';

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
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
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
    const listName = intl.formatMessage({ id: 'organizations', defaultMessage: 'Organizations' });
    const title = data ?
      data.organization.title :
      intl.formatMessage({ id: 'newOrganization', defaultMessage: 'New organization' });
    const submenu = getSubMenu(this.props);

    return (
      <DocumentTitle
        title={
          data || loading ?
            intl.formatMessage({ id: 'title.organization', defaultMessage: 'Organization | GBIF Registry' }) :
            intl.formatMessage({ id: 'title.newOrganization', defaultMessage: 'New organization | GBIF Registry' })
        }
      >
        <React.Fragment>
          {!loading && <BreadCrumbs listType={[listName]} title={title} submenu={submenu}/>}

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
                    data={data.organization}
                    createContact={data => createContact(key, data)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={itemKey => deleteContact(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    data={data.organization}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    data={data.organization}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    data={data.organization}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    data={data.organization}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/comment`} render={() =>
                  <CommentList
                    data={data.organization}
                    createComment={data => createComment(key, data)}
                    deleteComment={itemKey => deleteComment(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/publishedDataset`} render={() =>
                  <PublishedDataset orgKey={match.params.key} title={data.organization.title}/>
                }/>
                <Route path={`${match.path}/hostedDataset`} render={() =>
                  <HostedDataset orgKey={match.params.key} title={data.organization.title}/>
                }/>
                <Route path={`${match.path}/installation`} render={() =>
                  <Installations orgKey={match.params.key} title={data.organization.title}/>
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

export default withContext(mapContextToProps)(withRouter(injectIntl(Organization)));