import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';

import MachineTagCreateForm from './MachineTagCreateForm';
import ConfirmDeleteControl from '../../widgets/ConfirmDeleteControl';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';

class MachineTagList extends React.Component {
  state = {
    visible: false,
    item: this.props.data,
    machineTags: this.props.data.machineTags
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  deleteMachineTag = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteMachineTag(item.key).then(() => {
        // Updating machine tags
        const { machineTags } = this.state;
        this.setState({
          machineTags: machineTags.filter(el => el.key !== item.key)
        });
        this.props.update('machineTags', machineTags.length - 1);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenDeleted.machineTag',
            defaultMessage: 'Machine tag has been deleted'
          })
        });

        resolve();
      }).catch(reject);
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data })
    });
  };

  handleSave = form => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.props.createMachineTag(values).then(response => {
        form.resetFields();

        const { machineTags } = this.state;
        machineTags.unshift({
          ...values,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName
        });
        this.props.update('machineTags', machineTags.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.machineTag',
            defaultMessage: 'Machine tag has been saved'
          })
        });

        this.setState({
          editVisible: false,
          machineTags
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data })
      });
    });
  };

  render() {
    const { machineTags, item, visible } = this.state;
    const { intl } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.machineTag',
      defaultMessage: 'Are you sure delete this machine tag?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="machineTags" defaultMessage="Machine tags"/></h2>
            </Col>

            <Col span={4}>
              <PermissionWrapper item={item} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>
          <p className="help">
            <FormattedMessage
              id="orgMachineTagsInfo"
              defaultMessage="Machine tags are intended for applications to store information about an entity. A machine tag is essentially a name/value pair, that is categorised in a namespace. The 3 parts may be used as the application sees fit."
            />
          </p>

          <List
            itemLayout="horizontal"
            dataSource={machineTags}
            renderItem={item => (
              <List.Item actions={[
                <PermissionWrapper item={item} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteMachineTag(item)}/>
                </PermissionWrapper>
              ]}>
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={
                      <React.Fragment>
                        <strong className="item-title">{item.name}</strong> = <strong
                        className="item-title">{item.value}</strong>
                        <div className="item-type" style={{ marginLeft: 0 }}>{item.namespace}</div>
                      </React.Fragment>
                    }
                    description={
                      <React.Fragment>
                        <FormattedMessage
                          id="createdByRow"
                          defaultMessage={`Created {date} by {author}`}
                          values={{ date: <FormattedRelative value={item.created}/>, author: item.createdBy }}
                        />
                      </React.Fragment>
                    }
                  />
                </Skeleton>
              </List.Item>
            )}
          />

          {visible && <MachineTagCreateForm
            visible={visible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />}
        </div>
      </React.Fragment>
    );
  }
}

MachineTagList.propTypes = {
  data: PropTypes.object.isRequired,
  createMachineTag: PropTypes.func.isRequired,
  deleteMachineTag: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(MachineTagList));