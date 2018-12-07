import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { List, Skeleton, Modal, Button, Spin } from 'antd';
import { FormattedRelative, FormattedMessage } from 'react-intl';

import { deleteContact, getOrganizationContacts, updateContact } from '../../api/organization';
import ContactCreateForm from './ContactCreateForm';
import { prepareData } from '../../api/util/helpers';
import { prettifyUserType } from '../../api/util/prettifiers';

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

class ContactList extends React.Component {
  state = {
    edit: true, // TODO add check on tole
    contacts: [],
    visible: false,
    selectedContact: null,
    loading: true
  };

  componentDidMount() {
    this.getContacts();
  }

  getContacts = () => {
    const { key } = this.props.match.params;
    getOrganizationContacts(key).then(response => {
      this.setState({
        contacts: response.data,
        loading: false
      });
    });
  };

  showModal = contact => {
    this.setState({
      selectedContact: contact,
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  deleteContact = item => {
    const contactName = item.lastName ? `${item.firstName} ${item.lastName}` : item.organization;
    const { key } = this.props.match.params;
    // I have never liked assigning THIS to SELF (((
    const self = this;

    confirm({
      title: <FormattedMessage id="titleDeleteContact" defaultMessage="Do you want to delete these contact?"/>,
      content: `Are you really want to delete contact ${contactName}`,
      onOk() {
        return new Promise((resolve, reject) => {
          deleteContact(key, item.key).then(() => {
            // Re-requesting contacts
            self.getContacts();
            resolve();
          }).catch(reject);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
      }
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  handleCreate = () => {
    const form = this.formRef.props.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { key } = this.props.match.params;
      const preparedData = prepareData(values);

      updateContact(key, { ...this.state.selectedContact, ...preparedData }).then(() => {
        form.resetFields();

        this.setState({
          visible: false,
          selectedContact: null,
          contacts: [],
          loading: true
        });
        // Re-requesting contacts
        this.getContacts();
      });
    });
  };

  render() {
    const { contacts, loading } = this.state;

    return (
      <React.Fragment>
        {loading && <Spin size="large"/>}
        {!loading && <List
          itemLayout="horizontal"
          dataSource={contacts}
          renderItem={item => (
            <List.Item actions={[
              <Button htmlType="button" onClick={() => this.showModal(item)} {...formButton}>
                <FormattedMessage id="edit" defaultMessage="Edit"/>
              </Button>,
              <Button htmlType="button" onClick={() => this.deleteContact(item)} {...formButton}>
                <FormattedMessage id="delete" defaultMessage="Delete"/>
              </Button>
            ]}>
              <Skeleton title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={
                    <Fragment>
                      {item.lastName ? `${item.firstName} ${item.lastName}` : item.organization}
                      <span style={{ fontSize: '12px', color: 'grey', marginLeft: 10 }}>{prettifyUserType(item.type)}</span>
                    </Fragment>
                  }
                  description={<FormattedRelative value={item.created}/>}
                />
              </Skeleton>
            </List.Item>
          )}
        />}
        <ContactCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          data={this.state.selectedContact}
          onCreate={this.handleCreate}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(ContactList);