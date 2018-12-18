import React from 'react';
import { Modal, Form, Input } from 'antd';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Textarea = Input.TextArea;
const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 18 }
  },
  style: {
    paddingBottom: 0,
    marginBottom: '10px'
  }
};

const CommentCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewComment" defaultMessage="Create a new comment"/>}
          okText={<FormattedMessage id="create" defaultMessage="Create"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form layout="vertical">
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="content" defaultMessage="Content"/>}
              extra={<FormattedMessage
                id="extra.commentContent"
                defaultMessage={`Commentary should be written with consideration, using language suitable for any public forum and not containing sensitive details. {break}{bold}.`}
                values={{
                  break: <br/>,
                  bold: <b><FormattedMessage
                    id="supportedFormats"
                    defaultMessage="Only use of plain text is supported - no XML, JSON etc"
                  /></b>
                }}
              />}
              className="last-row"
            >
              {getFieldDecorator('content', {
                rules: [{
                  required: true,
                  message: 'Please provide a content'
                }]
              })(
                <Textarea rows={4}/>
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

export default CommentCreateForm;