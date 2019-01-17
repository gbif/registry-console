import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Checkbox, Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';

// Wrappers
import withContext from '../../../../hoc/withContext';
// Components
import { FormItem, TagControl } from '../../../index';
// Helpers
import { validateEmail, validatePhone, validateUrl } from '../../../../helpers';

const Option = Select.Option;

const ContactForm = props => {
  const { contact, form, countries, userTypes } = props;
  const { getFieldDecorator } = form;

  return (
    <React.Fragment>
      <Form>

        <FormItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
          {getFieldDecorator('type', { initialValue: contact ? contact.type : undefined })(
            <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}>
              {userTypes.map(userType => (
                <Option value={userType} key={userType}>
                  <FormattedMessage id={`contactType.${userType}`}/>
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem
          label={<FormattedMessage id="primary" defaultMessage="Primary"/>}
          helpText={
            <FormattedMessage
              id="help.primaryCheckboxTip"
              defaultMessage="Indicates that the contact is the primary contact for the given type"
            />
          }
        >
          {getFieldDecorator('primary', {
            valuePropName: 'checked',
            initialValue: contact && contact.primary
          })(
            <Checkbox/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="firstName" defaultMessage="First name"/>}>
          {getFieldDecorator('firstName', { initialValue: contact && contact.firstName })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}>
          {getFieldDecorator('lastName', { initialValue: contact && contact.lastName })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="position" defaultMessage="Position"/>}>
          {getFieldDecorator('position', { initialValue: contact ? contact.position : [] })(
            <TagControl
              label={<FormattedMessage id="newPosition" defaultMessage="New position"/>}
              removeAll={true}
            />
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
          {getFieldDecorator('description', { initialValue: contact && contact.description })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
          {getFieldDecorator('email', {
            initialValue: contact ? contact.email : [],
            rules: [{
              validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid"/>)
            }]
          })(
            <TagControl label={<FormattedMessage id="newEmail" defaultMessage="New email"/>} removeAll={true}/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="phone" defaultMessage="Phone"/>}>
          {getFieldDecorator('phone', {
            initialValue: contact ? contact.phone : [],
            rules: [{
              validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid"/>)
            }]
          })(
            <TagControl label={<FormattedMessage id="newPhone" defaultMessage="New phone"/>} removeAll={true}/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
          {getFieldDecorator('homepage', {
            initialValue: contact ? contact.homepage : [],
            rules: [{ 
              validator: validateUrl(<FormattedMessage id="invalid.homepage" defaultMessage="Homepage is invalid"/>)
            }]
          })(
            <TagControl
              label={<FormattedMessage id="newHomepage" defaultMessage="New homepage"/>}
              removeAll={true}
            />
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="organization" defaultMessage="Organization"/>}>
          {getFieldDecorator('organization', { initialValue: contact && contact.organization })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="address" defaultMessage="Address"/>}>
          {getFieldDecorator('address', { initialValue: contact ? contact.address : [] })(
            <TagControl label={<FormattedMessage id="newAddress" defaultMessage="New address"/>} removeAll={true}/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="city" defaultMessage="City"/>}>
          {getFieldDecorator('city', { initialValue: contact && contact.city })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="province" defaultMessage="Province"/>}>
          {getFieldDecorator('province', { initialValue: contact && contact.province })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
          {getFieldDecorator('country', { initialValue: contact ? contact.country : undefined })(
            <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
              {countries.map(country => (
                <Option value={country} key={country}>
                  <FormattedMessage id={`country.${country}`}/>
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
          {getFieldDecorator('postalCode', { initialValue: contact && contact.postalCode })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="userId" defaultMessage="User ID"/>}>
          {getFieldDecorator('userId', { initialValue: contact ? contact.userId : [] })(
            <TagControl label={<FormattedMessage id="newUserId" defaultMessage="New user ID"/>} removeAll={true}/>
          )}
        </FormItem>
      </Form>
    </React.Fragment>
  );
};

ContactForm.propTypes = {
  contact: PropTypes.object,
  form: PropTypes.object.isRequired
};

const mapContextToProps = ({ userTypes, countries }) => ({ userTypes, countries });

export default withContext(mapContextToProps)(ContactForm);