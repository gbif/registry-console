import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import { FormItem } from '../../common/index';
import ColorControl from '../../common/ColorControl';

const TagCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, data } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewTag" defaultMessage="Create a new tag"/>}
          okText={<FormattedMessage id="create" defaultMessage="Create"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
        >
          <Form colon={false}>

            <FormItem
              label={<FormattedMessage id="name" defaultMessage="Name"/>}
              helpText={
                <FormattedMessage
                  id="help.tagValueExtra"
                  defaultMessage="The name of the tag."
                />
              }
            >
              {getFieldDecorator('name', {
                initialValue: data ? data.name : null,
                rules: [{
                  required: true,
                  message: 'Please input a name'
                }]
              })(
                <Input disabled={data ? true : false}/>
              )}
            </FormItem>
            <FormItem
              label={<FormattedMessage id="color" defaultMessage="Color"/>}
              helpText={
                <FormattedMessage
                  id="help.tagValueExtra"
                  defaultMessage="The color of the tag."
                />
              }
            >
              {getFieldDecorator('color', {
                                  initialValue: data ? data.color : null,      
              })(
                <ColorControl/>
              )}
            </FormItem>
            <FormItem
              label={<FormattedMessage id="description" defaultMessage="Name"/>}
              helpText={
                <FormattedMessage
                  id="help.tagValueExtra"
                  defaultMessage="The description of the tag."
                />
              }
            >
              {getFieldDecorator('description', {
                initialValue: data ? data.description : null,
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem
              
            >
              {getFieldDecorator('key', {
                initialValue: data ? data.key : null
                
              })(
                <Input type="hidden" />
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

TagCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default TagCreateForm;