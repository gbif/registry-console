import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';

// APIs
import { getUserOverview } from '../../api/user';
import { decorateUser } from '../auth/userUtil';
// Wrappers
import withContext from '../hoc/withContext';
import PageWrapper from '../hoc/PageWrapper';
// Configuration
import MenuConfig from './menu.config';
// Components
import UserDetails from './Details';
import { ItemHeader, ItemMenu } from '../common';
import { Downloads, DerivedDatasets } from './subtypes';
import Exception404 from '../exception/404';
import Actions from './user.actions';
// Helpers
import { getSubMenu } from '../util/helpers';

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null,
      counts: {},
      status: 200
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    this.getData();
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
    this.cancelPromise();
  }

  cancelPromise() {
    if (this.axiosPromise && typeof this.axiosPromise.cancel === 'function') {
      this.axiosPromise.cancel();
    }
  }

  update(error) {
    // If component was unmounted interrupting changes
    if (!this._isMount) {
      return;
    }

    if (error) {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
      return;
    }

    this.getData();
  }

  getData() {
    this.setState({ loading: true });

    getUserOverview(this.props.match.params.key).then(async userData => {
      // const user = await decorateUser(userData.user);
      // If user lives the page, request will return result anyway and tries to set in to a state
      // which will cause an error
      if (this._isMount) {
        this.setState(() => {
          return {
            user: userData.user,
            counts: {
              download: userData.downloads.count,
              derivedDatasets: userData.derivedDatasets.count,
            },
            loading: false,
            error: false,
          };
        }, this.updateUser);
      }
    }).catch(error => {
      // Important for us due to the case of requests cancellation on unmount
      // Because in that case the request will be marked as cancelled=failed
      // and catch statement will try to update a state of unmounted component
      // which will throw an exception
      if (this._isMount) {
        this.setState({ status: error.response.status, loading: false });
        if (![404, 500, 523].includes(error.response.status)) {
          this.props.addError({ status: error.response.status, statusText: error.response.data });
        }
      }
    });
  }

  updateUser() {
    const { user } = this.state;

    decorateUser(user).then(decoratedUser => {
      if (this._isMount) {
        this.setState({ user: decoratedUser });
      }
    });
  }

  render() {
    const { match, intl } = this.props;
    const { user, loading, status, counts } = this.state;
    const listName = intl.formatMessage({ id: 'users', defaultMessage: 'Users' });
    const title = user && user.userName;
    const pageTitle = intl.formatMessage({ id: 'title.user', defaultMessage: 'User | GBIF Registry' });
    const submenu = getSubMenu(this.props);

    return (
      <React.Fragment>
        <ItemHeader listType={[listName]} title={title} pageTitle={pageTitle} submenu={submenu} status={status} loading={loading} usePaperWidth>
          {user && (
            <Actions user={user} onChange={error => this.update(error)}/>
          )}
        </ItemHeader>

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={false}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <UserDetails
                    user={user}
                    refresh={() => this.getData()}
                  />
                }/>

                <Route path={`${match.path}/download`} render={() => <Downloads userKey={match.params.key}/>}/>
                <Route path={`${match.path}/derived-dataset`} render={() => <DerivedDatasets userKey={match.params.key}/>}/>

                <Route component={Exception404}/>
              </Switch>
            </ItemMenu>
          )}
          />
        </PageWrapper>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(User)));