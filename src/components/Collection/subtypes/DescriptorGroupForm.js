import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import FormItem from '../../common/FormItem';

const DescriptorGroupForm = props => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { visible, onCancel, onCreate } = props;
  const [form] = Form.useForm()

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <Modal
      visible={visible}
      title={<FormattedMessage id="addDescriptorGroup" defaultMessage="Add a descriptor group" />}
      okText={props.groupKey ? <FormattedMessage id="edit" defaultMessage="Edit" /> : <FormattedMessage id="add" defaultMessage="Add" />}
      onCancel={onCancel}
      onOk={() => onCreate(form, selectedFile, props.groupKey)}
      destroyOnClose={true}
      maskClosable={false}
      closable={false}
    >
      <Form form={form} initialValues={{}}>
        <FormItem required name='title' label={<FormattedMessage id="title" defaultMessage="Title" />}>
          <Input />
        </FormItem>
        <FormItem required name='description' label={<FormattedMessage id="description" defaultMessage="Description" />}>
          <Input.TextArea rows={4} />
        </FormItem>
        <FormItem initialValue={null} required name='descriptorsFile' label={<FormattedMessage id="file" defaultMessage="File" />}>
          <Input type="file" accept=".csv, .tsv" onChange={handleFileChange} name="descriptorsFile" />
        </FormItem>
      </Form>
    </Modal>
  );

}


DescriptorGroupForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default DescriptorGroupForm;