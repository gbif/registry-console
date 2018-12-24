import React from 'react';
import { Row, Col, Switch, Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import injectSheet from 'react-jss';

import Presentation from './Presentation';
import Form from './Form';
import PermissionWrapper from '../../hoc/PermissionWrapper';

const styles = {
  icon: {
    color: 'rgba(0,0,0,.45)',
    marginLeft: '5px'
  },
  warning: {
    marginTop: '4px',
    color: '#b94a48'
  }
};

class InstallationDetails extends React.Component {
  state = {
    edit: this.props.installation === null
  };

  onCancel = () => {
    if (this.props.installation) {
      this.setState({ edit: false });
    } else {
      this.props.history.push('/installation/search');
    }
  };

  render() {
    const { installation, uid, refresh, classes } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2>
                <FormattedMessage id="details.installation" defaultMessage="Installation details"/>
                <Tooltip title={
                  <FormattedMessage
                    id="orgOverviewInfo"
                    defaultMessage="This information appears on the organization profile, organization pages, search results, and beyond."
                  />
                }>
                  <Icon type="question-circle-o" className={classes.icon}/>
                </Tooltip>
                {installation.disabled && (
                  <Tooltip title={
                    <FormattedMessage
                      id="warning.disabledInst"
                      defaultMessage="This installation is disabled and no auto updates will occur"
                    />
                  }>
                    <Icon type="exclamation-circle" theme="filled" className={classes.warning}/>
                  </Tooltip>
                )}
              </h2>
            </Col>
            <Col span={4} className="text-right">
              <PermissionWrapper uid={uid} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                {installation && (
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
              </PermissionWrapper>
            </Col>
          </Row>

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

export default withRouter(injectSheet(styles)(InstallationDetails));