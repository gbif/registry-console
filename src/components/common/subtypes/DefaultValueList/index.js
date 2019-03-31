import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';

// Wrappers
import { HasScope } from '../../../auth';
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
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

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
    const { intl, uuids } = this.props;
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
                <FormattedMessage id="defaultValues" defaultMessage="Default values"/>

                <Tooltip title={
                  <FormattedMessage
                    id="help.orgDefaultValuesInfo"
                    defaultMessage="Default values are intended for applications to store information about an entity. A default value is essentially a name/value pair, that is categorised in a namespace 'default-term.gbif.org'. The 2 parts may be used as the application sees fit."
                  />
                }>
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </h2>
            </Col>

            <Col xs={12} sm={12} md={8} className="text-right">
              <HasScope uuids={uuids}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </HasScope>
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
                values={{ formattedNumber: <FormattedNumber value={defaultValues.length}/>, count: defaultValues.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item actions={[
                <HasScope uuids={uuids}>
                  <ConfirmButton
                    title={confirmTitle}
                    btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                    onConfirm={() => this.deleteValue(item)}
                    type={'link'}
                  />
                </HasScope>
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
                          values={{ date: <FormattedRelativeDate value={item.created}/>, author: item.createdBy }}
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
  uuids: PropTypes.array.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(DefaultValueList));