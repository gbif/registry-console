import React from 'react';
import PropTypes from 'prop-types';
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

  handleDelete = item => {
    const contactName = item.lastName ? `${item.firstName} ${item.lastName}` : item.organization;

    Modal.confirm({
      title: <FormattedMessage id="deleteTitle.contact" defaultMessage="Do you want to delete this contact?"/>,
      content: <FormattedMessage
        id="deleteMessage.contact"
        defaultMessage="Are you really want to delete contact {name}?"
        values={{ name: contactName }}
      />,
      onOk: () => this.deleteContact(item),
      onCancel() {
      }
    });
  };

  deleteContact = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteContact(item.key).then(() => {
        // Updating contacts list
        const { contacts } = this.state;
        this.setState({
          contacts: contacts.filter(contact => contact.key !== item.key)
        });
        this.props.update('contacts', contacts.length - 1);

        resolve();
      }).catch(reject);
    }).catch(() => console.log('Oops errors!'));
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
              <Button htmlType="button" onClick={() => this.handleDelete(item)} {...formButton}>
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

ContactList.propTypes = {
  data: PropTypes.array.isRequired,
  createContact: PropTypes.func.isRequired,
  updateContact: PropTypes.func.isRequired,
  deleteContact: PropTypes.func.isRequired,
  user: PropTypes.object,
  update: PropTypes.func.isRequired
};

export default ContactList;