import React from 'react';
import { Row, Col, Switch, Button } from 'antd';

import Presentation from './Presentation';
import Form from './Form';
import { FormattedMessage } from 'react-intl';
import PermissionWrapper from '../../hoc/PermissionWrapper';

class InstallationDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = { edit: props.installation === null };
  }

  render() {
    const { installation, refresh } = this.props;
    return (
      <React.Fragment>
        <div className="item-details">
          <span className="help"><FormattedMessage id="installation" defaultMessage="Installation"/></span>
          <h2>
            {installation ? installation.title :
              <FormattedMessage id="newInstallation" defaultMessage="New installation"/>}
          </h2>

          <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
            {installation && (
              <Row className="item-btn-panel">
                <Col span={18}>
                  <Switch
                    checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    onChange={(val) => this.setState({ edit: val })}
                    checked={this.state.edit}
                  />
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  {!this.state.edit && (
                    <Button type="primary" htmlType="button">
                      <FormattedMessage id="synchronizeNow" defaultMessage="Synchronize now"/>
                    </Button>
                  )}
                </Col>
              </Row>
            )}
          </PermissionWrapper>
          {!this.state.edit && <Presentation installation={installation}/>}
          {this.state.edit && (
            <Form installation={installation} onSubmit={key => {
              this.setState({ edit: false });
              refresh(key);
            }}/>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default InstallationDetails;