import React from 'react';
import { Switch } from 'antd';
import { FormattedMessage } from 'react-intl';

import Presentation from './Presentation';
import Form from './Form';
import PermissionWrapper from '../../hoc/PermissionWrapper';

class InstitutionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.institution === null
    };
  }

  render() {
    const { institution, refresh } = this.props;
    return (
      <React.Fragment>
        <div className="item-details">
          <span className="help"><FormattedMessage id="institution" defaultMessage="Institution"/></span>
          <h2>{institution ? institution.name :
            <FormattedMessage id="newInstitution" defaultMessage="New institution"/>}</h2>

          <PermissionWrapper item={institution} roles={['REGISTRY_ADMIN']}>
            <div className="item-btn-panel">
              {institution && <Switch
                checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                onChange={(val) => this.setState({ edit: val })}
                checked={this.state.edit}
              />}
            </div>
          </PermissionWrapper>

          {!this.state.edit && <Presentation institution={institution}/>}
          {this.state.edit && (
            <Form institution={institution} onSubmit={key => {
              this.setState({ edit: false });
              refresh(key);
            }}/>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default InstitutionDetails;