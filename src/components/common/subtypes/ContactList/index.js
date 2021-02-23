import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col } from 'antd';
import { FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';

// Wrappers
import { HasAccess } from '../../../auth';
import withWidth, { MEDIUM } from '../../../hoc/Width';
import withContext from '../../../hoc/withContext';
// Components
import ContactDetails from './Details';
import { ConfirmButton, FormattedRelativeDate } from '../../index';

class ContactList extends React.Component {
  state = {
    isModalVisible: false,
    selectedContact: null,
    contacts: this.props.contacts || []
  };

  showModal = contact => {
    this.setState({
      selectedContact: contact,
      isModalVisible: true
    });
  };

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
      selectedContact: null
    });
  };

  deleteContact = item => {
    this.props.deleteContact(item.key).then(() => {
      // Updating contacts list
      const { contacts } = this.state;
      this.setState({
        contacts: contacts.filter(contact => contact.key !== item.key)
      });
      this.props.updateCounts('contacts', contacts.length - 1);
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenDeleted.contact',
          defaultMessage: 'Contact has been deleted'
        })
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  };

  handleSave = form => {
    // In the case if user closed a dialog in read-only mode
    if (!form) {
      this.setState({
        isModalVisible: false,
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
            created: new Date().toISOString(),
            createdBy: this.props.user.userName,
            modified: new Date().toISOString(),
            modifiedBy: this.props.user.userName
          });
        } else {
          const index = contacts.findIndex(contact => contact.key === selectedContact.key);
          if (index !== -1) {
            contacts[index] = { ...selectedContact, ...values };
          }
        }

        this.props.updateCounts('contacts', contacts.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.contact',
            defaultMessage: 'Contact has been saved'
          })
        });

        this.setState({
          isModalVisible: false,
          selectedContact: null,
          contacts
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
    });
  };

  render() {
    const { contacts, isModalVisible, selectedContact } = this.state;
    const { intl, createContact, width } = this.props;
    const canModify = typeof createContact === 'function';
    const confirmTitle = intl.formatMessage({
      id: 'delete.confirmation.contact',
      defaultMessage: 'Are you sure to delete this contact?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col xs={12} sm={12} md={16}>
              <h2><FormattedMessage id="contacts" defaultMessage="Contacts"/></h2>
            </Col>
            <Col xs={12} sm={12} md={8} className="text-right">
              <HasAccess fn={this.props.canCreate}>
                {canModify && (
                  <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                    <FormattedMessage id="createNew" defaultMessage="Create new"/>
                  </Button>
                )}
              </HasAccess>
            </Col>
          </Row>

          <List
            className="custom-list"
            itemLayout="horizontal"
            dataSource={contacts}
            header={
              contacts.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}}`}
                values={{ formattedNumber: <FormattedNumber value={contacts.length}/>, count: contacts.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item
                actions={[
                  <Button
                    htmlType="button"
                    onClick={() => this.showModal(item)}
                    className="btn-link"
                    type="primary"
                    ghost={true}
                  >
                    <FormattedMessage id="view" defaultMessage="View"/>
                  </Button>,
                  <HasAccess fn={() => this.props.canDelete(item.key)}>
                    <ConfirmButton
                      title={confirmTitle}
                      btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                      onConfirm={() => this.deleteContact(item)}
                      type={'link'}
                    />
                  </HasAccess>
                ]}
                style={width < MEDIUM ? { flexDirection: 'column' } : {}}
              >
                <List.Item.Meta
                  title={
                    <React.Fragment>
                      {(item.lastName || item.firstName) ? (
                          <span
                            className="item-title preview"
                            onClick={() => this.showModal(item)}
                          >
                              {item.firstName} {item.lastName}
                            </span>
                        ) :
                        (item.organization ? <span className="item-title preview"
                                                   onClick={() => this.showModal(item)}>{item.organization}</span> : null)
                      }
                      {item.type && (
                        <span className="item-type">
                          <FormattedMessage id={`contactType.${item.type}`}/>
                        </span>
                      )}
                    </React.Fragment>
                  }
                  description={
                    <span className="item-description">
                      <FormattedMessage
                        id="createdByRow"
                        defaultMessage={`Created {date} by {author}`}
                        values={{ date: <FormattedRelativeDate value={item.created}/>, author: item.createdBy }}
                      />
                    </span>
                  }
                />
              </List.Item>
            )}
          />

          {isModalVisible && (
            <ContactDetails
              canUpdate={this.props.canUpdate}
              onCancel={this.handleCancel}
              contact={selectedContact}
              onCreate={this.handleSave}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

ContactList.propTypes = {
  contacts: PropTypes.array.isRequired,
  createContact: PropTypes.func,
  updateContact: PropTypes.func,
  deleteContact: PropTypes.func,
  updateCounts: PropTypes.func,
  canCreate: PropTypes.func.isRequired,
  canDelete: PropTypes.func.isRequired,
  canUpdate: PropTypes.func.isRequired,
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(withWidth()(injectIntl(ContactList)));