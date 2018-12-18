import React from 'react';
import { Switch } from 'antd';
import { FormattedMessage } from 'react-intl';

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

  render() {
    const { organization, refresh } = this.props;
    return (
      <React.Fragment>
        <div className="item-details">
          <span className="help"><FormattedMessage id="organization" defaultMessage="Organization"/></span>
          <h2>{organization ? organization.title :
            <FormattedMessage id="newOrganization" defaultMessage="New organization"/>}</h2>

          <PermissionWrapper item={organization} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
            <div className="item-btn-panel">
              {organization && <Switch
                checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                onChange={(val) => this.setState({ edit: val })}
                checked={this.state.edit}
              />}
            </div>
          </PermissionWrapper>

          {!this.state.edit && <Presentation organization={organization}/>}
          {this.state.edit && (
            <Form organization={organization} onSubmit={key => {
              this.setState({ edit: false });
              refresh(key);
            }}/>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default OrganizationDetails;