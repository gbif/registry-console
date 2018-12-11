import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Switch, Button } from 'antd';
import { FormattedMessage } from 'react-intl';

import Presentation from './Presentation';
import Form from './Form';

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = { edit: false };
  }

  render() {
    const { dataset, user, refresh } = this.props;
    return (
      <React.Fragment>
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
              <Button type="primary">
                <FormattedMessage id="crawl" defaultMessage="Crawl"/>
              </Button>
            </Col>
          </Row>}
          {!this.state.edit && <Presentation dataset={dataset}/>}
          {this.state.edit && <Form dataset={dataset} onSubmit={() => {
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

export default connect(mapStateToProps)(Details);