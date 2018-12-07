import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { FormattedMessage } from 'react-intl';

import { endpointTypes } from '../../api/enumeration';

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

const EndpointCreateForm = Form.create()(
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
              label={<FormattedMessage id="type" defaultMessage="Type"/>}
            >
              {getFieldDecorator('type')(
                <Select placeholder="Select a type">
                  {endpointTypes.map(endpointType => (
                    <Option value={endpointType} key={endpointType}>{endpointType}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="url" defaultMessage="URL"/>}
            >
              {getFieldDecorator('url', {
                rules: [{
                  required: true,
                  message: 'Please input a URL'
                }]
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="description" defaultMessage="Description"/>}
            >
              {getFieldDecorator('description')(<Input/>)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

export default EndpointCreateForm;