import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';

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
import { ItemMenu } from '../widgets';
import InstallationDetails from './Details';
import { ContactList, EndpointList, MachineTagList, CommentList } from '../common';
import ServedDataset from './ServedDatasets';
import Exception404 from '../Exception/404';
import MenuConfig from './MenuConfig';
import { addError } from '../../actions/errors';
import withContext from '../hoc/withContext';

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
      this.props.setItem(data.installation);
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

    return (
      <DocumentTitle
        title={
          data || loading ?
            intl.formatMessage({ id: 'title.installation', defaultMessage: 'Installation | GBIF Registry' }) :
            intl.formatMessage({ id: 'title.newInstallation', defaultMessage: 'New installation | GBIF Registry' })
        }
      >
        <React.Fragment>
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
                    data={data.installation.contacts}
                    createContact={data => createContact(key, data)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={itemKey => deleteContact(key, itemKey)}
                    update={this.updateCounts}
                    title={data.installation.title}
                  />
                }/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    data={data.installation.endpoints}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    update={this.updateCounts}
                    title={data.installation.title}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    data={data.installation.machineTags}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    update={this.updateCounts}
                    title={data.installation.title}
                  />
                }/>

                <Route path={`${match.path}/comment`} render={() =>
                  <CommentList
                    data={data.installation.comments}
                    createComment={data => createComment(key, data)}
                    deleteComment={itemKey => deleteComment(key, itemKey)}
                    update={this.updateCounts}
                    title={data.installation.title}
                  />
                }/>

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
      </DocumentTitle>
    );
  }
}

const mapDispatchToProps = { addError: addError };
const mapContextToProps = ({ setItem }) => ({ setItem });

export default withContext(mapContextToProps)(connect(null, mapDispatchToProps)(withRouter(injectIntl(Installation))));