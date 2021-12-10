import React from 'react';
import { Modal, Form, Row, Col, Switch, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Wrappers
import { HasAccess } from '../../../../auth';
// Components
import ContactForm from './Form';
import ContactPresentation from './Presentation';

const ContactDetails = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    state = { edit: !this.props.contact };

    getButtons = (contact, onCancel, onCreate, form) => {
      const buttons = [
        <Button key="reset" type={this.state.edit ? 'default' : 'primary'} onClick={onCancel}>
          <FormattedMessage id="close" defaultMessage="Close" />
        </Button>
      ];

      if (this.state.edit) {
        if (contact) {
          buttons.push(
            <Button key="submit" type="primary" onClick={() => onCreate(form)}>
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          );
        } else {
          buttons.push(
            <Button key="submit" type="primary" onClick={() => onCreate(form)}>
              <FormattedMessage id="create" defaultMessage="Create" />
            </Button>
          );
        }
      }

      return buttons;
    };

    render() {
      const { onCancel, onCreate, form, contact } = this.props;

      return (
        <Modal
          visible={true}
          title={<Row type="flex">
            <Col span={20}>
              {
                contact ?
                  <FormattedMessage id="details.contact" defaultMessage="Contact details" /> :
                  <FormattedMessage id="createNewContact" defaultMessage="Create a new contact" />
              }
            </Col>
            <Col span={4} className="text-right">
              {contact && this.props.canUpdate && (
                <HasAccess fn={() => this.props.canUpdate(contact.key)}>
                  <Switch
                    checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit" />}
                    unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit" />}
                    onChange={val => this.setState({ edit: val })}
                    checked={this.state.edit}
                  />
                </HasAccess>
              )}
            </Col>
          </Row>}
          destroyOnClose={true}
          maskClosable={!this.state.edit}
          closable={false}
          footer={this.getButtons(contact, onCancel, onCreate, form)}
          onCancel={onCancel}
        >
          {!this.state.edit && <ContactPresentation contact={contact} />}
          {this.state.edit && <ContactForm form={form} contact={contact} />}
        </Modal>
      );
    }
  }
);

ContactDetails.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  contact: PropTypes.object
};

export default ContactDetails;