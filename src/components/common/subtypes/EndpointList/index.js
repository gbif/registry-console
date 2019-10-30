import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col } from 'antd';
import { FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';

// Wrappers
import { HasPermission } from '../../../auth';
import withWidth, { MEDIUM } from '../../../hoc/Width';
import withContext from '../../../hoc/withContext';
// Components
import EndpointCreateForm from './EndpointCreateForm';
import EndpointPresentation from './EndpointPresentation';
import { ConfirmButton, FormattedRelativeDate } from '../../index';

class EndpointList extends React.Component {
  state = {
    isEditModalVisible: false,
    isViewModalVisible: false,
    selectedEndpoint: null,
    endpoints: this.props.endpoints || []
  };

  showModal = () => {
    this.setState({ isEditModalVisible: true });
  };

  showDetails = endpoint => {
    this.setState({
      selectedEndpoint: endpoint,
      isViewModalVisible: true
    });
  };

  handleCancel = () => {
    this.setState({
      isEditModalVisible: false,
      isViewModalVisible: false,
      selectedEndpoint: null
    });
  };

  deleteEndpoint = item => {
    this.props.deleteEndpoint(item.key).then(() => {
      // Updating endpoints list
      const { endpoints } = this.state;
      this.setState({
        endpoints: endpoints.filter(endpoint => endpoint.key !== item.key)
      });
      this.props.updateCounts('endpoints', endpoints.length - 1);
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenDeleted.endpoint',
          defaultMessage: 'Endpoint has been deleted'
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

      this.props.createEndpoint(values).then(response => {
        form.resetFields();

        const { endpoints } = this.state;
        endpoints.unshift({
          ...values,
          key: response.data,
          created: new Date().toISOString(),
          createdBy: this.props.user.userName,
          modified: new Date().toISOString(),
          modifiedBy: this.props.user.userName,
          machineTags: []
        });
        this.props.updateCounts('endpoints', endpoints.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.endpoint',
            defaultMessage: 'Endpoint has been saved'
          })
        });

        this.setState({
          isEditModalVisible: false,
          endpoints
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
    });
  };

  render() {
    const { endpoints, isEditModalVisible, isViewModalVisible, selectedEndpoint } = this.state;
    const { intl, permissions, width } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'delete.confirmation.endpoint',
      defaultMessage: 'Are you sure to delete this endpoint?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col xs={12} sm={12} md={16}>
              <h2><FormattedMessage id="endpoints" defaultMessage="Endpoints"/></h2>
            </Col>
            <Col xs={12} sm={12} md={8} className="text-right">
              <HasPermission permissions={permissions}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </HasPermission>
            </Col>
          </Row>

          <List
            className="custom-list"
            itemLayout="horizontal"
            dataSource={endpoints}
            header={
              endpoints.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}}`}
                values={{ formattedNumber: <FormattedNumber value={endpoints.length}/>, count: endpoints.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item
                actions={[
                  <Button
                    htmlType="button"
                    onClick={() => this.showDetails(item)}
                    className="btn-link"
                    type="primary"
                    ghost={true}
                  >
                    <FormattedMessage id="view" defaultMessage="View"/>
                  </Button>,
                  <HasPermission permissions={permissions}>
                    <ConfirmButton
                      title={confirmTitle}
                      btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                      onConfirm={() => this.deleteEndpoint(item)}
                      type={'link'}
                    />
                  </HasPermission>
                ]}
                style={width < MEDIUM ? { flexDirection: 'column' } : {}}
              >
                <List.Item.Meta
                  title={
                    <React.Fragment>
                      <span className="item-title preview" onClick={() => this.showDetails(item)}>{item.url}</span>
                      <span className="item-type">{item.type}</span>
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

          <EndpointCreateForm
            visible={isEditModalVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />

          <EndpointPresentation
            visible={isViewModalVisible}
            onCancel={this.handleCancel}
            endpoint={selectedEndpoint}
          />
        </div>
      </React.Fragment>
    );
  }
}

EndpointList.propTypes = {
  endpoints: PropTypes.array,
  createEndpoint: PropTypes.func,
  deleteEndpoint: PropTypes.func,
  updateCounts: PropTypes.func,
  permissions: PropTypes.array.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(withWidth()(injectIntl(EndpointList)));