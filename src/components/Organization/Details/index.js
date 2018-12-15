import React from 'react';
import { Switch } from 'antd';
import { FormattedMessage } from 'react-intl';

import Presentation from './Presentation';
import Form from './Form';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import ContextConsumer from '../../hoc/ContextConsumer';

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
          <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
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
            <ContextConsumer render={context =>
              <Form organization={organization} {...context} onSubmit={key => {
                this.setState({ edit: false });
                refresh(key);
              }}/>
            }/>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default OrganizationDetails;