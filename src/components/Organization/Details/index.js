import React from 'react';
import { Col, Row, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import Presentation from './Presentation';
import Form from './Form';
import PermissionWrapper from '../../hoc/PermissionWrapper';

class OrganizationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.organization === null
    };
  }

  onCancel = () => {
    if (this.props.organization) {
      this.setState({ edit: false });
    } else {
      this.props.history.push('/organization/search');
    }
  };

  render() {
    const { organization, refresh } = this.props;
    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="details.organization" defaultMessage="Organization details"/></h2>
            </Col>
            <Col span={4} className="text-right">
              <PermissionWrapper uid={[organization.key, organization.endorsingNodeKey]} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <div className="item-btn-panel">
                  {organization && <Switch
                    checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    onChange={(val) => this.setState({ edit: val })}
                    checked={this.state.edit}
                  />}
                </div>
              </PermissionWrapper>
            </Col>
          </Row>

          {!this.state.edit && <Presentation organization={organization}/>}
          {this.state.edit && (
            <Form
              organization={organization}
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

export default withRouter(OrganizationDetails);