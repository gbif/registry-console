import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';

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
import InstallationMenu from './InstallationMenu';
import InstallationDetails from './Details';
import { ContactList, EndpointList, MachineTagList, CommentList } from '../common';
import ServedDataset from './ServedDatasets';

class Installation extends Component {
  constructor(props) {
    super(props);

    this.getData = this.getData.bind(this);

    this.state = {
      loading: true,
      data: null,
      counts: {
        contacts: 0,
        endpoints: 0,
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

    getInstallationOverview(this.props.match.params.key).then(data => {
      this.setState({
        data,
        loading: false,
        error: false,
        counts: {
          contacts: data.installation.contacts.length,
          endpoints: data.installation.endpoints.length,
          machineTags: data.installation.machineTags.length,
          comments: data.installation.comments.length
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
    const { match, user, intl } = this.props;
    const key = match.params.key;
    const { data, loading, counts } = this.state;

    return (
      <React.Fragment>
        <DocumentTitle
          title={
            data || loading ?
              intl.formatMessage({ id: 'title.installation', defaultMessage: 'Installation | GBIF Registry' }) :
              intl.formatMessage({ id: 'title.newInstallation', defaultMessage: 'New installation | GBIF Registry' })
          }
        >
          {!loading && <Route path="/:type?/:key?/:section?" render={() => (
            <InstallationMenu
              counts={counts}
              servedDataset={data ? data.servedDataset.count : 0}
              syncHistory={data ? data.syncHistory.count : 0}
            >
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

                <Route path={`${match.path}/servedDatasets`} render={() =>
                  <ServedDataset orgKey={match.params.key}/>
                }/>
              </Switch>
            </InstallationMenu>
          )}
          />}
        </DocumentTitle>

        {loading && <Spin size="large"/>}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withRouter(injectIntl(Installation)));