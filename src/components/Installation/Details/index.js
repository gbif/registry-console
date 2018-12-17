import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Switch, Button } from 'antd';

import Presentation from './Presentation';
import Form from './Form';
import { FormattedMessage } from 'react-intl';

class InstallationDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = { edit: props.installation === null };
  }

  render() {
    const { installation, user, refresh } = this.props;
    return (
      <React.Fragment>
        <div style={{ maxWidth: 800 }}>
          {user && installation && (
            <Row className="item-btn-panel">
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
                  <FormattedMessage id="synchronizeNow" defaultMessage="Synchronize now"/>
                </Button>
              </Col>
            </Row>
          )}
          {!this.state.edit && <Presentation installation={installation}/>}
          {this.state.edit && <Form installation={installation} onSubmit={key => {
            this.setState({ edit: false });
            refresh(key);
          }}/>}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(InstallationDetails);