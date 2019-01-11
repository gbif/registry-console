import React from 'react';
import { Alert, Col, Icon, Row, Switch, Tooltip } from 'antd';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

// Wrappers
import { HasScope } from '../../auth';
// Components
import Presentation from './Presentation';
import Form from './Form';

const styles = {
  alert: {
    textAlign: 'center',
    marginBottom: '15px'
  }
};

class OrganizationDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: !props.organization
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
    const { organization, refresh, uuids, classes } = this.props;

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
                      onChange={(val) => this.setState({ edit: val })}
                      checked={this.state.edit}
                    />}
                  </div>
                )}
              </HasScope>
            </Col>
          </Row>

          {/* If organization was deleted, we should show a message about that */}
          {organization && organization.deleted && (
            <Alert
              className={classes.alert}
              message={
                <FormattedMessage
                  id="important.deleted.organization"
                  defaultMessage="This organization was deleted {relativeTime} by {name}."
                  values={{
                    name: organization.modifiedBy,
                    relativeTime: <FormattedRelative value={organization.modified}/>
                  }}
                />
              }
              type="error"
            />
          )}

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

OrganizationDetails.propTypes = {
  uuids: PropTypes.array.isRequired,
  organization: PropTypes.object,
  refresh: PropTypes.func.isRequired
};

export default withRouter(injectSheet(styles)(OrganizationDetails));