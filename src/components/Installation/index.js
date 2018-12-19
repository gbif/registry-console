import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';

import {
  getInstallationOverview,
  updateContact,
  deleteContact,
  createContact,
  createEndpoint,
  deleteEndpoint,
  createMachineTag,
  deleteMachineTag,
  createComment,
  deleteComment
} from '../../api/installation';
import { ItemHeader, ItemMenu } from '../widgets';
import InstallationDetails from './Details';
import { ContactList, EndpointList, MachineTagList, CommentList } from '../common';
import ServedDataset from './ServedDatasets';
import Exception404 from '../exception/404';
import MenuConfig from './menu.config';
import withContext from '../hoc/withContext';
import { getSubMenu } from '../../api/util/helpers';
import AuthRoute from '../AuthRoute';

class Installation extends Component {
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

    getInstallationOverview(this.props.match.params.key).then(data => {
      this.setState({
        data,
        loading: false,
        error: false,
        counts: {
          contacts: data.installation.contacts.length,
          endpoints: data.installation.endpoints.length,
          machineTags: data.installation.machineTags.length,
          comments: data.installation.comments.length,
          servedDataset: data.servedDataset.count,
          syncHistory: data.syncHistory.count
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
    const listName = intl.formatMessage({ id: 'installations', defaultMessage: 'Installations' });
    const submenu = getSubMenu(this.props);
    const pageTitle = data || loading ?
      intl.formatMessage({ id: 'title.installation', defaultMessage: 'Installation | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newInstallation', defaultMessage: 'New installation | GBIF Registry' });
    let title = '';
    if (data) {
      title = data.installation.title;
    } else if (!loading) {
      title = intl.formatMessage({ id: 'newInstallation', defaultMessage: 'New installation' });
    }

    return (
      <React.Fragment>
        <ItemHeader listType={[listName]} title={title} submenu={submenu} pageTitle={pageTitle}/>

        {!loading && <Route path="/:type?/:key?/:section?" render={() => (
          <ItemMenu counts={counts} config={MenuConfig} isNew={data === null}>
            <Switch>
              <Route
                exact
                path={`${match.path}`}
                render={() =>
                  <InstallationDetails
                    installation={data ? data.installation : null}
                    refresh={key => this.refresh(key)}
                  />
                }/>

              <Route path={`${match.path}/contact`} render={() =>
                <ContactList
                  data={data.installation}
                  createContact={data => createContact(key, data)}
                  updateContact={data => updateContact(key, data)}
                  deleteContact={itemKey => deleteContact(key, itemKey)}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/endpoint`} render={() =>
                <EndpointList
                  data={data.installation}
                  createEndpoint={data => createEndpoint(key, data)}
                  deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/machineTag`} render={() =>
                <MachineTagList
                  data={data.installation}
                  createMachineTag={data => createMachineTag(key, data)}
                  deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                  update={this.updateCounts}
                />
              }/>

              <AuthRoute
                path={`${match.path}/comment`}
                component={() =>
                  <CommentList
                    data={data.installation}
                    createComment={data => createComment(key, data)}
                    deleteComment={itemKey => deleteComment(key, itemKey)}
                    update={this.updateCounts}
                  />
                }
                roles={['REGISTRY_ADMIN']}
              />

              <Route path={`${match.path}/servedDatasets`} render={() =>
                <ServedDataset instKey={match.params.key} title={data.installation.title}/>
              }/>

              <Route component={Exception404}/>
            </Switch>
          </ItemMenu>
        )}
        />}

        {loading && <Spin size="large"/>}
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(Installation)));