import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Col, Row, Spin } from 'antd';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';

import { getUser } from '../../api/user';
import UserDetails from './Details';
import Exception404 from '../Exception/404';
import withContext from '../hoc/withContext';

class Organization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null,
      counts: {}
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
        loading: false
      });
      this.props.setItem(response.data);
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  }

  render() {
    const { match, intl } = this.props;
    const { user, loading } = this.state;

    return (
      <DocumentTitle
        title={intl.formatMessage({ id: 'title.user', defaultMessage: 'User | GBIF Registry' })}
      >
        <React.Fragment>
          {user && !loading && <Route path="/:type?/:key?/:section?" render={() => (
            <div style={{ background: '#fff' }}>
              <Row type="flex" justify="start">
                <Col span={24} style={{ padding: '16px', boxSizing: 'border-box' }}>
                  <Switch>
                    <Route exact path={`${match.path}`} render={() =>
                      <UserDetails
                        user={user}
                        refresh={() => this.getData()}
                      />
                    }/>

                    <Route component={Exception404}/>
                  </Switch>
                </Col>
              </Row>
            </div>
          )}
          />}

          {loading && <Spin size="large"/>}
        </React.Fragment>
      </DocumentTitle>
    );
  }
}

const mapContextToProps = ({ setItem, addError }) => ({ setItem, addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(Organization)));