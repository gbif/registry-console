import React from 'react';
import { Modal, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import FormItem from '../../FormItem';
import PersonControl from '../../PersonControl';

  // eslint-disable-next-line
  const PersonAddForm = (props) => {

    const { onCancel, onCreate } = props;
    const [form] = Form.useForm();
    const validateUnique = () => (rule, value, callback) => {
      const { contacts } = props;
      const selectedPerson = value ? JSON.parse(value) : value;

      if (selectedPerson && contacts && contacts.length > 0) {
        const hasValue = contacts.some(contact => contact.key === selectedPerson.key);
        if (hasValue) {
          callback(
            <FormattedMessage id="error.contact.duplicate" defaultMessage="You can't add the same contact twice"/>
          );
        }
      }
      callback();
    };

 

      return (
        <Modal
          visible={true}
          title={<FormattedMessage id="addNewContact" defaultMessage="Add a new contact"/>}
          okText={<FormattedMessage id="add" defaultMessage="Add"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form form={form}>
            <FormItem name={'person'} rules={[{
                  validator: validateUnique()
                }]} label={<FormattedMessage id="contact" defaultMessage="Contact"/>}>
              <PersonControl
                  placeholder={<FormattedMessage id="select.person" defaultMessage="Select a person"/>}
                  delay={1000}
                />
            </FormItem>
          </Form>
        </Modal>
      );
    
  }

PersonAddForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  contacts: PropTypes.array.isRequired
};

export default PersonAddForm;