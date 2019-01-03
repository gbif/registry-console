import React from 'react';
import { Modal, Form, Input } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import { FormItem } from '../../widgets';

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
          <Form>
            <FormItem
              label={<FormattedMessage id="content" defaultMessage="Content"/>}
              helpText={
                <FormattedMessage
                  id="extra.commentContent"
                  defaultMessage={`Commentary should be written with consideration, using language suitable for any public forum and not containing sensitive details. {break}{bold}.`}
                  values={{
                    break: <br/>,
                    bold: <b><FormattedMessage
                      id="supportedFormats"
                      defaultMessage="Only use of plain text is supported - no XML, JSON etc"
                    /></b>
                  }}
                />
              }
            >
              {getFieldDecorator('content', {
                rules: [{
                  required: true,
                  message: 'Please provide a content'
                }]
              })(
                <Input.TextArea rows={4}/>
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

CommentCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default CommentCreateForm;