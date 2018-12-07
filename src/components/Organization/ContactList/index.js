import React from 'react';
import { withRouter } from 'react-router-dom';
import { List, Skeleton, Modal, Button, Spin, Row } from 'antd';
import { FormattedRelative, FormattedMessage } from 'react-intl';

import { getOrganizationContacts, updateContact, deleteContact, createContact } from '../../../api/organization';
import ContactCreateForm from './ContactCreateForm';
import { prepareData } from '../../../api/util/helpers';
import { prettifyUserType } from '../../../api/util/prettifiers';

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
    contacts: [],
    visible: false,
    selectedContact: null,
    loading: true
  };

  componentDidMount() {
    // Requesting list of contacts of Organization
    const { key } = this.props.match.params;
    getOrganizationContacts(key).then(response => {
      this.setState({
        contacts: response.data,
        loading: false
      });
    });
  }

  showModal = contact => {
    this.setState({
      selectedContact: contact,
      visible: true
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      selectedContact: null
    });
  };

  deleteContact = item => {
    const contactName = item.lastName ? `${item.firstName} ${item.lastName}` : item.organization;
    const { key } = this.props.match.params;
    // I have never liked assigning THIS to SELF (((
    const self = this;

    confirm({
      title: <FormattedMessage id="titleDeleteContact" defaultMessage="Do you want to delete this contact?"/>,
      content: `Are you really want to delete contact ${contactName}?`,
      onOk() {
        return new Promise((resolve, reject) => {
          deleteContact(key, item.key).then(() => {
            // Updating contacts list
            const { contacts } = self.state;
            self.setState({
              contacts: contacts.filter(contact => contact.key !== item.key)
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
      let request;

      if (this.state.selectedContact) {
        request = updateContact(key, { ...this.state.selectedContact, ...preparedData });
      } else {
        request = createContact(key, preparedData);
      }

      request.then(response => {
        form.resetFields();

        const { contacts, selectedContact } = this.state;
        if (!selectedContact) {
          contacts.unshift({
            ...preparedData,
            key: response.data,
            created: new Date(),
            createdBy: this.props.user.userName,
            modified: new Date(),
            modifiedBy: this.props.user.userName
          });
        } else {
          contacts.filter(contact => contact.key === selectedContact.key)[0] = { ...selectedContact, ...preparedData };
        }

        this.setState({
          visible: false,
          selectedContact: null,
          contacts
        });
      });
    });
  };

  render() {
    const { contacts, loading, visible, selectedContact } = this.state;
    const user = this.props.user;

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <h1><FormattedMessage id="organizationContacts" defaultMessage="Organization contacts"/></h1>
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
            dataSource={contacts}
            renderItem={item => (
              <List.Item actions={user ? [
                <Button htmlType="button" onClick={() => this.showModal(item)} {...formButton}>
                  <FormattedMessage id="edit" defaultMessage="Edit"/>
                </Button>,
                <Button htmlType="button" onClick={() => this.deleteContact(item)} {...formButton}>
                  <FormattedMessage id="delete" defaultMessage="Delete"/>
                </Button>
              ] : []}>
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={
                      <React.Fragment>
                        {item.lastName ? `${item.firstName} ${item.lastName}` : item.organization}
                        <span style={{ fontSize: '12px', color: 'grey', marginLeft: 10 }}>
                          {prettifyUserType(item.type)}
                        </span>
                      </React.Fragment>
                    }
                    description={<FormattedRelative value={item.created}/>}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
          : null}

        {visible && <ContactCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          data={selectedContact}
          onCreate={this.handleSave}
        />}
      </React.Fragment>
    );
  }
}

export default withRouter(ContactList);