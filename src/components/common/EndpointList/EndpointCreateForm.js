import React from 'react';
import { Modal, Form, Input, Select, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';

import { getEndpointTypes } from '../../../api/enumeration';

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
    state = {
      endpointTypes: [],
      fetching: true
    };

    componentDidMount() {
      getEndpointTypes().then(endpointTypes => {
        this.setState({
          endpointTypes,
          fetching: false
        });
      });
    }

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const { endpointTypes, fetching } = this.state;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewEndpoint" defaultMessage="Create a new endpoint"/>}
          okText={<FormattedMessage id="create" defaultMessage="Create"/>}
          onCancel={onCancel}
          onOk={onCreate}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form layout="vertical">
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="type" defaultMessage="Type"/>}
            >
              {getFieldDecorator('type')(
                <Select
                  placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                >
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
                  message: <FormattedMessage id="provide.url" defaultMessage="Please provide a URL"/>
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