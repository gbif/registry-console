import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import FormItem from '../../FormItem';
import PersonControl from '../../PersonControl';

const PersonAddForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {

    validateUnique = () => (rule, value, callback) => {
      const { contacts } = this.props;
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

    render() {
      const { onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;

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
          <Form>
            <FormItem label={<FormattedMessage id="contact" defaultMessage="Contact"/>}>
              {getFieldDecorator('person', {
                rules: [{
                  validator: this.validateUnique()
                }]
              })(
                <PersonControl
                  placeholder={<FormattedMessage id="select.person" defaultMessage="Select a person"/>}
                  delay={1000}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

PersonAddForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  contacts: PropTypes.array.isRequired
};

export default PersonAddForm;