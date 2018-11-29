import React from 'react';
import { FormattedMessage } from 'react-intl'
import { Form, Input, Select, Button } from 'antd';
import { updateDataset } from '../../../api/dataset'

const FormItem = Form.Item;
const Option = Select.Option;

class DatasetForm extends React.Component {
  state = {
    confirmDirty: false
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        updateDataset({...this.props.dataset, ...values})
        .then(this.props.onSubmit)
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataset } = this.props

    const formItemLayout = {
      labelCol: {
        sm: { span: 24 },
        md: { span: 8 },
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="title" defaultMessage="Title" />}
          >
            {getFieldDecorator('title', {
              initialValue: dataset.title,
              rules: [{
                required: true, message: 'Please provide a title',
              }],
            })(
              <Input />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="datasetType" defaultMessage="Dataset type" />}
          >
            {getFieldDecorator('type', {
              initialValue: dataset.type,
              rules: [
                { required: true, message: 'Please select a dataset type!' },
              ],
            })(
              <Select placeholder="None selected">
                <Option value="OCCURRENCE">Occurrence</Option>
                <Option value="CHECKLIST">Checklist</Option>
                <Option value="SAMPLIG_EVENT">Sampling event</Option>
                <Option value="META_DATA">Meta data</Option>
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="doi" defaultMessage="DOI" />}
          >
            {getFieldDecorator('doi', {
              initialValue: dataset.doi,
              rules: [{
                required: true, message: 'Please specify a DOI',
              }],
            })(
              <Input />
            )}
          </FormItem>
          
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Update</Button>
          </FormItem>
        </Form>
      </React.Fragment>
    );
  }
}

const WrappedDatasetForm = Form.create()(DatasetForm);
export default WrappedDatasetForm
