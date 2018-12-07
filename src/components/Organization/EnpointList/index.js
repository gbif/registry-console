import React from 'react';
import { withRouter } from 'react-router-dom';
import { List, Skeleton, Modal, Button, Spin, Row } from 'antd';
import { FormattedRelative, FormattedMessage } from 'react-intl';

import { createEndpoint, deleteEndpoint, getOrganizationEndpoints } from '../../../api/organization';
import { prepareData } from '../../../api/util/helpers';
import EndpointCreateForm from './EndpointCreateForm';

const confirm = Modal.confirm;
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
    endpoints: [],
    visible: false,
    loading: true
  };

  componentDidMount() {
    // Requesting list of endpoints of Organization
    const { key } = this.props.match.params;
    getOrganizationEndpoints(key).then(response => {
      this.setState({
        endpoints: response.data,
        loading: false
      });
    });
  }

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
    const { key } = this.props.match.params;
    // I have never liked assigning THIS to SELF (((
    const self = this;

    confirm({
      title: <FormattedMessage id="titleDeleteEndpoint" defaultMessage="Do you want to delete this endpoint?"/>,
      content: <FormattedMessage id="deleteEndpointMessage" defaultMessage="Are you really want to delete endpoint?"/>,
      onOk() {
        return new Promise((resolve, reject) => {
          deleteEndpoint(key, item.key).then(() => {
            // Updating endpoints list
            const { endpoints } = self.state;
            self.setState({
              endpoints: endpoints.filter(endpoint => endpoint.key !== item.key)
            });

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

      const { key } = this.props.match.params;
      const preparedData = prepareData(values);

      createEndpoint(key, preparedData).then(response => {
        form.resetFields();

        const endpoints = this.state.endpoints;
        endpoints.push({
          ...preparedData,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName,
          machineTags: []
        });

        this.setState({
          visible: false,
          endpoints
        });
      });
    });
  };

  render() {
    const { endpoints, loading, visible } = this.state;
    const user = this.props.user;

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <h1><FormattedMessage id="organizationEndpoints" defaultMessage="Organization endpoints"/></h1>
          {!loading && user ?
            <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Button>
            : null}
        </Row>

        {loading && <Spin size="large"/>}

        {!loading ?
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
                        <a href={item.url} target="_blank">{item.url}</a>
                        <span style={{ fontSize: '12px', color: 'grey', marginLeft: 10 }}>{item.type}</span>
                        <div>{item.description}</div>
                        <div>
                          {item.machineTags.length > 0 ?
                            item.machineTags.join(' ') :
                            <FormattedMessage id="noMachineTags" defaultMessage="No machine tags"/>
                          }
                        </div>
                      </React.Fragment>
                    }
                    description={<FormattedRelative value={item.created}/>}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
          : null}

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

export default withRouter(EndpointList);