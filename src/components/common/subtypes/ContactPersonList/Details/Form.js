import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Checkbox, Input, Select, Form } from 'antd';
import PropTypes from 'prop-types';

// Wrappers
import withContext from '../../../../hoc/withContext';
// Components
import { FormItem, TagControl, UserIds } from '../../../index';
// Helpers
import { validateEmail, validatePhone } from '../../../../util/validators';

const Option = Select.Option;

const ContactForm = props => {
  const { contact, form, countries } = props;

  return (
    <React.Fragment>
      <Form form={form} initialValues={contact}>

        <FormItem
        name='primary'
        valuePropName='checked'
          label={<FormattedMessage id="primary" defaultMessage="Primary"/>}
          helpText={
            <FormattedMessage
              id="help.primaryCheckboxTip"
              defaultMessage="Indicates that the contact is the primary contact for the given type"
            />
          }
        >
          <Checkbox/>
        </FormItem>

        <FormItem name='firstName'  label={<FormattedMessage id="firstName" defaultMessage="First name"/>}>
        <Input/>
        </FormItem>

        <FormItem name='lastName'  label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}>
        <Input/>
        </FormItem>

        <FormItem name='position' initialValue={[]} label={<FormattedMessage id="position" defaultMessage="Position"/>}>
        <TagControl
              label={<FormattedMessage id="newPosition" defaultMessage="New position"/>}
              removeAll={true}
            />
        </FormItem>

        <FormItem name='notes'  label={<FormattedMessage id="notes" defaultMessage="Notes"/>}>
        <Input/>
        </FormItem>

        <FormItem name='email' initialValue={[]}
          validateTrigger={['onChange', 'onBlur']}
            rules= {[{
              validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid"/>)
            }]} label={<FormattedMessage id="email" defaultMessage="Email"/>}>
           <TagControl label={<FormattedMessage id="newEmail" defaultMessage="New email"/>} removeAll={true}/>
        </FormItem>

        <FormItem name='phone' initialValue={[]}
            rules={[{
              validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid"/>)
            }]} label={<FormattedMessage id="phone" defaultMessage="Phone"/>}>
          <TagControl label={<FormattedMessage id="newPhone" defaultMessage="New phone"/>} removeAll={true}/>
        </FormItem>

        <FormItem name='address' initialValue={ []} label={<FormattedMessage id="address" defaultMessage="Address"/>}>
        <TagControl label={<FormattedMessage id="newAddress" defaultMessage="New address"/>} removeAll={true}/>
        </FormItem>

        <FormItem name='city' label={<FormattedMessage id="city" defaultMessage="City"/>}>
        <Input/>
        </FormItem>

        <FormItem name='province'  label={<FormattedMessage id="province" defaultMessage="Province"/>}>
        <Input/>
        </FormItem>

        <FormItem name='country' label={<FormattedMessage id="country" defaultMessage="Country"/>}>
        <Select showSearch={true} placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
              {countries.map(country => (
                <Option value={country} key={country}>
                  <FormattedMessage id={`country.${country}`}/>
                </Option>
              ))}
            </Select>
        </FormItem>

        <FormItem name='postalCode'  label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
        <Input/>
        </FormItem>

        {/* <FormItem label={<FormattedMessage id="userIds" defaultMessage="User ID"/>}>
          {getFieldDecorator('userIds', { initialValue: contact ? contact.userIds : [] })(
            <TagControl label={<FormattedMessage id="newUserId" defaultMessage="New user ID"/>} removeAll={true}/>
          )}
        </FormItem> */}

        <FormItem name='userIds' initialValue= {[] }label={<FormattedMessage id="userIds" defaultMessage="User IDs" />}
                  helpText={<FormattedMessage id="help.collection.userIds" />}
                  >
          <UserIds />
        </FormItem>

        <FormItem name='taxonomicExpertise' initialValue= {[] } label={<FormattedMessage id="taxonomicExpertise" defaultMessage="Taxonomic expertise"/>}>
        <TagControl label={<FormattedMessage id="newtaxonomicExpertise" defaultMessage="Taxonomic expertise"/>} removeAll={true}/>
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