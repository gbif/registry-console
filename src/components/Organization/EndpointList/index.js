import React from 'react';
import { List, Skeleton, Modal, Button, Row } from 'antd';
import { FormattedRelative, FormattedMessage } from 'react-intl';

import { prepareData } from '../../../api/util/helpers';
import EndpointCreateForm from './EndpointCreateForm';

// TODO think about CSSinJS for styles
const formButton = {
  type: 'primary',
  ghost: true,
  style: {
    border: 'none',
    padding: 0,
    height: 'auto',
    boxShadow: 'none'
  }
};

class EndpointList extends React.Component {
  state = {
    endpoints: this.props.data || [],
    visible: false
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  deleteEndpoint = item => {
    // I have never liked assigning THIS to SELF (((
    const self = this;

    Modal.confirm({
      title: <FormattedMessage id="titleDeleteEndpoint" defaultMessage="Do you want to delete this endpoint?"/>,
      content: <FormattedMessage id="deleteEndpointMessage" defaultMessage="Are you really want to delete endpoint?"/>,
      onOk() {
        return new Promise((resolve, reject) => {
          self.props.deleteEndpoint(item.key).then(() => {
            // Updating endpoints list
            const { endpoints } = self.state;
            self.setState({
              endpoints: endpoints.filter(endpoint => endpoint.key !== item.key)
            });
            self.props.update('endpoints', endpoints.length - 1);

            resolve();
          }).catch(reject);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
      }
    });
  };

  handleSave = () => {
    const form = this.formRef.props.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const preparedData = prepareData(values);

      this.props.createEndpoint(preparedData).then(response => {
        form.resetFields();

        const endpoints = this.state.endpoints;
        endpoints.unshift({
          ...preparedData,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName,
          machineTags: []
        });
        this.props.update('endpoints', endpoints.length);

        this.setState({
          visible: false,
          endpoints
        });
      });
    });
  };

  render() {
    const { endpoints, visible } = this.state;
    const user = this.props.user;

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <h1><FormattedMessage id="organizationEndpoints" defaultMessage="Organization endpoints"/></h1>
          {user ?
            <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Button>
            : null}
        </Row>

        <List
          itemLayout="horizontal"
          dataSource={endpoints}
          renderItem={item => (
            <List.Item actions={user ? [
              <Button htmlType="button" onClick={() => this.deleteEndpoint(item)} {...formButton}>
                <FormattedMessage id="delete" defaultMessage="Delete"/>
              </Button>
            ] : []}>
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
                <div style={{ color: '#999' }}>
                  {item.machineTags.length > 0 ?
                    item.machineTags.join(' ') :
                    <FormattedMessage id="noMachineTags" defaultMessage="No machine tags"/>
                  }
                </div>
              </Skeleton>
            </List.Item>
          )}
        />

        {visible && <EndpointCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleSave}
        />}
      </React.Fragment>
    );
  }
}

export default EndpointList;