import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Input, Select, Checkbox, Col, Row, Form } from 'antd';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

// APIs
import { updateUser, getRoles } from '../../../api/user';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FormItem } from '../../common';
// Helpers
import { validateEmail } from '../../util/validators';

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const styles = {
  customGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    '& .ant-checkbox-group-item': {
      flex: '50%',
      margin: 0
    }
  }
};

const UserForm = props => {
  const { user, countries, classes, onSubmit, onCancel, addError } = props;

  const [roles, setRoles] = useState([])
  const [form] = Form.useForm();
  useEffect(() => {
    getRoles().then(response => {
      setRoles(response.data)
    });
  }, [])


 const handleSubmit = (values) => {
         
        updateUser({ ...user, ...values })
          .then(() => onSubmit())
          .catch(error => {
            addError({ status: error.response.status, statusText: error.response.data });
          });
   
  };

    let initialValues = {...user};
    return (
      <React.Fragment>
        <Form onFinish={handleSubmit} form={form} initialValues={initialValues}>
          <FormItem
            name='userName'
            label={<FormattedMessage id="userName" defaultMessage="Username"/>}
            helpText={
              <FormattedMessage
                id="help.userName"
                defaultMessage="You can log in using a username or an email address."
              />
            }
          >
            <Input disabled={true}/>
          </FormItem>

          <FormItem name='email' rules={[{
                validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid"/>)
              }]} label={<FormattedMessage id="email" defaultMessage="Email"/>}>
            <Input/>
          </FormItem>

          <FormItem name='firstName' label={<FormattedMessage id="firstName" defaultMessage="First name"/>}>
            <Input/>
          </FormItem>

          <FormItem name='lastName' label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}>
            <Input/>
          </FormItem>

          <FormItem
            name={['settings', 'country']}
            label={<FormattedMessage id="country" defaultMessage="Country"/>}
            helpText={
              <FormattedMessage
                id="help.reportingPurposes"
                defaultMessage="This is used for reporting purposes"
              />
            }
          >
            <Select showSearch={true} placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
                {countries.map(country => (
                  <Option value={country} key={country}>
                    <FormattedMessage id={`country.${country}`}/>
                  </Option>
                ))}
              </Select>
          </FormItem>

          <FormItem name='roles' label={<FormattedMessage id="roles" defaultMessage="Roles"/>}>
            <CheckboxGroup className={classes.customGroup} options={roles}/>
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="save" defaultMessage="Save"/>
              </Button>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
}

UserForm.propTypes = {
  user: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ countries, addError }) => ({ countries, addError });

export default withContext(mapContextToProps)(injectSheet(styles)(UserForm));
