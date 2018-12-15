import React from 'react';
import { connect } from 'react-redux';
import { Switch } from 'antd';
import { FormattedMessage } from 'react-intl';

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
        <div className="item-details">
          {user && organization && (
            <div className="item-btn-panel">
              <Switch
                checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                onChange={(val) => this.setState({ edit: val })}
                checked={this.state.edit}
              />
            </div>
          )}
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