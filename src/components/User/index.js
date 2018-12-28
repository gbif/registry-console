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
    this.getData();
  }

  getData() {
    this.setState({ loading: true });

    getUser(this.props.match.params.key).then(response => {
      this.setState({
        user: response.data,
        loading: false,
        status: !response.data ? 404 : 200
      });
    }).catch(error => {
      if (error.response.status === 404 || error.response.status === 500) {
        this.setState({ status: error.response.status });
      } else {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      }
    }).finally(() => {
      this.setState({ loading: false });
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