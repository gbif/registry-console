import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';
import injectSheet from 'react-jss';

import ContactCreateForm from './ContactCreateForm';
import ContactPresentation from './ContactPresentation';
import { ConfirmDeleteControl } from '../../widgets';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';

const styles = {
  type: {
    fontSize: '12px', color: 'grey', marginLeft: 10
  }
};

class ContactList extends React.Component {
  state = {
    editVisible: false,
    detailsVisible: false,
    selectedContact: null,
    contacts: this.props.data.contacts,
    item: this.props.data
  };

  showModal = contact => {
    this.setState({
      selectedContact: contact,
      editVisible: true
    });
  };

  showDetails = contact => {
    this.setState({
      selectedContact: contact,
      detailsVisible: true
    });
  };

  handleCancel = () => {
    this.setState({
      editVisible: false,
      detailsVisible: false,
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
      this.props.addError({ status: error.response.status, statusText: error.response.data })
    });
  };

  handleSave = form => {
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
          editVisible: false,
          selectedContact: null,
          contacts
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data })
      });
    });
  };

  render() {
    const { contacts, item, editVisible, detailsVisible, selectedContact } = this.state;
    const { classes, intl } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.contact',
      defaultMessage: 'Are you sure delete this contact?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <span className="help">{item.title}</span>
              <h2><FormattedMessage id="contacts" defaultMessage="Contacts"/></h2>
            </Col>
            <Col span={4}>
              <PermissionWrapper item={item} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>

          <List
            itemLayout="horizontal"
            dataSource={contacts}
            renderItem={item => (
              <List.Item actions={[
                <Button
                  htmlType="button"
                  onClick={() => this.showDetails(item)}
                  className="btn-link"
                  type="primary"
                  ghost={true}
                >
                  <FormattedMessage id="details" defaultMessage="Details"/>
                </Button>,
                <PermissionWrapper item={item} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <Button htmlType="button" onClick={() => this.showModal(item)} className="btn-link" type="primary"
                          ghost={true}>
                    <FormattedMessage id="edit" defaultMessage="Edit"/>
                  </Button>
                </PermissionWrapper>,
                <PermissionWrapper item={item} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteContact(item)}/>
                </PermissionWrapper>
              ]}>
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={
                      <React.Fragment>
                        {item.lastName ? `${item.firstName} ${item.lastName}` : item.organization}
                        {item.type ? <span className={classes.type}>
                          <FormattedMessage id={item.type}/>
                      </span> : null}
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

          {editVisible && (
            <ContactCreateForm
              visible={editVisible}
              onCancel={this.handleCancel}
              data={selectedContact}
              onCreate={this.handleSave}
            />
          )}

          {detailsVisible && <ContactPresentation
            visible={detailsVisible}
            onCancel={this.handleCancel}
            data={selectedContact}
          />}
        </div>
      </React.Fragment>
    );
  }
}

ContactList.propTypes = {
  data: PropTypes.object.isRequired,
  createContact: PropTypes.func,
  updateContact: PropTypes.func,
  deleteContact: PropTypes.func,
  update: PropTypes.func
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectSheet(styles)(injectIntl(ContactList)));