import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Switch, Button } from 'antd';

import Presentation from './Presentation';
import Form from './Form';

class InstallationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { edit: false };
  }

  render() {
    const { installation, user, refresh } = this.props;
    return (
      <React.Fragment>
        <div style={{ maxWidth: 800 }}>
          {user && <Row style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Switch
                checkedChildren="Edit"
                unCheckedChildren="Edit"
                onChange={(val) => this.setState({ edit: val })}
                checked={this.state.edit}
              />
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="button">Crawl</Button>
            </Col>
          </Row>}
          {!this.state.edit && <Presentation installation={installation}/>}
          {this.state.edit && <Form installation={installation} onSubmit={() => {
            this.setState({ edit: false });
            refresh();
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