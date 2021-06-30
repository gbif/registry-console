import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';

// APIs
import { whoami } from '../../api/user';
import { decorateUser } from '../auth/userUtil';
// Wrappers
import withContext from '../hoc/withContext';
import PageWrapper from '../hoc/PageWrapper';
// Components
import UserDetails from './Details';
// Configuration
import config from '../../api/util/config';

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

    whoami().then(async userData => {
      // const user = await decorateUser(userData.user);
      // If user lives the page, request will return result anyway and tries to set in to a state
      // which will cause an error
      if (this._isMount) {
        this.setState(() => {
          return {
            user: userData.user,
            counts: {
              download: userData.downloads.count
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
    const { user, loading, status } = this.state;

    return (
      <React.Fragment>
        <PageWrapper status={status} loading={loading}>
          <div style={{background: '#fff', maxWidth: 800, margin: '16px auto', padding: 16}}>
            <div>
              <a href={`${config.gbifUrl}/user/profile`}>Edit your profile on GBIF.org</a>
            </div>
            <UserDetails
              user={user}
              refresh={() => this.getData()}
            />
          </div>
        </PageWrapper>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(User)));