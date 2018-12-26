import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Input, Select, Checkbox, Col, Row } from 'antd';
import injectSheet from 'react-jss';

import { updateUser, getRoles } from '../../../api/user';
import formValidationWrapper from '../../hoc/formValidationWrapper';
import withContext from '../../hoc/withContext';
import { FormItem } from '../../widgets';

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

class UserForm extends Component {
  state = {
    roles: []
  };

  componentDidMount() {
    getRoles().then(response => {
      this.setState({ roles: response.data });
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // if (this.props.organization && !this.props.form.isFieldsTouched()) {
    //   return;
    // }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        updateUser({ ...this.props.user, ...values })
          .then(() => this.props.onSubmit())
          .catch(error => {
            this.props.addError({ status: error.response.status, statusText: error.response.data });
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { user, countries, handleEmail, classes } = this.props;
    const { roles } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label={<FormattedMessage id="userName" defaultMessage="Username"/>}
            helpText={
              <FormattedMessage
                id="extra.userName"
                defaultMessage="You can log in using a username or an email address."
              />
            }
          >
            {getFieldDecorator('userName', { initialValue: user && user.userName })(
              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="firstName" defaultMessage="First name"/>}>
            {getFieldDecorator('firstName', { initialValue: user && user.firstName })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}>
            {getFieldDecorator('lastName', { initialValue: user && user.lastName })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
            {getFieldDecorator('email', {
              initialValue: user && user.email,
              rules: [{
                validator: handleEmail
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
            {getFieldDecorator('settings.country', { initialValue: user ? user.settings.country : undefined })(
              <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
                {countries.map(country => (
                  <Option value={country} key={country}>
                    <FormattedMessage id={`country.${country}`}/>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="roles" defaultMessage="Roles"/>}>
            {getFieldDecorator('roles', { initialValue: user && user.roles })(
              <CheckboxGroup className={classes.customGroup} options={roles}/>
            )}
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="edit" defaultMessage="Edit"/>
              </Button>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ countries, addError }) => ({ countries, addError });

const WrappedOrganizationForm = Form.create()(withContext(mapContextToProps)(formValidationWrapper(injectSheet(styles)(UserForm))));
export default WrappedOrganizationForm;