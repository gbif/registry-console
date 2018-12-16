import React from 'react';
import { Button, Col, Row, Spin, Switch } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import Presentation from './Presentation';
import Form from './Form';
import { getUser } from '../../api/user';
import { addError } from '../../actions/errors';
import withContext from '../hoc/withContext';

class User extends React.Component {
  state = {
    edit: false,
    loading: false,
    user: null
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
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
  };

  render() {
    const { intl } = this.props;
    const { user, loading } = this.state;

    return (
      <DocumentTitle
        title={intl.formatMessage({ id: 'title.user', defaultMessage: 'User | GBIF Registry' })}
      >
        <React.Fragment>
          {!loading && (
            <div className="item-details">
              {user && <Row className="item-btn-panel">
                <Col span={20}>
                  <Switch
                    checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    onChange={(val) => this.setState({ edit: val })}
                    checked={this.state.edit}
                  />
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="button">
                    <FormattedMessage id="crawl" defaultMessage="Crawl"/>
                  </Button>
                </Col>
              </Row>}
              {!this.state.edit && <Presentation user={user}/>}
              {this.state.edit && <Form user={user} onSubmit={() => {
                this.setState({ edit: false });
                this.getData();
              }}/>}
            </div>
          )}

          {loading && <Spin size="large"/>}
        </React.Fragment>
      </DocumentTitle>
    );
  }
}

const mapDispatchToProps = { addError: addError };
const mapContextToProps = ({ setItem }) => ({ setItem });

export default withContext(mapContextToProps)(connect(null, mapDispatchToProps)(injectIntl(User)));