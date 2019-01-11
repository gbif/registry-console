import React from 'react';
import { Row, Col, Switch, Icon, Tooltip, Alert } from 'antd';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { withRouter } from 'react-router-dom';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

// Wrappers
import { HasScope } from '../../auth';
// Components
import Presentation from './Presentation';
import Form from './Form';

const styles = {
  warning: {
    marginTop: '4px',
    color: '#b94a48'
  },
  alert: {
    textAlign: 'center',
    marginBottom: '15px'
  }
};

class InstallationDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: !props.installation
    };
  }

  onCancel = () => {
    if (this.props.installation) {
      this.setState({ edit: false });
    } else {
      this.props.history.push('/installation/search');
    }
  };

  render() {
    const { installation, uuids, refresh, classes } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2>
                <FormattedMessage id="details.installation" defaultMessage="Installation details"/>
                <Tooltip title={
                  <FormattedMessage
                    id="help.orgOverviewInfo"
                    defaultMessage="This information appears on the organization profile, organization pages, search results, and beyond."
                  />
                }>
                  <Icon type="question-circle-o"/>
                </Tooltip>
                {installation && installation.disabled && (
                  <Tooltip title={
                    <FormattedMessage
                      id="help.disabledInst"
                      defaultMessage="This installation is disabled and no auto updates will occur"
                    />
                  }>
                    <Icon type="exclamation-circle" theme="filled" className={classes.warning}/>
                  </Tooltip>
                )}
              </h2>
            </Col>
            <Col span={4} className="text-right">
              <HasScope uuids={uuids}>
                {/* If installation was deleted, it couldn't be edited before restoring */}
                {installation && !installation.deleted && (
                  <Row className="item-btn-panel">
                    <Col>
                      <Switch
                        checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                        unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                        onChange={(val) => this.setState({ edit: val })}
                        checked={this.state.edit}
                      />
                    </Col>
                  </Row>
                )}
              </HasScope>
            </Col>
          </Row>

          {/* If installation was deleted, we should show a message about that */}
          {installation && installation.deleted && (
            <Alert
              className={classes.alert}
              message={
                <FormattedMessage
                  id="important.deleted.installation"
                  defaultMessage="This installation was deleted {relativeTime} by {name}."
                  values={{
                    name: installation.modifiedBy,
                    relativeTime: <FormattedRelative value={installation.modified}/>
                  }}
                />
              }
              type="error"
            />
          )}

          {!this.state.edit && <Presentation installation={installation}/>}
          {this.state.edit && (
            <Form
              installation={installation}
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

InstallationDetails.propTypes = {
  uuids: PropTypes.array.isRequired,
  installation: PropTypes.object,
  refresh: PropTypes.func.isRequired
};

export default withRouter(injectSheet(styles)(InstallationDetails));