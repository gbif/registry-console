import React from 'react';
import { Modal, Input, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import { FormItem } from '../../index';
const CommentCreateForm = ({ visible, onCancel, onCreate, intl }) => {
      const commentPlaceholder = intl.formatMessage({ id:'help.commentContent', defaultMessage:'Commentary should be written with consideration, using language suitable for any public forum and not containing sensitive details.' });
      const [form] = Form.useForm();
      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewComment" defaultMessage="Create a new comment"/>}
          okText={<FormattedMessage id="create" defaultMessage="Create"/>}
          onCancel={onCancel}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                onCreate(values).then(form.resetFields);
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form form={form}>
            <FormItem
              label={<FormattedMessage id="content" defaultMessage="Content"/>}
              helpText={
                <FormattedMessage
                  id="help.commentContent"
                  defaultMessage="Commentary should be written with consideration, using language suitable for any public forum and not containing sensitive details."
                />
              }
              name="content"
              rules={[{
                required: true,
                message: 'Please provide a content'
              }]}
            >
              <Input.TextArea rows={6} placeholder={commentPlaceholder} />
            </FormItem>
          </Form>
        </Modal>
      );
    }
  


CommentCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default injectIntl(CommentCreateForm);