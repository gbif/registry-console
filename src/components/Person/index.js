import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';

// APIs
import { getPersonOverview } from '../../api/grbio.person';
// Wrappers
import Paper from '../search/Paper';
import withContext from '../hoc/withContext';
import PageWrapper from '../hoc/PageWrapper';
// Components
import { ItemHeader } from '../widgets';
import PersonDetails from './Details';
import Exception404 from '../exception/404';
// Helpers
import { getSubMenu } from '../helpers';

class Person extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: null,
      status: 200
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    if (this.props.match.params.key) {
      this.getData();
    } else {
      this.setState({
        data: null,
        loading: false
      });
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getData() {
    this.setState({ loading: true });

    getPersonOverview(this.props.match.params.key).then(data => {
      this.setState({
        data,
        loading: false
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

  refresh = key => {
    if (key) {
      this.props.history.push(key);
    } else {
      this.getData();
    }
  };

  getTitle = () => {
    const { intl } = this.props;
    const { data, loading } = this.state;

    if (data) {
      return data.name;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newPerson', defaultMessage: 'New person' });
    }

    return '';
  };

  render() {
    const { match, intl } = this.props;
    const { data, loading, status } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'persons', defaultMessage: 'Persons' });
    const submenu = getSubMenu(this.props);
    const pageTitle = data || loading ?
      intl.formatMessage({ id: 'title.person', defaultMessage: 'Person | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newPerson', defaultMessage: 'New person | GBIF Registry' });
    const title = this.getTitle();

    return (
      <React.Fragment>
        <ItemHeader
          listType={[listName]}
          title={title}
          submenu={submenu}
          pageTitle={pageTitle}
          status={status}
          loading={loading}
        />

        <PageWrapper status={status} loading={loading}>
          <Route path="/:parent?/:type?/:key?/:section?" render={() => (
            <Paper padded>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <PersonDetails
                    person={data}
                    refresh={key => this.refresh(key)}
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

export default withContext(mapContextToProps)(withRouter(injectIntl(Person)));