import React from 'react';
import { Row, Col, Switch, Button, Popconfirm } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';

import { syncInstallation } from '../../../api/installation';
import Presentation from './Presentation';
import Form from './Form';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';

class InstallationDetails extends React.Component {
  constructor(props) {
    super(props);

    const { installation, syncInstallationTypes } = props;

    this.state = {
      edit: installation === null,
      canBeSynchronized: installation && syncInstallationTypes && syncInstallationTypes.includes(installation.type)
    };
  }

  synchronize = key => {
    syncInstallation(key)
      .then(() => {
        this.props.addInfo({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'info.synchronizing',
            defaultMessage: 'Installation synchronizing'
          })
        });
      })
      .catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
  };

  onCancel = () => {
    if (this.props.dataset) {
      this.setState({ edit: false });
    } else {
      this.props.history.push('/dataset/search');
    }
  };

  render() {
    const { installation, refresh, intl } = this.props;
    const message = intl.formatMessage({
      id: 'installation.sync.message',
      defaultMessage: 'This will trigger a synchronization of the installation.'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <span className="help"><FormattedMessage id="installation" defaultMessage="Installation"/></span>
          <h2>
            {installation ? installation.title :
              <FormattedMessage id="newInstallation" defaultMessage="New installation"/>}
          </h2>

          <PermissionWrapper item={installation} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
            {installation && (
              <Row className="item-btn-panel">
                <Col span={18}>
                  <Switch
                    checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    onChange={(val) => this.setState({ edit: val })}
                    checked={this.state.edit}
                  />
                </Col>
                <Col span={6} className="text-right">
                  {!this.state.edit && this.state.canBeSynchronized && (
                    <Popconfirm
                      placement="topRight"
                      title={message}
                      onConfirm={() => this.synchronize(installation.key)}
                      okText={<FormattedMessage id="synchronize" defaultMessage="Synchronize"/>}
                      cancelText={<FormattedMessage id="no" defaultMessage="No"/>}
                    >
                      <Button type="primary" htmlType="button">
                        <FormattedMessage id="synchronizeNow" defaultMessage="Synchronize now"/>
                      </Button>
                    </Popconfirm>
                  )}
                </Col>
              </Row>
            )}
          </PermissionWrapper>
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

const mapContextToProps = ({ addError, addInfo, syncInstallationTypes }) => ({
  addError,
  addInfo,
  syncInstallationTypes
});

export default withContext(mapContextToProps)(injectIntl(withRouter(InstallationDetails)));