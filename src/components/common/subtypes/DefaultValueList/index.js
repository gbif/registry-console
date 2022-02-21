import React from 'react';
import PropTypes from 'prop-types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { List, Button, Row, Col, Tooltip } from 'antd';
import { FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';

// Wrappers
import { HasAccess } from '../../../auth';
import withContext from '../../../hoc/withContext';
// Components
import DefaultValueCreateForm from './DefaultValueCreateForm';
import { ConfirmButton, FormattedRelativeDate } from '../../index';

class DefaultValueList extends React.Component {
  state = {
    isModalVisible: false,
    defaultValues: this.props.defaultValues || []
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  deleteValue = item => {
    this.props.deleteValue(item.key).then(() => {
      // Updating default values
      const { defaultValues } = this.state;
      this.setState({
        defaultValues: defaultValues.filter(el => el.key !== item.key)
      });
      this.props.updateCounts('defaultValues', defaultValues.length - 1);
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenDeleted.defaultValue',
          defaultMessage: 'Default value has been deleted'
        })
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  };

  handleSave = form => {
    form.validateFields().then((values) => {
      

      this.props.createValue(values).then(response => {
        form.resetFields();

        const { defaultValues } = this.state;
        defaultValues.unshift({
          ...values,
          key: response.data,
          created: new Date().toISOString(),
          createdBy: this.props.user.userName
        });
        this.props.updateCounts('defaultValues', defaultValues.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.defaultValue',
            defaultMessage: 'Default value has been saved'
          })
        });

        this.setState({
          isModalVisible: false,
          defaultValues
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
    });
  };

  render() {
    const { defaultValues, isModalVisible } = this.state;
    const { intl } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'delete.confirmation.defaultValue',
      defaultMessage: 'Are you sure to delete this default value?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col xs={12} sm={12} md={16}>
              <h2>
                <FormattedMessage id="defaultValues" defaultMessage="Default values" />

                <Tooltip title={
                  <FormattedMessage
                    id="help.orgDefaultValuesInfo"
                    defaultMessage="Where an occurrence in a dataset does not contain a value for a particular term, a default value sets that value at the start of processing.  This is intended to improve data quality, where the publisher is unable to update the dataset in a reasonable time.  The most common use is setting a kingdom."
                  />
                }>
                  <QuestionCircleOutlined />
                </Tooltip>
              </h2>
            </Col>

            <Col xs={12} sm={12} md={8} className="text-right">
              <HasAccess fn={this.props.canCreate}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new" />
                </Button>
              </HasAccess>
            </Col>
          </Row>

          <List
            className="custom-list"
            itemLayout="horizontal"
            dataSource={defaultValues}
            header={
              defaultValues.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}}`}
                values={{ formattedNumber: <FormattedNumber value={defaultValues.length} />, count: defaultValues.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item actions={[
                <HasAccess fn={() => this.props.canDelete(item.key)}>
                  <ConfirmButton
                    title={confirmTitle}
                    btnText={<FormattedMessage id="delete" defaultMessage="Delete" />}
                    onConfirm={() => this.deleteValue(item)}
                    type={'link'}
                  />
                </HasAccess>
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
                        values={{ date: <FormattedRelativeDate value={item.created} />, author: item.createdBy }}
                      />
                    </span>
                  }
                />
              </List.Item>
            )}
          />

          <DefaultValueCreateForm
            visible={isModalVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />
        </div>
      </React.Fragment>
    );
  }
}

DefaultValueList.propTypes = {
  defaultValues: PropTypes.array.isRequired,
  createValue: PropTypes.func,
  deleteValue: PropTypes.func,
  updateCounts: PropTypes.func,
  canCreate: PropTypes.func.isRequired,
  canDelete: PropTypes.func.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(DefaultValueList));