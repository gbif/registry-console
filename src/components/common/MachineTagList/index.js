import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col, Icon, Tooltip } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';

// Wrappers
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';
// Components
import MachineTagCreateForm from './MachineTagCreateForm';
import ConfirmDeleteControl from '../../widgets/ConfirmDeleteControl';

class MachineTagList extends React.Component {
  state = {
    visible: false,
    machineTags: this.props.data || []
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
      this.props.addError({ status: error.response.status, statusText: error.response.data });
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
          visible: false,
          machineTags
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
    });
  };

  render() {
    const { machineTags, visible } = this.state;
    const { intl, uid } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.machineTag',
      defaultMessage: 'Are you sure delete this machine tag?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col md={16} sm={12}>
              <h2>
                <FormattedMessage id="machineTags" defaultMessage="Machine tags"/>

                <Tooltip title={
                  <FormattedMessage
                    id="orgMachineTagsInfo"
                    defaultMessage="Machine tags are intended for applications to store information about an entity. A machine tag is essentially a name/value pair, that is categorised in a namespace. The 3 parts may be used as the application sees fit."
                  />
                }>
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </h2>
            </Col>

            <Col md={8} sm={12} className="text-right">
              <PermissionWrapper uid={uid} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>

          <List
            className="custom-list"
            itemLayout="horizontal"
            dataSource={machineTags}
            header={
              machineTags.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{resultCount} {resultCount, plural,
                    zero {results}
                    one {result}
                    other {results}
                  }
                `}
                values={{ resultCount: machineTags.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item actions={[
                <PermissionWrapper uid={uid} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteMachineTag(item)}/>
                </PermissionWrapper>
              ]}>
                <List.Item.Meta
                  title={
                    <React.Fragment>
                      <span className="item-title">{item.name} = {item.value}</span>
                      <span className="item-type">{item.namespace}</span>
                    </React.Fragment>
                  }
                  description={
                    <span className="item-description">
                        <FormattedMessage
                          id="createdByRow"
                          defaultMessage={`Created {date} by {author}`}
                          values={{ date: <FormattedRelative value={item.created}/>, author: item.createdBy }}
                        />
                      </span>
                  }
                />
              </List.Item>
            )}
          />

          <MachineTagCreateForm
            visible={visible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />
        </div>
      </React.Fragment>
    );
  }
}

MachineTagList.propTypes = {
  data: PropTypes.array.isRequired,
  createMachineTag: PropTypes.func,
  deleteMachineTag: PropTypes.func,
  update: PropTypes.func,
  uid: PropTypes.array.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(MachineTagList));