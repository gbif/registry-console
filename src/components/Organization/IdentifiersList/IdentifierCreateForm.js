import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { FormattedMessage } from 'react-intl';

import { identifierTypes } from '../../../api/enumeration';

const FormItem = Form.Item;
const Option = Select.Option;
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

const IdentifierCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewEndpoint" defaultMessage="Create a new endpoint"/>}
          okText={<FormattedMessage id="create" defaultMessage="Create"/>}
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="identifier" defaultMessage="Identifier"/>}
              extra={'The value for the identifier (e.g. doi://12.123/123).'}
            >
              {getFieldDecorator('identifier', {
                rules: [{
                  required: true,
                  message: 'Please input an identifier'
                }]
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="type" defaultMessage="Type"/>}
              extra={'Select the type of the identifier.'}
            >
              {getFieldDecorator('type')(
                <Select placeholder="Select a type">
                  {identifierTypes.map(identifierType => (
                    <Option value={identifierType} key={identifierType}>{identifierType}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

export default IdentifierCreateForm;