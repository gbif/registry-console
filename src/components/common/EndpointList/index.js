import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';

import { prepareData } from '../../helpers';
import EndpointCreateForm from './EndpointCreateForm';
import EndpointPresentation from './EndpointPresentation';
import { ConfirmDeleteControl } from '../../widgets';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';

class EndpointList extends React.Component {
  state = {
    editVisible: false,
    detailsVisible: false,
    selectedItem: null,
    endpoints: this.props.data
  };

  showModal = () => {
    this.setState({ editVisible: true });
  };

  showDetails = item => {
    this.setState({
      selectedItem: item,
      detailsVisible: true
    });
  };

  handleCancel = () => {
    this.setState({
      editVisible: false,
      detailsVisible: false,
      selectedItem: null
    });
  };

  deleteEndpoint = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteEndpoint(item.key).then(() => {
        // Updating endpoints list
        const { endpoints } = this.state;
        this.setState({
          endpoints: endpoints.filter(endpoint => endpoint.key !== item.key)
        });
        this.props.update('endpoints', endpoints.length - 1);
        this.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenDeleted.endpoint',
            defaultMessage: 'Endpoint has been deleted'
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

      const preparedData = prepareData(values);

      this.props.createEndpoint(preparedData).then(response => {
        form.resetFields();

        const { endpoints } = this.state;
        endpoints.unshift({
          ...preparedData,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName,
          machineTags: []
        });
        this.props.update('endpoints', endpoints.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.endpoint',
            defaultMessage: 'Endpoint has been saved'
          })
        });

        this.setState({
          editVisible: false,
          endpoints
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data })
      });
    });
  };

  render() {
    const { endpoints, editVisible, detailsVisible, selectedItem } = this.state;
    const { intl, uid } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.endpoint',
      defaultMessage: 'Are you sure delete this endpoint?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="endpoints" defaultMessage="Endpoints"/></h2>
            </Col>
            <Col span={4}>
              <PermissionWrapper uid={uid} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>

          <List
            itemLayout="horizontal"
            dataSource={endpoints}
            renderItem={item => (
              <List.Item actions={[
                <Button htmlType="button" onClick={() => this.showDetails(item)} className="btn-link" type="primary"
                        ghost={true}>
                  <FormattedMessage id="view" defaultMessage="View"/>
                </Button>,
                <PermissionWrapper uid={uid} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteEndpoint(item)}/>
                </PermissionWrapper>
              ]}>
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={
                      <React.Fragment>
                        <strong className="item-title">{item.url}</strong>
                        <span className="item-type">{item.type}</span>
                        <div>{item.description}</div>
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
                  <div className="help">
                    {item.machineTags.length > 0 ?
                      item.machineTags.join(' ') :
                      <FormattedMessage id="noMachineTags" defaultMessage="No machine tags"/>
                    }
                  </div>
                </Skeleton>
              </List.Item>
            )}
          />

          {editVisible && <EndpointCreateForm
            visible={editVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />}

          {detailsVisible && <EndpointPresentation
            visible={detailsVisible}
            onCancel={this.handleCancel}
            data={selectedItem}
          />}
        </div>
      </React.Fragment>
    );
  }
}

EndpointList.propTypes = {
  data: PropTypes.array.isRequired,
  createEndpoint: PropTypes.func,
  deleteEndpoint: PropTypes.func,
  update: PropTypes.func,
  uid: PropTypes.array.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(EndpointList));