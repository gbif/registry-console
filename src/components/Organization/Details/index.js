import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Switch, Button } from 'antd';
import Presentation from './Presentation';
import Form from './Form';

class OrganizationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.organization === null
    };
  }

  render() {
    const { organization, user, refresh } = this.props;
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
          {!this.state.edit && <Presentation organization={organization}/>}
          {this.state.edit && <Form organization={organization} onSubmit={key => {
            this.setState({ edit: false });
            refresh(key);
          }}/>}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(OrganizationDetails);