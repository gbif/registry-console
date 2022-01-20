import React from "react";
import { FormattedMessage } from "react-intl";
// import { Form } from '@ant-design/compatible';
// import '@ant-design/compatible/assets/index.css';
import { Checkbox, Input, Select, Form } from "antd";
import PropTypes from "prop-types";

// Wrappers
import withContext from "../../../../hoc/withContext";
// Components
import { FormItem, TagControl } from "../../../index";
// Helpers
import {
  validateEmail,
  validatePhone,
  validateUrl,
} from "../../../../util/validators";

const Option = Select.Option;

const ContactForm = (props) => {
  const { contact, countries, userTypes, form } = props;

  return (
    <React.Fragment>
      <Form form={form} initialValues={contact}>
        <FormItem
          name="type"
          label={<FormattedMessage id="type" defaultMessage="Type" />}
        >
          <Select
            placeholder={
              <FormattedMessage
                id="select.type"
                defaultMessage="Select a type"
              />
            }
          >
            {userTypes.map((userType) => (
              <Option value={userType} key={userType}>
                <FormattedMessage id={`contactType.${userType}`} />
              </Option>
            ))}
          </Select>
        </FormItem>

        <FormItem
          name="primary"
          valuePropName="checked"
          label={<FormattedMessage id="primary" defaultMessage="Primary" />}
          helpText={
            <FormattedMessage
              id="help.primaryCheckboxTip"
              defaultMessage="Indicates that the contact is the primary contact for the given type"
            />
          }
        >
          <Checkbox />
        </FormItem>

        <FormItem
          name="firstName"
          label={
            <FormattedMessage id="firstName" defaultMessage="First name" />
          }
        >
          <Input />
        </FormItem>

        <FormItem
          name="lastName"
          label={<FormattedMessage id="lastName" defaultMessage="Last name" />}
        >
          <Input />
        </FormItem>

        <FormItem
          name="position"
          initialValue={[]}
          label={<FormattedMessage id="position" defaultMessage="Position" />}
        >
          <TagControl
            label={
              <FormattedMessage
                id="newPosition"
                defaultMessage="New position"
              />
            }
            removeAll={true}
          />
        </FormItem>

        <FormItem
          name="description"
          label={
            <FormattedMessage id="description" defaultMessage="Description" />
          }
        >
          <Input />
        </FormItem>

        <FormItem
          name="email"
          initialValue={[]}
          rules={[
            {
              validator: validateEmail(
                <FormattedMessage
                  id="invalid.email"
                  defaultMessage="Email is invalid"
                />
              ),
            },
          ]}
          label={<FormattedMessage id="email" defaultMessage="Email" />}
        >
          <TagControl
            label={
              <FormattedMessage id="newEmail" defaultMessage="New email" />
            }
            removeAll={true}
          />
        </FormItem>

        <FormItem
        name="phone"
        initialValue={[]}
            rules={[
              {
                validator: validatePhone(
                  <FormattedMessage
                    id="invalid.phone"
                    defaultMessage="Phone is invalid"
                  />
                ),
              },
            ]}
          label={<FormattedMessage id="phone" defaultMessage="Phone" />}
        >
         <TagControl
              label={
                <FormattedMessage id="newPhone" defaultMessage="New phone" />
              }
              removeAll={true}
            />
        </FormItem>

        <FormItem
        name="homepage"
        initialValue={[]}
            rules={[
              {
                validator: validateUrl(
                  <FormattedMessage
                    id="invalid.homepage"
                    defaultMessage="Homepage is invalid"
                  />
                ),
              },
            ]}
          label={<FormattedMessage id="homepage" defaultMessage="Homepage" />}
        >
          <TagControl
              label={
                <FormattedMessage
                  id="newHomepage"
                  defaultMessage="New homepage"
                />
              }
              removeAll={true}
            />
        </FormItem>

        <FormItem
        name="organization"
          label={
            <FormattedMessage id="organization" defaultMessage="Organization" />
          }
        >
          <Input />
        </FormItem>

        <FormItem
        name="address"
        initialValue= {[]}
          label={<FormattedMessage id="address" defaultMessage="Address" />}
        >
          <TagControl
              label={
                <FormattedMessage
                  id="newAddress"
                  defaultMessage="New address"
                />
              }
              removeAll={true}
            />
        </FormItem>

        <FormItem name="city" label={<FormattedMessage id="city" defaultMessage="City" />}>
        <Input />
        </FormItem>

        <FormItem
        name="province"
          label={<FormattedMessage id="province" defaultMessage="Province" />}
        >
          <Input />
        </FormItem>

        <FormItem
        name="country"
          label={<FormattedMessage id="country" defaultMessage="Country" />}
        >
         <Select
              placeholder={
                <FormattedMessage
                  id="select.country"
                  defaultMessage="Select a country"
                />
              }
            >
              {countries.map((country) => (
                <Option value={country} key={country}>
                  <FormattedMessage id={`country.${country}`} />
                </Option>
              ))}
            </Select>
        </FormItem>

        <FormItem
        name="postalCode"
          label={
            <FormattedMessage id="postalCode" defaultMessage="Postal code" />
          }
        >
         <Input />
        </FormItem>

        <FormItem
        name="userId"
        initialValue={[]}
          label={<FormattedMessage id="userId" defaultMessage="User ID" />}
        >
          <TagControl
              label={
                <FormattedMessage id="newUserId" defaultMessage="New user ID" />
              }
              removeAll={true}
            />
        </FormItem>
      </Form>
    </React.Fragment>
  );
};

ContactForm.propTypes = {
  contact: PropTypes.object,
  form: PropTypes.object.isRequired,
};

const mapContextToProps = ({ userTypes, countries }) => ({
  userTypes,
  countries,
});

export default withContext(mapContextToProps)(ContactForm);
