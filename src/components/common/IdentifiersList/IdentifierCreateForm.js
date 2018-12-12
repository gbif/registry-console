import React from 'react';
import { Modal, Form, Input, Select, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';

import { getIdentifierTypes } from '../../../api/enumeration';

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
    state = {
      identifierTypes: [],
      fetching: true
    };

    componentDidMount() {
      getIdentifierTypes().then(identifierTypes => {
        this.setState({
          identifierTypes,
          fetching: false
        });
      });
    }

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const { identifierTypes, fetching } = this.state;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewIdentifier" defaultMessage="Create a new identifier"/>}
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
              label={<FormattedMessage id="identifier" defaultMessage="Identifier"/>}
              extra={<FormattedMessage
                id="extra.identifier"
                defaultMessage="The value for the identifier (e.g. doi://12.123/123)."
              />}
            >
              {getFieldDecorator('identifier', {
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.identifier" defaultMessage="Please provide an identifier"/>
                }]
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="type" defaultMessage="Type"/>}
              extra={<FormattedMessage id="extra.identifierType" defaultMessage="Select the type of the identifier."/>}
              className="last-row"
            >
              {getFieldDecorator('type')(
                <Select
                  placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                >
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