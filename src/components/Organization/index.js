import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
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
import { ItemMenu, ItemHeader } from '../widgets';
import OrganizationDetails from './Details';
import { CommentList, ContactList, EndpointList, IdentifierList, MachineTagList, TagList } from '../common';
import PublishedDataset from './PublishedDataset';
import HostedDataset from './HostedDataset';
import Installations from './Installations';
import Exception404 from '../exception/404';
import MenuConfig from './menu.config';
import withContext from '../hoc/withContext';
import { getSubMenu } from '../helpers';
import AuthRoute from '../AuthRoute';

class Organization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: null,
      counts: {},
      isNotFound: false
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
      if (error.response.status === 404) {
        this.setState({ isNotFound: true });
      } else {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      }
    }).finally(() => {
      this.setState({ loading: false });
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

  getTitle = () => {
    const { intl } = this.props;
    const { data, loading, isNotFound } = this.state;

    if (data) {
      return data.organization.title;
    } else if (!loading && !isNotFound) {
      return intl.formatMessage({ id: 'newOrganization', defaultMessage: 'New organization' });
    }

    return '';
  };

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { data, loading, counts, isNotFound } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'organizations', defaultMessage: 'Organizations' });
    const submenu = isNotFound ? '' : getSubMenu(this.props);
    const pageTitle = data || loading ?
      intl.formatMessage({ id: 'title.organization', defaultMessage: 'Organization | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newOrganization', defaultMessage: 'New organization | GBIF Registry' });
    const title = this.getTitle();

    return (
      <React.Fragment>
        {isNotFound && <Exception404/>}

        {!loading && !isNotFound && (
          <React.Fragment>
            <ItemHeader listType={[listName]} title={title} submenu={submenu} pageTitle={pageTitle}/>

            <Route path="/:type?/:key?/:section?" render={() => (
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
                      uid={[data.organization.key, data.organization.endorsingNodeKey]}
                      createContact={data => createContact(key, data)}
                      updateContact={data => updateContact(key, data)}
                      deleteContact={itemKey => deleteContact(key, itemKey)}
                      update={this.updateCounts}
                    />
                  }/>

                  <Route path={`${match.path}/endpoint`} render={() =>
                    <EndpointList
                      data={data.organization.endpoints}
                      uid={[data.organization.key, data.organization.endorsingNodeKey]}
                      createEndpoint={data => createEndpoint(key, data)}
                      deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                      update={this.updateCounts}
                    />
                  }/>

                  <Route path={`${match.path}/identifier`} render={() =>
                    <IdentifierList
                      data={data.organization.identifiers}
                      uid={[data.organization.key, data.organization.endorsingNodeKey]}
                      createIdentifier={data => createIdentifier(key, data)}
                      deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                      update={this.updateCounts}
                    />
                  }/>

                  <Route path={`${match.path}/tag`} render={() =>
                    <TagList
                      data={data.organization.tags}
                      uid={[data.organization.key, data.organization.endorsingNodeKey]}
                      createTag={data => createTag(key, data)}
                      deleteTag={itemKey => deleteTag(key, itemKey)}
                      update={this.updateCounts}
                    />
                  }/>

                  <Route path={`${match.path}/machineTag`} render={() =>
                    <MachineTagList
                      data={data.organization.machineTags}
                      uid={[data.organization.key, data.organization.endorsingNodeKey]}
                      createMachineTag={data => createMachineTag(key, data)}
                      deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                      update={this.updateCounts}
                    />
                  }/>

                  <AuthRoute
                    path={`${match.path}/comment`}
                    component={() =>
                      <CommentList
                        data={data.organization.comments}
                        uid={[data.organization.key, data.organization.endorsingNodeKey]}
                        createComment={data => createComment(key, data)}
                        deleteComment={itemKey => deleteComment(key, itemKey)}
                        update={this.updateCounts}
                      />
                    }
                    roles={['REGISTRY_ADMIN']}
                  />

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
            />
          </React.Fragment>
        )}

        {loading && <Spin size="large"/>}
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(Organization)));