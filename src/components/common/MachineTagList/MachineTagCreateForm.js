import React from 'react';
import { Modal, Form, Input } from 'antd';
import { FormattedMessage } from 'react-intl';

import { FormItem } from '../../widgets';

const MachineTagCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewMachineTag" defaultMessage="Create a new machine tag"/>}
          okText={<FormattedMessage id="create" defaultMessage="Create"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form>

            <FormItem
              label={<FormattedMessage id="namespace" defaultMessage="Namespace"/>}
              helpText={
                <FormattedMessage
                  id="extra.mtNamespaceExtra"
                  defaultMessage="The namespace is a category for the name/value pair tag. It may be used to distinguish groupings (e.g. crawling, processing) or to declare a true term namespace (e.g. dwc)"
                />
              }
            >
              {getFieldDecorator('namespace', {
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.namespace" defaultMessage="Please provide a namespace"/>
                }]
              })(<Input/>)}
            </FormItem>

            <FormItem
              label={<FormattedMessage id="name" defaultMessage="Name"/>}
              helpText={
                <FormattedMessage
                  id="extra.mtName"
                  defaultMessage="The name for the tag (e.g. basisOfRecord, type)."
                />
              }
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name"/>
                }]
              })(<Input/>)}
            </FormItem>

            <FormItem
              label={<FormattedMessage id="value" defaultMessage="Value"/>}
              helpText={
                <FormattedMessage
                  id="extra.mtValue"
                  defaultMessage="The value for the tag (e.g. Living specimen, MANIS)."
                />
              }
            >
              {getFieldDecorator('value', {
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.value" defaultMessage="Please provide a value"/>
                }]
              })(<Input/>)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

export default MachineTagCreateForm;