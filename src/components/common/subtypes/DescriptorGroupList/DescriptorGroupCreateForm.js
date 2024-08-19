import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Input , Form} from 'antd';
import { FormattedMessage } from 'react-intl';

// Components
import { FormItem } from '../../index';

  const MachineTagCreateForm = props => {
    
      const { visible, onCancel, onCreate } = props;
      const [form] = Form.useForm()
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
          <Form form={form}>

            <FormItem
              name='namespace'
              rules= {[{
                required: true,
                message: <FormattedMessage id="provide.namespace" defaultMessage="Please provide a namespace"/>
              }]}
              label={<FormattedMessage id="namespace" defaultMessage="Namespace"/>}
              helpText={
                <FormattedMessage
                  id="help.mtNamespaceExtra"
                  defaultMessage="The namespace is a category for the name/value pair tag. It may be used to distinguish groupings (e.g. crawling, processing) or to declare a true term namespace (e.g. dwc)"
                />
              }
            >
              <Input/>
            </FormItem>

            <FormItem
            name='name'
            rules= {[{
              required: true,
              message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name"/>
            }]}
              label={<FormattedMessage id="name" defaultMessage="Name"/>}
              helpText={
                <FormattedMessage
                  id="help.mtName"
                  defaultMessage="The name for the tag (e.g. basisOfRecord, type)."
                />
              }
            >
              <Input/>
            </FormItem>

            <FormItem
              name='value'
              rules= {[{
                required: true,
                message: <FormattedMessage id="provide.value" defaultMessage="Please provide a value"/>
              }]}
              label={<FormattedMessage id="value" defaultMessage="Value"/>}
              helpText={
                <FormattedMessage
                  id="help.mtValue"
                  defaultMessage="The value for the tag (e.g. Living specimen, MANIS)."
                />
              }
            >
             <Input/>
            </FormItem>
          </Form>
        </Modal>
      );
    
  }


MachineTagCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default MachineTagCreateForm;