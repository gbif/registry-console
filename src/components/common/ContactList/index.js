import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';

import ContactDetails from './Details';
import { ConfirmDeleteControl } from '../../widgets';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';

class ContactList extends React.Component {
  state = {
    visible: false,
    selectedContact: null,
    contacts: this.props.data || []
  };

  showModal = contact => {
    this.setState({
      selectedContact: contact,
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      selectedContact: null
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
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenDeleted.contact',
            defaultMessage: 'Contact has been deleted'
          })
        });

        resolve();
      }).catch(reject);
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  };

  handleSave = form => {
    // In the case if user closed a dialog in read-only mode
    if (!form) {
      this.setState({
        visible: false,
        selectedContact: null
      });
    }

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      let request;

      if (this.state.selectedContact) {
        request = this.props.updateContact({ ...this.state.selectedContact, ...values });
      } else {
        request = this.props.createContact(values);
      }

      request.then(response => {
        form.resetFields();

        const { contacts, selectedContact } = this.state;
        if (!selectedContact) {
          contacts.unshift({
            ...values,
            key: response.data,
            created: new Date(),
            createdBy: this.props.user.userName,
            modified: new Date(),
            modifiedBy: this.props.user.userName
          });
        } else {
          const index = contacts.findIndex(contact => contact.key === selectedContact.key);
          if (index !== -1) {
            contacts[index] = { ...selectedContact, ...values };
          }
        }

        this.props.update('contacts', contacts.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.contact',
            defaultMessage: 'Contact has been saved'
          })
        });

        this.setState({
          visible: false,
          selectedContact: null,
          contacts
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
    });
  };

  render() {
    const { contacts, visible, selectedContact } = this.state;
    const { intl, uid } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.contact',
      defaultMessage: 'Are you sure delete this contact?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="contacts" defaultMessage="Contacts"/></h2>
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
            className="custom-list"
            itemLayout="horizontal"
            dataSource={contacts}
            header={
              contacts.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{resultCount} {resultCount, plural,
                    zero {results}
                    one {result}
                    other {results}
                  }
                `}
                values={{ resultCount: contacts.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item actions={[
                <Button
                  htmlType="button"
                  onClick={() => this.showModal(item)}
                  className="btn-link"
                  type="primary"
                  ghost={true}
                >
                  <FormattedMessage id="view" defaultMessage="View"/>
                </Button>,
                <PermissionWrapper uid={uid} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteContact(item)}/>
                </PermissionWrapper>
              ]}>
                <List.Item.Meta
                  title={
                    <React.Fragment>
                      {item.lastName ?
                        <span className="item-title">{item.firstName} {item.lastName}</span> :
                        (item.organization ? <span className="item-title">{item.organization}</span> : null)
                      }
                      {item.type && (
                        <span className="item-type">
                          <FormattedMessage id={item.type}/>
                        </span>
                      )}
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

          {visible && (
            <ContactDetails
              uid={uid}
              visible={visible}
              onCancel={this.handleCancel}
              data={selectedContact}
              onCreate={this.handleSave}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

ContactList.propTypes = {
  data: PropTypes.array.isRequired,
  createContact: PropTypes.func,
  updateContact: PropTypes.func,
  deleteContact: PropTypes.func,
  update: PropTypes.func,
  uid: PropTypes.array.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(ContactList));