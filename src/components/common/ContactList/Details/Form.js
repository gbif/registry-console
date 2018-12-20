import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Checkbox, Form, Input, Select } from 'antd';

import withContext from '../../../hoc/withContext';
import formValidationWrapper from '../../../hoc/formValidationWrapper';
import TagControl from '../../../widgets/TagControl';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 8 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 16 }
  },
  style: {
    paddingBottom: 0,
    marginBottom: '5px',
    minHeight: '32px'
  }
};

const ContactForm = props => {
  const { data, form, countries, userTypes, handleEmail, handlePhone, handleHomepage } = props;
  const { getFieldDecorator } = form;

  return (
    <React.Fragment>
      <Form layout="vertical">

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="type" defaultMessage="Type"/>}
        >
          {getFieldDecorator('type', { initialValue: data ? data.type : undefined })(
            <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}>
              {userTypes.map(userType => (
                <Option value={userType} key={userType}>
                  <FormattedMessage id={userType}/>
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="primary" defaultMessage="Primary"/>}
        >
          {getFieldDecorator('primary', { initialValue: data && data.primary })(
            <Checkbox style={{ fontSize: '10px' }}>
              <FormattedMessage
                id="primaryCheckboxTip"
                defaultMessage="Indicates that the contact is the primary contact for the given type"
              />
            </Checkbox>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="firstName" defaultMessage="First name"/>}
        >
          {getFieldDecorator('firstName', { initialValue: data && data.firstName })(<Input/>)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}
        >
          {getFieldDecorator('lastName', { initialValue: data && data.lastName })(<Input/>)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="position" defaultMessage="Position"/>}
        >
          {getFieldDecorator('position', { initialValue: data ? data.position : [] })(
            <TagControl label={<FormattedMessage id="newPosition" defaultMessage="New position"/>}
                        removeAll={true}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="description" defaultMessage="Description"/>}
        >
          {getFieldDecorator('description', { initialValue: data && data.description })(<Input/>)}
        </FormItem>

        <FormItem {...formItemLayout} label={<FormattedMessage id="email" defaultMessage="Email"/>}>
          {getFieldDecorator('email', {
            initialValue: data ? data.email : [],
            rules: [{ validator: handleEmail }]
          })(
            <TagControl label={<FormattedMessage id="newEmail" defaultMessage="New email"/>} removeAll={true}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="phone" defaultMessage="Phone"/>}
        >
          {getFieldDecorator('phone', {
            initialValue: data ? data.phone : [],
            rules: [{ validator: handlePhone }]
          })(
            <TagControl label={<FormattedMessage id="newPhone" defaultMessage="New phone"/>} removeAll={true}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}
        >
          {getFieldDecorator('homepage', {
            initialValue: data ? data.homepage : [],
            rules: [{ validator: handleHomepage }]
          })(
            <TagControl label={<FormattedMessage id="newHomepage" defaultMessage="New homepage"/>}
                        removeAll={true}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="organization" defaultMessage="Organization"/>}
        >
          {getFieldDecorator('organization', { initialValue: data && data.organization })(<Input/>)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="address" defaultMessage="Address"/>}
        >
          {getFieldDecorator('address', { initialValue: data ? data.address : [] })(
            <TagControl label={<FormattedMessage id="newAddress" defaultMessage="New address"/>} removeAll={true}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="city" defaultMessage="City"/>}
        >
          {getFieldDecorator('city', { initialValue: data && data.city })(<Input/>)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="province" defaultMessage="Province"/>}
        >
          {getFieldDecorator('province', { initialValue: data && data.province })(<Input/>)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="country" defaultMessage="Country"/>}
        >
          {getFieldDecorator('country', { initialValue: data ? data.country : undefined })(
            <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
              {countries.map(country => (
                <Option value={country} key={country}>
                  <FormattedMessage id={`country.${country}`}/>
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}
        >
          {getFieldDecorator('postalCode', { initialValue: data && data.postalCode })(<Input/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="userId" defaultMessage="User ID"/>}
          className="last-row"
        >
          {getFieldDecorator('userId', { initialValue: data ? data.userId : [] })(
            <TagControl label={<FormattedMessage id="newUserId" defaultMessage="New user ID"/>} removeAll={true}/>
          )}
        </FormItem>
      </Form>
    </React.Fragment>
  );
};

const mapContextToProps = ({ userTypes, countries }) => ({ userTypes, countries });

export default withContext(mapContextToProps)(formValidationWrapper(ContactForm));