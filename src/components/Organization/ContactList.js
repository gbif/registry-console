import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { List, Skeleton, Modal, Button } from 'antd';
import { FormattedRelative, FormattedMessage } from 'react-intl';

import { deleteContact, getOrganizationContacts } from '../../api/organization';
import ContactCreateForm from './ContactCreateForm';

const confirm = Modal.confirm;
const formButton = {
  type: 'primary',
  ghost: true,
  style: {
    border: 'none',
    padding: 0,
    height: 'auto'
  }
};

class ContactList extends React.Component {
  // constructor(props) {
  //   super(props);
  state = {
    edit: true,
    contacts: [],
    visible: false,
    selectedContact: null
  };

  // }

  componentDidMount() {
    // TODO request here contacts by organization
    const { key } = this.props.match.params;
    getOrganizationContacts(key).then(response => {
      this.setState({
        contacts: response.data
      });
    });
    // TODO request contacts type for creation new contact
  }

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

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  render() {
    const { contacts } = this.state;

    return (
      <React.Fragment>
        <List
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
                      <span style={{ fontSize: '12px', color: 'grey', marginLeft: 10 }}>{item.type}</span>
                    </Fragment>
                  }
                  description={<FormattedRelative value={item.created}/>}
                />
              </Skeleton>
            </List.Item>
          )}
        />
        <ContactCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          data={this.state.selectedContact}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(ContactList);