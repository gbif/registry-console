import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Switch, Button } from 'antd';
import { FormattedMessage } from 'react-intl';

import Presentation from './Presentation';
import Form from './Form';

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.dataset === null
    };
  }

  render() {
    const { dataset, user, refresh } = this.props;
    return (
      <React.Fragment>
        <div className="item-details">
          {user && dataset && <Row className="item-btn-panel">
            <Col span={20}>
              <Switch
                checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                onChange={(val) => this.setState({ edit: val })}
                checked={this.state.edit}
              />
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              {!this.state.edit && (
                <Button type="primary" htmlType="button">
                  <FormattedMessage id="crawl" defaultMessage="Crawl"/>
                </Button>
              )}
            </Col>
          </Row>}
          {!this.state.edit && <Presentation dataset={dataset}/>}
          {this.state.edit && <Form dataset={dataset} onSubmit={key => {
            this.setState({ edit: false });
            refresh(key);
          }}/>}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(Details);