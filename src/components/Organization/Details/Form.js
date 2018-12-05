import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Input, Select } from 'antd';

import { updateOrganization } from '../../../api/organization';
import { CountryContext } from '../../App';
import prettifyCountry from '../../../api/util/prettifyCountry';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

class OrganizationForm extends Component {
  state = {
    confirmDirty: false
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        for (const key in values) {
          if (!values.hasOwnProperty(key)) {
            continue;
          }

          if (values[key] && values[key].includes(';')) {
            values[key] = values[key].split(';').map(item => item.trim());
          }
        }

        updateOrganization({ ...this.props.organization, ...values })
          .then(this.props.onSubmit);
      }
    });
  };

  // handleConfirmBlur = (e) => {
  //   const value = e.target.value;
  //   this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  // };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { organization } = this.props;

    const formItemLayout = {
      labelCol: {
        sm: { span: 24 },
        md: { span: 24 }
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 24 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} layout={'vertical'}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="title" defaultMessage="Title"/>}
          >
            {getFieldDecorator('title', {
              initialValue: organization.title,
              rules: [{
                required: true, message: 'Please provide a title'
              }]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="abbreviation" defaultMessage="Abbreviation"/>}
          >
            {getFieldDecorator('abbreviation', {
              initialValue: organization.abbreviation
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="description" defaultMessage="Description"/>}
          >
            {getFieldDecorator('description', {
              initialValue: organization.description
            })(
              <TextArea rows={8}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="endorsingNode" defaultMessage="Endorsing node"/>}
          />
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}
          >
            {getFieldDecorator('homepage', {
              initialValue: organization.homepage.join('; ')
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>}
          >
            {getFieldDecorator('logoUrl', {
              initialValue: organization.logoUrl
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="language" defaultMessage="Language"/>}
          >
            {getFieldDecorator('language', {
              initialValue: organization.language
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="address" defaultMessage="Address"/>}
          >
            {getFieldDecorator('address', {
              initialValue: organization.address.join('; '),
              rules: [{
                required: true, message: 'Please provide an email'
              }]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="city" defaultMessage="City"/>}
          >
            {getFieldDecorator('city', {
              initialValue: organization.city
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="province" defaultMessage="Province"/>}
          >
            {getFieldDecorator('province', {
              initialValue: organization.province
            })(
              <Input/>
            )}
          </FormItem>
          <CountryContext.Consumer>
            {countries => (
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="country" defaultMessage="Country"/>}
              >
                {getFieldDecorator('country', {
                  initialValue: organization.country
                })(
                  <Select placeholder="None selected">
                    {countries.map(country => (
                      <Option value={country} key={country}>{prettifyCountry(country)}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}
          </CountryContext.Consumer>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}
          >
            {getFieldDecorator('postalCode', {
              initialValue: organization.postalCode
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="email" defaultMessage="Email"/>}
          >
            {getFieldDecorator('email', {
              initialValue: organization.email.join('; '),
              rules: [{
                required: true, message: 'Please provide an email'
              }]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="phone" defaultMessage="Phone"/>}
          >
            {getFieldDecorator('phone', {
              initialValue: organization.phone.join('; '),
              rules: [{
                required: true, message: 'Please provide a phone'
              }]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="latitude" defaultMessage="Latitude"/>}
          >
            {getFieldDecorator('latitude', {
              initialValue: organization.latitude
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="longitude" defaultMessage="Longitude"/>}
          >
            {getFieldDecorator('longitude', {
              initialValue: organization.longitude
            })(
              <Input/>
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

const WrappedOrganizationForm = Form.create()(OrganizationForm);
export default WrappedOrganizationForm;