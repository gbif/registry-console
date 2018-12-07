import React from 'react';
import { withRouter } from 'react-router-dom';
import { List, Skeleton, Modal, Button, Spin, Row } from 'antd';
import { FormattedRelative, FormattedMessage } from 'react-intl';

import { createIdentifier, deleteIdentifier, getOrganizationIdentifiers } from '../../../api/organization';
import { prepareData } from '../../../api/util/helpers';
import IdentifierCreateForm from './IdentifierCreateForm';

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

class IdentifierList extends React.Component {
  state = {
    list: [],
    visible: false,
    loading: true
  };

  componentDidMount() {
    // Requesting list of identifiers of Organization
    const { key } = this.props.match.params;
    getOrganizationIdentifiers(key).then(response => {
      this.setState({
        list: response.data,
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

  deleteIdentifier = item => {
    const { key } = this.props.match.params;
    // I have never liked assigning THIS to SELF (((
    const self = this;

    confirm({
      title: <FormattedMessage id="titleDeleteIdentifier" defaultMessage="Do you want to delete this identifier?"/>,
      content: <FormattedMessage id="deleteIdentifierMessage" defaultMessage="Are you really want to delete identifier?"/>,
      onOk() {
        return new Promise((resolve, reject) => {
          deleteIdentifier(key, item.key).then(() => {
            // Updating endpoints list
            const { list } = self.state;
            self.setState({
              list: list.filter(el => el.key !== item.key)
            });
            self.props.update('identifier', list.length - 1);

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

      createIdentifier(key, preparedData).then(response => {
        form.resetFields();

        const list = this.state.list;
        list.unshift({
          ...preparedData,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName
        });
        this.props.update('identifier', list.length);

        this.setState({
          visible: false,
          list
        });
      });
    });
  };

  render() {
    const { list, loading, visible } = this.state;
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
            dataSource={list}
            renderItem={item => (
              <List.Item actions={user ? [
                <Button htmlType="button" onClick={() => this.deleteIdentifier(item)} {...formButton}>
                  <FormattedMessage id="delete" defaultMessage="Delete"/>
                </Button>
              ] : []}>
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={
                      <React.Fragment>
                        {item.identifier}
                        <span style={{ fontSize: '12px', color: 'grey', marginLeft: 10 }}>{item.type}</span>
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
          : null}

        {visible && <IdentifierCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleSave}
        />}
      </React.Fragment>
    );
  }
}

export default withRouter(IdentifierList);