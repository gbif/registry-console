import React from 'react';
import { Modal, Form, Input, Select, Checkbox } from 'antd';
import { FormattedMessage } from 'react-intl';

import { AppContext } from '../../App';
import { arrayToString } from '../../../api/util/helpers';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 18 }
  },
  style: {
    paddingBottom: 0,
    marginBottom: '5px'
  }
};

const ContactCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, data } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewContact" defaultMessage="Create a new contact"/>}
          okText={
            data ?
              <FormattedMessage id="edit" defaultMessage="Edit"/> :
              <FormattedMessage id="create" defaultMessage="Create"/>
            }
          onCancel={onCancel}
          onOk={onCreate}
        >
          <p style={{ color: '#999', marginBottom: '10px' }}>
            <small>
              <FormattedMessage
                id="editFormInstructions"
                defaultMessage="Multi value fields position, email, phone, homepage and address are indicated by * and use the semicolon as the delimiter."
              />
            </small>
          </p>
          <Form layout="vertical">
            <AppContext.Consumer>
              {({ userTypes }) => (
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="type" defaultMessage="Type"/>}
                >
                  {getFieldDecorator('type', { initialValue: data && data.type })(
                    <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}>
                      {userTypes.map(userType => (
                        <Option value={userType.code} key={userType.code}>{userType.name}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              )}
            </AppContext.Consumer>
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
              {getFieldDecorator('position', {
                initialValue: data && arrayToString(data.position),
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.position" defaultMessage="Please provide a position"/>
                }]
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="description" defaultMessage="Description"/>}
            >
              {getFieldDecorator('description', { initialValue: data && data.description })(<Input/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="Email">
              {getFieldDecorator('email', {
                initialValue: data && arrayToString(data.email),
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.email" defaultMessage="Please provide an email"/>
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
                initialValue: data && arrayToString(data.phone),
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.phone" defaultMessage="Please provide a phone"/>
                }]
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}
            >
              {getFieldDecorator('homepage', {
                initialValue: data && arrayToString(data.homepage),
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.homepage" defaultMessage="Please provide a homepage"/>
                }]
              })(
                <Input/>
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
              {getFieldDecorator('address', {
                initialValue: data && arrayToString(data.address),
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.address" defaultMessage="Please provide an address"/>
                }]
              })(
                <Input/>
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
            <AppContext.Consumer>
              {({ countries }) => (
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="country" defaultMessage="Country"/>}
                >
                  {getFieldDecorator('country', { initialValue: data && data.country })(
                    <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
                      {countries.map(country => (
                        <Option value={country.code} key={country.code}>{country.name}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              )}
            </AppContext.Consumer>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}
            >
              {getFieldDecorator('postalCode', { initialValue: data && data.postalCode })(<Input/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="userId" defaultMessage="User ID"/>}
              style={{ marginBottom: 0, paddingBottom: 0 }}
            >
              {getFieldDecorator('userId', {
                initialValue: data && arrayToString(data.userId),
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.userId" defaultMessage="Please provide a user ID"/>
                }]
              })(
                <Input/>
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

export default ContactCreateForm;