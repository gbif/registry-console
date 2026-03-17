import React, { useState, useRef, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { Form, Input, Button, Upload, message, Alert, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const SuggestForm = ({ collectionKey, onSuggestion, initialValues, intl, hasUpdate, onDiscard, descriptorTags }) => {
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

  const getSuggestionData = (values) => {
    const commentsList = values.comments
      ? (Array.isArray(values.comments) ? values.comments : values.comments.split('\n').filter(comment => comment.trim()))
      : [];

    return {
      file,
      type: initialValues?.type || 'CREATE',
      title: (initialValues && initialValues.type === 'DELETE') ? initialValues.title : values.title,
      description: values.description,
      format,
      proposerEmail: values.proposerEmail,
      comments: commentsList,
      tags: values.tags
    };
  };

  const getDiscardSuggestionData = (values) => {
    const commentsList = values.comments
      ? (Array.isArray(values.comments) ? values.comments : values.comments.split('\n').filter(comment => comment.trim()))
      : [];

    return {
      file: null,
      type: initialValues?.type || 'CREATE',
      title: initialValues?.title,
      description: initialValues?.description,
      format: initialValues?.format || format,
      proposerEmail: initialValues?.proposerEmail || values.proposerEmail,
      comments: [...(initialValues?.comments || []), ...commentsList],
      tags: initialValues?.tags
    };
  };

  const buildSuggestionFormData = (values) => {
    const data = getSuggestionData(values);
    const formData = new FormData();
    formData.append('collectionKey', collectionKey);
    formData.append('type', data.type);
    if (initialValues) {
      formData.append('descriptorGroupKey', initialValues.key);
      formData.append('hasChanges', 'true');
    }
    if (data.file) {
      formData.append('file', data.file);
    }
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('format', data.format);
    formData.append('proposerEmail', data.proposerEmail);
    data.comments.forEach(comment => formData.append('comments', comment));
    if (data.tags) {
      data.tags.forEach(tag => formData.append('tags', tag));
    }
    return formData;
  };

  const handleSubmit = async (values) => {
    if (!isMounted.current) return;

    try {
      setLoading(true);
      await onSuggestion(buildSuggestionFormData(values));
      
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

  const handleDiscard = async () => {
    try {
      const values = await form.validateFields();
      onDiscard(getDiscardSuggestionData(values));
    } catch (error) {
      if (error?.errorFields) return;
      throw error;
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
          message={intl.formatMessage({ 
            id: "suggestion.noEditAccess", 
            defaultMessage: "You do not have edit access, but you can suggest a change if you provide your email." 
          })}
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
            name='tags' 
            label={intl.formatMessage({ id: "tags", defaultMessage: "Tags" })}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder={intl.formatMessage({ id: "addTags", defaultMessage: "Add tags" })}
              tokenSeparators={[',']}
              allowClear
              showSearch
              options={descriptorTags}
            />
          </Form.Item>

          <Form.Item
            name="file"
            label={intl.formatMessage({ id: "fileCsvTsv", defaultMessage: "File" })}
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
            onClick={handleDiscard}
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