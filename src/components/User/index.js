import React from 'react';
import { Button, Col, Row, Spin, Switch } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

import Presentation from './Presentation';
import Form from './Form';
import { getUser } from '../../api/user';
import withCommonItemMethods from '../hoc/withCommonItemMethods';
import DocumentTitle from 'react-document-title';

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
  };

  render() {
    const { intl } = this.props;
    const { user, loading } = this.state;

    return (
      <React.Fragment>
        <DocumentTitle
          title={intl.formatMessage({ id: 'title.user', defaultMessage: 'User | GBIF Registry' })}
        >
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
        </DocumentTitle>

        {loading && <Spin size="large"/>}
      </React.Fragment>
    );
  }
}

export default withCommonItemMethods(injectIntl(User));