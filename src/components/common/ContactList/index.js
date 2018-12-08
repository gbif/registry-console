import React from 'react';
import { List, Skeleton, Modal, Button, Row } from 'antd';
import { FormattedRelative, FormattedMessage } from 'react-intl';

import ContactCreateForm from './ContactCreateForm';
import { prepareData } from '../../../api/util/helpers';
import { prettifyUserType } from '../../../api/util/prettifiers';

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
    contacts: this.props.data || [],
    visible: false,
    selectedContact: null
  };

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
    // I have never liked assigning THIS to SELF (((
    const self = this;

    Modal.confirm({
      title: <FormattedMessage id="titleDeleteContact" defaultMessage="Do you want to delete this contact?"/>,
      content: `Are you really want to delete contact ${contactName}?`,
      onOk() {
        return new Promise((resolve, reject) => {
          self.props.deleteContact(item.key).then(() => {
            // Updating contacts list
            const { contacts } = self.state;
            self.setState({
              contacts: contacts.filter(contact => contact.key !== item.key)
            });
            self.props.update('contacts', contacts.length - 1);

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
      let request;

      if (this.state.selectedContact) {
        request = this.props.updateContact({ ...this.state.selectedContact, ...preparedData });
      } else {
        request = this.props.createContact(preparedData);
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
          const index = contacts.findIndex(contact => contact.key === selectedContact.key);
          if (index !== -1) {
            contacts[index] = { ...selectedContact, ...preparedData };
          }
        }

        this.props.update('contacts', contacts.length);

        this.setState({
          visible: false,
          selectedContact: null,
          contacts
        });
      });
    });
  };

  render() {
    const { contacts, visible, selectedContact } = this.state;
    const user = this.props.user;

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <h1><FormattedMessage id="organizationContacts" defaultMessage="Organization contacts"/></h1>
          {user ?
            <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Button>
            : null}
        </Row>

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

export default ContactList;