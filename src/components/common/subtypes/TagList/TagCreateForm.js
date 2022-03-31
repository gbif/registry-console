import React from 'react';
import { Modal, Input , Form} from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import { FormItem } from '../../index';

  const TagCreateForm = props => {
      const [form] = Form.useForm()
      const { visible, onCancel, onCreate } = props;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewTag" defaultMessage="Create a new tag"/>}
          okText={<FormattedMessage id="create" defaultMessage="Create"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
        >
          <Form form={form}> 

            <FormItem
            name='value'
            rules= {[{
              required: true,
              message: 'Please input a value'
            }]}
              label={<FormattedMessage id="value" defaultMessage="Value"/>}
              helpText={
                <FormattedMessage
                  id="help.tagValueExtra"
                  defaultMessage="The value for the tag (e.g. Arthropod pitfall trap)."
                />
              }
            >
              <Input/>
            </FormItem>
          </Form>
        </Modal>
      );
    
  }


TagCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default TagCreateForm;