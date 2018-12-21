import React from 'react';
import { Col, Row, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import injectSheet from 'react-jss';

import Presentation from './Presentation';
import Form from './Form';
import PermissionWrapper from '../../hoc/PermissionWrapper';

const styles = {
  container: {
    maxWidth: 600,
    margin: '0 auto'
  }
};

class PersonDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.person === null
    };
  }

  onCancel = () => {
    if (this.props.person) {
      this.setState({ edit: false });
    } else {
      this.props.history.push('/grbio/person/search');
    }
  };

  render() {
    const { person, refresh, classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.container}>
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="details.person" defaultMessage="Person details"/></h2>
            </Col>
            <Col span={4} className="text-right">
              <PermissionWrapper uid={[]} roles={['REGISTRY_ADMIN']}>
                <div className="item-btn-panel">
                  {person && <Switch
                    checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    onChange={(val) => this.setState({ edit: val })}
                    checked={this.state.edit}
                  />}
                </div>
              </PermissionWrapper>
            </Col>
          </Row>

          {!this.state.edit && <Presentation person={person}/>}
          {this.state.edit && (
            <Form
              person={person}
              onSubmit={key => {
                this.setState({ edit: false });
                refresh(key);
              }}
              onCancel={this.onCancel}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(injectSheet(styles)(PersonDetails));