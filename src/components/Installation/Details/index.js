import React from 'react';
import { Row, Col, Switch, Icon, Tooltip, Alert } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

// Wrappers
import { HasAccess } from '../../auth';
import ItemFormWrapper from '../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';
import FormattedRelativeDate from '../../common/FormattedRelativeDate';
// APIs
import { canUpdate } from '../../../api/permissions';

class InstallationDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: !props.installation,
      isModalVisible: false
    };
  }

  onCancel = () => {
    if (this.props.installation) {
      this.setState({ isModalVisible: false });
    } else {
      this.props.history.push('/installation/search');
    }
  };

  onSubmit = key => {
    this.setState({ edit: false, isModalVisible: false });
    this.props.refresh(key);
  };

  toggleEditState = val => {
    if (this.props.installation) {
      this.setState({ isModalVisible: val });
    } else {
      this.setState({ edit: false });
    }
  };

  render() {
    const { installation } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2>
                <FormattedMessage id="details.installation" defaultMessage="Installation details" />
                <Tooltip title={
                  <FormattedMessage
                    id="help.orgOverviewInfo"
                    defaultMessage="This information appears on the organization profile, organization pages, search results, and beyond."
                  />
                }>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </h2>
            </Col>
            <Col span={4} className="text-right">
              {/* If installation was deleted, it couldn't be edited before restoring */}
              {installation && !installation.deleted && (
                <HasAccess fn={() => canUpdate('installation', installation.key)}>
                  <Row className="item-btn-panel">
                    <Col>
                      <Switch
                        checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit" />}
                        unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit" />}
                        onChange={this.toggleEditState}
                        checked={this.state.edit || this.state.isModalVisible}
                      />
                    </Col>
                  </Row>
                </HasAccess>
              )}
            </Col>
          </Row>

          {/* If installation was deleted, we should show a message about that */}
          {installation && installation.deleted && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.deleted.installation"
                  defaultMessage="This installation was deleted {relativeTime} by {name}."
                  values={{
                    name: installation.modifiedBy,
                    relativeTime: <FormattedRelativeDate value={installation.modified} />
                  }}
                />
              }
              type="error"
            />
          )}

          {/* If installation was deleted, we should show a message about that */}
          {installation && installation.disabled && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.disabled.installation"
                  defaultMessage="This installation is disabled and no auto updates will occur"
                />
              }
              type="warning"
            />
          )}

          {!this.state.edit && <Presentation installation={installation} />}
          <ItemFormWrapper
            title={<FormattedMessage id="installation" defaultMessage="Installation" />}
            visible={this.state.edit || this.state.isModalVisible}
            mode={installation ? 'edit' : 'create'}
          >
            <Form installation={installation} onSubmit={this.onSubmit} onCancel={this.onCancel} />
          </ItemFormWrapper>
        </div>
      </React.Fragment>
    );
  }
}

InstallationDetails.propTypes = {
  installation: PropTypes.object,
  refresh: PropTypes.func.isRequired
};

export default withRouter(InstallationDetails);