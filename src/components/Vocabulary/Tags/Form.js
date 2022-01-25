import React from 'react';
import { Modal, Input , Form} from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import { FormItem } from '../../common/index';
import ColorControl from '../../common/ColorControl';

  // eslint-disable-next-line
  const TagCreateForm = props => {
      const [form] = Form.useForm();
      const { visible, onCancel, onCreate, data } = props;
    let initialValues = {...data}
      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewTag" defaultMessage="Create a new tag"/>}
          okText={<FormattedMessage id="create" defaultMessage="Create"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
        >
          <Form colon={false} form={form} initialValues={initialValues}>

            <FormItem
              name='name'
              rules={[{
                required: true,
                message: 'Please input a name'
              }]}
              label={<FormattedMessage id="name" defaultMessage="Name"/>}
              helpText={
                <FormattedMessage
                  id="help.tagValueExtra"
                  defaultMessage="The name of the tag."
                />
              }
            >
              <Input disabled={data ? true : false}/>
            </FormItem>
            <FormItem
              name='color'
              label={<FormattedMessage id="color" defaultMessage="Color"/>}
              helpText={
                <FormattedMessage
                  id="help.tagValueExtra"
                  defaultMessage="The color of the tag."
                />
              }
            >
              <ColorControl/>
            </FormItem>
            <FormItem
              name='description'
              label={<FormattedMessage id="description" defaultMessage="Name"/>}
              helpText={
                <FormattedMessage
                  id="help.tagValueExtra"
                  defaultMessage="The description of the tag."
                />
              }
            >
                <Input/>
            </FormItem>
            <FormItem
              name="key" style={{display: 'none'}}
            >
              <Input type="hidden" />
             
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