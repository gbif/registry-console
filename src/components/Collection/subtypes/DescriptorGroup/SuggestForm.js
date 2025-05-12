import React, { useState, useRef, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { Form, Input, Button, Upload, message, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const SuggestForm = ({ collectionKey, onSuggestion, initialValues, intl, reviewChange, hasUpdate, onDiscard }) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('CSV');
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async (values) => {
    if (!isMounted.current) return;

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('collectionKey', collectionKey);
      formData.append('type', initialValues.type);
      if (initialValues) {
        formData.append('descriptorGroupKey', initialValues.key);
        formData.append('hasChanges', 'true');
        if (file) {
          formData.append('file', file);
        }
      }
      
      if (initialValues && initialValues.type === 'DELETE') {
        formData.append('title', initialValues.title);
      } else {
        formData.append('title', values.title);
      }
      
      if (values.description) formData.append('description', values.description);
      
      formData.append('format', format);
      formData.append('proposerEmail', values.proposerEmail);

      if (values.comments) {
        const commentsList = Array.isArray(values.comments) 
          ? values.comments 
          : values.comments.split('\n').filter(comment => comment.trim());
        commentsList.forEach(comment => formData.append('comments', comment));
      }

      await onSuggestion(formData);
      
      if (isMounted.current) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (isMounted.current) {
        message.error(intl.formatMessage({ 
          id: "descriptorGroup.suggestion.error", 
          defaultMessage: "Failed to submit your suggestion" 
        }));
        setLoading(false);
      }
    }
  };

  const beforeUpload = (file) => {
    const isCSV = file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
    const isTSV = file.type === 'text/tab-separated-values' || file.name.toLowerCase().endsWith('.tsv');
    
    if (!isCSV && !isTSV) {
      message.error(intl.formatMessage({
        id: 'upload.fileType',
        defaultMessage: 'You can only upload CSV or TSV files!'
      }));
      return false;
    }
    
    setFile(file);
    setFormat(file.name.toLowerCase().endsWith('.tsv') ? 'TSV' : 'CSV');
    form.setFieldsValue({ file });
    return false;
  };

  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      setFile(info.file.originFileObj);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      {!hasUpdate && (
        <Alert
          message={intl.formatMessage({ id: "suggestion.noEditAccess", defaultMessage: "You do not have edit access, but you can suggest a change if you provide your email." })}
          type="warning"
          style={{ marginBottom: 24 }}
        />
      )}

      {(!initialValues || initialValues.type === 'UPDATE' || initialValues.type === 'CREATE') && (
        <>
          <Form.Item
            name="title"
            label={intl.formatMessage({ id: "title", defaultMessage: "Title" })}
            rules={[{ required: true, message: intl.formatMessage({ id: "required", defaultMessage: "Required" }) }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label={intl.formatMessage({ id: "description", defaultMessage: "Description" })}
            rules={[{ required: true, message: intl.formatMessage({ id: "required", defaultMessage: "Required" }) }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="file"
            label={intl.formatMessage({ id: "newFile", defaultMessage: "New File" })}
            required={!initialValues?.key}
          >
            <Upload
              beforeUpload={beforeUpload}
              onChange={handleFileChange}
              maxCount={1}
              accept=".csv,.tsv"
            >
              <Button icon={<UploadOutlined />}>
                {intl.formatMessage({ id: "upload", defaultMessage: "Upload" })}
              </Button>
            </Upload>
          </Form.Item>
        </>
      )}

      {initialValues && initialValues.type === 'DELETE' && (
        <Alert
          message={intl.formatMessage({ 
            id: "descriptorGroup.deleteWarning", 
            defaultMessage: "You are about to suggest deletion of this descriptor group. This action will remove all associated data. Please provide your email and comments explaining why this descriptor group should be deleted." 
          })}
          type="warning"
          style={{ marginBottom: 24 }}
        />
      )}

      <Form.Item
        name="proposerEmail"
        label={intl.formatMessage({ id: "proposerEmail", defaultMessage: "Your Email" })}
        rules={[{ required: true, message: intl.formatMessage({ id: "required", defaultMessage: "Required" }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="comments"
        label={intl.formatMessage({ id: "comments", defaultMessage: "Comments" })}
        rules={[{ required: true, message: intl.formatMessage({ id: "required", defaultMessage: "Required" }) }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        {hasUpdate && initialValues && (
          <Button 
            type="default"
            style={{ marginRight: 8 }}
            onClick={onDiscard}
          >
            {intl.formatMessage({ id: "discard", defaultMessage: "Discard" })}
          </Button>
        )}
        <Button type="primary" htmlType="submit" loading={loading}>
          {intl.formatMessage({ id: "submit", defaultMessage: "Submit" })}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default injectIntl(SuggestForm); 