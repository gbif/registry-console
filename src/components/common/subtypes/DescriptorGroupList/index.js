import React from 'react';
import PropTypes from 'prop-types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { List, Button, Row, Col, Tooltip } from 'antd';
import { FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';

// Wrappers
import { HasAccess } from '../../../auth';
import withWidth, { MEDIUM } from '../../../hoc/Width';
import withContext from '../../../hoc/withContext';
// Components
import DescriptorGroupCreateForm from './DescriptorGroupCreateForm';
import { ConfirmButton, FormattedRelativeDate } from '../../index';

class DescriptorGroupList extends React.Component {
  state = {
    isModalVisible: false,
    descriptorGroups: this.props.descriptorGroups || []
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  deleteDescriptorGroup = item => {
    this.props.deleteDescriptorGroup(item.key).then(() => {
      // Updating machine tags
      const { descriptorGroups } = this.state;
      this.setState({
        descriptorGroups: descriptorGroups.filter(el => el.key !== item.key)
      });
      this.props.updateCounts('descriptorGroups', descriptorGroups.length - 1);
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenDeleted.descriptorGroup',
          defaultMessage: 'Machine tag has been deleted'
        })
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  };

  handleSave = form => {
    form.validateFields().then((values) => {
     

      this.props.createDescriptorGroup(values).then(response => {
        form.resetFields();

        const { descriptorGroups } = this.state;
        descriptorGroups.unshift({
          ...values,
          key: response.data,
          created: new Date().toISOString(),
          createdBy: this.props.user.userName
        });
        this.props.updateCounts('descriptorGroups', descriptorGroups.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.descriptorGroup',
            defaultMessage: 'Machine tag has been saved'
          })
        });

        this.setState({
          isModalVisible: false,
          descriptorGroups
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
    });
  };

  render() {
    const { descriptorGroups, isModalVisible } = this.state;
    const { intl, width } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'delete.confirmation.descriptorGroup',
      defaultMessage: 'Are you sure to delete this machine tag?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col xs={12} sm={12} md={16}>
              <h2>
                <FormattedMessage id="descriptorGroups" defaultMessage="Machine tags"/>

                <Tooltip title={
                  <FormattedMessage
                    id="help.orgDescriptorGroupsInfo"
                    defaultMessage="Machine tags are intended for applications to store information about an entity. A machine tag is essentially a name/value pair, that is categorised in a namespace. The 3 parts may be used as the application sees fit."
                  />
                }>
                  <QuestionCircleOutlined />
                </Tooltip>
              </h2>
            </Col>

            <Col xs={12} sm={12} md={8} className="text-right">
              <HasAccess fn={this.props.canCreate}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </HasAccess>
            </Col>
          </Row>

          <List
            className="custom-list"
            itemLayout="horizontal"
            dataSource={descriptorGroups.results}
            header={
              descriptorGroups.results.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}}`}
                values={{ formattedNumber: <FormattedNumber value={descriptorGroups.length}/>, count: descriptorGroups.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item
                actions={[
                  <HasAccess fn={() => this.props.canDelete(item.key)}>
                    <ConfirmButton
                      title={confirmTitle}
                      btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                      onConfirm={() => this.deleteDescriptorGroup(item)}
                      type={'link'}
                    />
                  </HasAccess>
                ]}
                style={width < MEDIUM ? { flexDirection: 'column' } : {}}
              >
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
                          values={{ date: <FormattedRelativeDate value={item.created}/>, author: item.createdBy }}
                        />
                      </span>
                  }
                />
              </List.Item>
            )}
          />

          <DescriptorGroupCreateForm
            visible={isModalVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />
        </div>
      </React.Fragment>
    );
  }
}

DescriptorGroupList.propTypes = {
  // descriptorGroups: PropTypes.array.isRequired,
  createDescriptorGroup: PropTypes.func,
  deleteDescriptorGroup: PropTypes.func,
  updateCounts: PropTypes.func,
  canCreate: PropTypes.func.isRequired,
  canDelete: PropTypes.func.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(withWidth()(injectIntl(DescriptorGroupList)));