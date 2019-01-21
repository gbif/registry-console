import React from 'react';
import { Alert, Col, Icon, Row, Switch, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

// Wrappers
import { HasScope } from '../../auth';
import ItemFormWrapper from '../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';
import FormattedRelativeDate from '../../common/FormattedRelativeDate';

class OrganizationDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: !props.organization,
      isModalVisible: false
    };
  }

  onCancel = () => {
    if (this.props.organization) {
      this.setState({ isModalVisible: false });
    } else {
      this.props.history.push('/organization/search');
    }
  };

  onSubmit = key => {
    this.setState({ edit: false, isModalVisible: false });
    this.props.refresh(key);
  };

  toggleEditState = val => {
    if (this.props.organization) {
      this.setState({ isModalVisible: val });
    } else {
      this.setState({ edit: false });
    }
  };

  render() {
    const { organization, uuids } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2>
                <FormattedMessage id="details.organization" defaultMessage="Organization details"/>
                <Tooltip title={
                  <FormattedMessage
                    id="help.orgOverviewInfo"
                    defaultMessage="This information appears on the organization profile, organization pages, search results, and beyond."
                  />
                }>
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </h2>
            </Col>
            <Col span={4} className="text-right">
              <HasScope uuids={uuids}>
                {/* If organization was deleted, it couldn't be edited before restoring */}
                {organization && !organization.deleted && (
                  <div className="item-btn-panel">
                    {organization && <Switch
                      checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                      unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                      onChange={this.toggleEditState}
                      checked={this.state.edit || this.state.isModalVisible}
                    />}
                  </div>
                )}
              </HasScope>
            </Col>
          </Row>

          {/* If organization was deleted, we should show a message about that */}
          {organization && organization.deleted && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.deleted.organization"
                  defaultMessage="This organization was deleted {relativeTime} by {name}."
                  values={{
                    name: organization.modifiedBy,
                    relativeTime: <FormattedRelativeDate value={organization.modified}/>
                  }}
                />
              }
              type="error"
            />
          )}

          {!this.state.edit && <Presentation organization={organization}/>}
          <ItemFormWrapper
            title={<FormattedMessage id="organization" defaultMessage="Organization"/>}
            visible={this.state.edit || this.state.isModalVisible}
            mode={organization ? 'edit' : 'create'}
          >
            <Form organization={organization} onSubmit={this.onSubmit} onCancel={this.onCancel}/>
          </ItemFormWrapper>
        </div>
      </React.Fragment>
    );
  }
}

OrganizationDetails.propTypes = {
  uuids: PropTypes.array.isRequired,
  organization: PropTypes.object,
  refresh: PropTypes.func.isRequired
};

export default withRouter(OrganizationDetails);