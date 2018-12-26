import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';

import { getPerson } from '../../api/grbio.person';
import { ItemHeader } from '../widgets';
import PersonDetails from './Details';
import Exception404 from '../exception/404';
import withContext from '../hoc/withContext';
import { getSubMenu } from '../helpers';
import Paper from '../search/Paper';

class Person extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: null,
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

    getPerson(this.props.match.params.key).then(response => {

      this.setState({
        data: response.data,
        loading: false
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

  getTitle = () => {
    const { intl } = this.props;
    const { data, loading, isNotFound } = this.state;

    if (data) {
      return data.name;
    } else if (!loading && !isNotFound) {
      return intl.formatMessage({ id: 'newPerson', defaultMessage: 'New person' });
    }

    return '';
  };

  render() {
    const { match, intl } = this.props;
    const { data, loading, isNotFound } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'persons', defaultMessage: 'Persons' });
    const submenu = getSubMenu(this.props);
    const pageTitle = data || loading ?
      intl.formatMessage({ id: 'title.person', defaultMessage: 'Person | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newPerson', defaultMessage: 'New person | GBIF Registry' });
    const title = this.getTitle();

    return (
      <React.Fragment>
        {isNotFound && <Exception404/>}

        {!loading && !isNotFound && (
          <React.Fragment>
            <ItemHeader listType={[listName]} title={title} submenu={submenu} pageTitle={pageTitle}/>

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
          </React.Fragment>
        )}

        {loading && <Spin size="large"/>}
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(Person)));