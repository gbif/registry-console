import React, {useState} from 'react';
import { Modal, Row, Col, Switch, Button, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Wrappers
import { HasAccess } from '../../../../auth';
// Components
import ContactForm from './Form';
import ContactPresentation from './Presentation';

  // eslint-disable-next-line
  const ContactDetails = props => {
    const [form] = Form.useForm();
    const { onCancel, onCreate, contact } = props;

    const [edit, setEdit] = useState(!contact )

    const getButtons = (contact, onCancel, onCreate, form) => {
      const buttons = [
        <Button key="reset" type={edit ? 'default' : 'primary'} onClick={onCancel}>
          <FormattedMessage id="close" defaultMessage="Close"/>
        </Button>
      ];

      if (edit) {
        if (contact) {
          buttons.push(
            <Button key="submit" type="primary" onClick={() => onCreate(form)}>
              <FormattedMessage id="save" defaultMessage="Save"/>
            </Button>
          );
        } else {
              buttons.push(
                <Button key="submit" type="primary" onClick={() => onCreate(form)}>
                  <FormattedMessage id="create" defaultMessage="Create"/>
                </Button>
              );
        }
      }

      return buttons;
    };

    

      return (
        <Modal
          visible={true}
          title={<Row type="flex">
            <Col span={20}>
              {
                contact ?
                  <FormattedMessage id="details.contact" defaultMessage="Contact details"/> :
                  <FormattedMessage id="createNewContact" defaultMessage="Create a new contact"/>
              }
            </Col>
            <Col span={4} className="text-right">
              {contact && props.canUpdate && (
                <HasAccess fn={() => props.canUpdate(contact)}>
                  <Switch
                    checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    onChange={setEdit}
                    checked={edit}
                  />
                </HasAccess>
              )}
            </Col>
          </Row>}
          destroyOnClose={true}
          maskClosable={!edit}
          closable={false}
          footer={getButtons(contact, onCancel, onCreate, form)}
          onCancel={onCancel}
        >
          {!edit && <ContactPresentation contact={contact}/>}
          {edit && <ContactForm form={form} contact={contact}/>}
        </Modal>
      );
    
  }


ContactDetails.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  contact: PropTypes.object
};

export default ContactDetails;