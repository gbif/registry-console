import React from 'react';
import { Modal, Form, Input, Select, Spin } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

import { getEndpointTypes } from '../../../api/enumeration';
import formValidationWrapper from '../../hoc/formValidationWrapper';

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
    marginBottom: '5px',
    minHeight: '32px'
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
      const { visible, onCancel, onCreate, form, handleUrl } = this.props;
      const { getFieldDecorator } = form;
      const { endpointTypes, fetching } = this.state;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewEndpoint" defaultMessage="Create a new endpoint"/>}
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
              label={<FormattedMessage id="type" defaultMessage="Type"/>}
            >
              {getFieldDecorator('type', {
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.type" defaultMessage="Please provide a type"/>
                }]
              })(
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
                }, {
                    validator: handleUrl
                }]
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="description" defaultMessage="Description"/>}
              className="last-row"
            >
              {getFieldDecorator('description')(<Input/>)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

export default injectIntl(formValidationWrapper(EndpointCreateForm));