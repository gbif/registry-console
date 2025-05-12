import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import FormItem from '../../common/FormItem';

const DescriptorGroupForm = props => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { onCancel, initialValues, groupKey } = props;
  const [form] = Form.useForm();
  const { title, description } = initialValues || {};

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      props.onSave(form, selectedFile);
    }).catch(error => {
      console.error('Validation failed:', error);
    });
  };

  return (
    <Form form={form} initialValues={{ title, description }} onFinish={handleSubmit}>
      <FormItem required name='title' label={<FormattedMessage id="title" defaultMessage="Title" />}>
        <Input />
      </FormItem>
      <FormItem required name='description' label={<FormattedMessage id="description" defaultMessage="Description" />}>
        <Input.TextArea rows={4} />
      </FormItem>
      <FormItem 
        initialValue={null} 
        required={!groupKey} 
        name='descriptorsFile' 
        label={<FormattedMessage id="fileCsvTsv" defaultMessage="File" />}
      >
        <Input type="file" accept=".csv, .tsv" onChange={handleFileChange} name="descriptorsFile" />
      </FormItem>
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button type="primary" htmlType="submit">
          {groupKey ? <FormattedMessage id="edit" defaultMessage="Edit" /> : <FormattedMessage id="add" defaultMessage="Add" />}
        </Button>
      </div>
    </Form>
  );
}

DescriptorGroupForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  groupKey: PropTypes.number
};

export default DescriptorGroupForm;