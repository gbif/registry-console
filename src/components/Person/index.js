import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';

import { getPerson } from '../../api/grbio.person';
import { ItemMenu } from '../widgets';
import PersonDetails from './Details';
import Exception404 from '../exception/404';
import MenuConfig from './menu.config';
import withContext from '../hoc/withContext';
import BreadCrumbs from '../widgets/BreadCrumbs';
import { getSubMenu } from '../../api/util/helpers';

class Person extends Component {
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

    getPerson(this.props.match.params.key).then(response => {

      this.setState({
        data: response.data,
        loading: false
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

  render() {
    const { match, intl } = this.props;
    const { data, loading, counts } = this.state;
    const listName = intl.formatMessage({ id: 'persons', defaultMessage: 'Persons' });
    const title = data ?
      data.name :
      intl.formatMessage({ id: 'newPerson', defaultMessage: 'New person' });
    const submenu = getSubMenu(this.props);

    return (
      <DocumentTitle
        title={
          data || loading ?
            intl.formatMessage({ id: 'title.person', defaultMessage: 'Person | GBIF Registry' }) :
            intl.formatMessage({ id: 'title.newPerson', defaultMessage: 'New person | GBIF Registry' })
        }
      >
        <React.Fragment>
          {!loading && <BreadCrumbs listType={[listName]} title={title} submenu={submenu}/>}

          {!loading && <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={data === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <PersonDetails
                    person={data}
                    refresh={key => this.refresh(key)}
                  />
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

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(Person)));