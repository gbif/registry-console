import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';

import EndpointCreateForm from './EndpointCreateForm';
import EndpointPresentation from './EndpointPresentation';
import { ConfirmDeleteControl } from '../../widgets';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';

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
      this.addSuccess({
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
          created: new Date(),
          createdBy: this.props.user.userName,
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
    const { intl, uuids } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.endpoint',
      defaultMessage: 'Are you sure delete this endpoint?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col md={16} sm={12}>
              <h2><FormattedMessage id="endpoints" defaultMessage="Endpoints"/></h2>
            </Col>
            <Col md={8} sm={12} className="text-right">
              <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>

          <List
            className="custom-list"
            itemLayout="horizontal"
            dataSource={endpoints}
            header={
              endpoints.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{resultCount} {resultCount, plural,
                    zero {results}
                    one {result}
                    other {results}
                  }
                `}
                values={{ resultCount: <FormattedNumber value={endpoints.length}/> }}
              />) : null
            }
            renderItem={item => (
              <List.Item actions={[
                <Button
                  htmlType="button"
                  onClick={() => this.showDetails(item)}
                  className="btn-link"
                  type="primary"
                  ghost={true}
                >
                  <FormattedMessage id="view" defaultMessage="View"/>
                </Button>,
                <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteEndpoint(item)}/>
                </PermissionWrapper>
              ]}>
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
                        values={{ date: <FormattedRelative value={item.created}/>, author: item.createdBy }}
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
  uuids: PropTypes.array.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(EndpointList));