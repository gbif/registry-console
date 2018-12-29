import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Checkbox, Form, Input, Select } from 'antd';

// Wrappers
import withContext from '../../../hoc/withContext';
// Components
import { FormItem, TagControl } from '../../../widgets';
// Helpers
import { validateEmail, validatePhone, validateUrl } from '../../../helpers';

const Option = Select.Option;

const ContactForm = props => {
  const { data, form, countries, userTypes } = props;
  const { getFieldDecorator } = form;

  return (
    <React.Fragment>
      <Form>

        <FormItem label={<FormattedMessage id="type" defaultMessage="Type"/>} modal>
          {getFieldDecorator('type', { initialValue: data ? data.type : undefined })(
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
              id="primaryCheckboxTip"
              defaultMessage="Indicates that the contact is the primary contact for the given type"
            />
          }
          modal
        >
          {getFieldDecorator('primary', { initialValue: data && data.primary })(
            <Checkbox/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="firstName" defaultMessage="First name"/>} modal>
          {getFieldDecorator('firstName', { initialValue: data && data.firstName })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="lastName" defaultMessage="Last name"/>} modal>
          {getFieldDecorator('lastName', { initialValue: data && data.lastName })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="position" defaultMessage="Position"/>} modal>
          {getFieldDecorator('position', { initialValue: data ? data.position : [] })(
            <TagControl
              label={<FormattedMessage id="newPosition" defaultMessage="New position"/>}
              removeAll={true}
            />
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="description" defaultMessage="Description"/>} modal>
          {getFieldDecorator('description', { initialValue: data && data.description })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="email" defaultMessage="Email"/>} modal>
          {getFieldDecorator('email', {
            initialValue: data ? data.email : [],
            rules: [{
              validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid"/>)
            }]
          })(
            <TagControl label={<FormattedMessage id="newEmail" defaultMessage="New email"/>} removeAll={true}/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="phone" defaultMessage="Phone"/>} modal>
          {getFieldDecorator('phone', {
            initialValue: data ? data.phone : [],
            rules: [{
              validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid"/>)
            }]
          })(
            <TagControl label={<FormattedMessage id="newPhone" defaultMessage="New phone"/>} removeAll={true}/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>} modal>
          {getFieldDecorator('homepage', {
            initialValue: data ? data.homepage : [],
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

        <FormItem label={<FormattedMessage id="organization" defaultMessage="Organization"/>} modal>
          {getFieldDecorator('organization', { initialValue: data && data.organization })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="address" defaultMessage="Address"/>} modal>
          {getFieldDecorator('address', { initialValue: data ? data.address : [] })(
            <TagControl label={<FormattedMessage id="newAddress" defaultMessage="New address"/>} removeAll={true}/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="city" defaultMessage="City"/>} modal>
          {getFieldDecorator('city', { initialValue: data && data.city })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="province" defaultMessage="Province"/>} modal>
          {getFieldDecorator('province', { initialValue: data && data.province })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="country" defaultMessage="Country"/>} modal>
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

        <FormItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>} modal>
          {getFieldDecorator('postalCode', { initialValue: data && data.postalCode })(
            <Input/>
          )}
        </FormItem>

        <FormItem label={<FormattedMessage id="userId" defaultMessage="User ID"/>} modal>
          {getFieldDecorator('userId', { initialValue: data ? data.userId : [] })(
            <TagControl label={<FormattedMessage id="newUserId" defaultMessage="New user ID"/>} removeAll={true}/>
          )}
        </FormItem>
      </Form>
    </React.Fragment>
  );
};

const mapContextToProps = ({ userTypes, countries }) => ({ userTypes, countries });

export default withContext(mapContextToProps)(ContactForm);