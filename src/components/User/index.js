import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';

// APIs
import { getUser } from '../../api/user';
// Wrappers
import Paper from '../search/Paper';
import withContext from '../hoc/withContext';
import PageWrapper from '../hoc/PageWrapper';
// Components
import UserDetails from './Details';
import Exception404 from '../exception/404';
import { ItemHeader } from '../widgets';

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null,
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

  getData() {
    this.setState({ loading: true });

    this.axiosPromise = getUser(this.props.match.params.key);
    this.axiosPromise.then(response => {
      this.setState({
        user: response.data,
        loading: false,
        status: !response.data ? 404 : 200
      });
    }).catch(error => {
      // Important for us due to the case of requests cancellation on unmount
      // Because in that case the request will be marked as cancelled=failed
      // and catch statement will try to update a state of unmounted component
      // which will throw an exception
      if (this._isMount) {
        this.setState({ status: error.response.status, loading: false });
        if (![404, 500].includes(error.response.status)) {
          this.props.addError({ status: error.response.status, statusText: error.response.data });
        }
      }
    });
  }

  render() {
    const { match, intl } = this.props;
    const { user, loading, status } = this.state;
    const listName = intl.formatMessage({ id: 'users', defaultMessage: 'Users' });
    const title = user && user.userName;
    const pageTitle = intl.formatMessage({ id: 'title.user', defaultMessage: 'User | GBIF Registry' });

    return (
      <React.Fragment>
        <ItemHeader listType={[listName]} title={title} pageTitle={pageTitle} loading={loading}/>

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?" render={() => (
            <Paper padded>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <UserDetails
                    user={user}
                    refresh={() => this.getData()}
                  />
                }/>

                <Route component={Exception404}/>
              </Switch>
            </Paper>
          )}
          />
        </PageWrapper>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(User)));