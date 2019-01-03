import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Alert } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

/**
 * A modal window with login form
 * @param invalid - if form is valid or not, passed from parent
 * @param onLogin - a callback function passed from parent
 */
class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onLogin(values);
      }
    });
  };

  render() {
    const { invalid, intl } = this.props;
    const placeholderUsername = intl.formatMessage({ id: 'placeholder.username', defaultMessage: 'Username' });
    const placeholderPassword = intl.formatMessage({ id: 'placeholder.password', defaultMessage: 'Password' });
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} id="loginForm">
        {invalid && (
          <FormItem>
            <Alert
              type="error"
              message={<FormattedMessage id="invalid.credentials" defaultMessage="Invalid username or password"/>}
            />
          </FormItem>
        )}

        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{
              required: true,
              message: <FormattedMessage id="provide.userName" defaultMessage="Please input your username!"/>
            }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              placeholder={placeholderUsername}
              autoComplete="username"
            />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('password', {
            rules: [{
              required: true,
              message: <FormattedMessage id="provide.password" defaultMessage="Please input your Password!"/>
            }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder={placeholderPassword}
              autoComplete="current-password"
            />
          )}
        </FormItem>

        <FormItem style={{ width: '100%' }}>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(
            <Checkbox><FormattedMessage id="rememberMe" defaultMessage="Remember me"/></Checkbox>
          )}
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            <FormattedMessage id="logIn" defaultMessage="Log in"/>
          </Button>
        </FormItem>
      </Form>
    );
  }
}

NormalLoginForm.propTypes = {
  invalid: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired
};

const WrappedNormalLoginForm = Form.create()(injectIntl(NormalLoginForm));

export default WrappedNormalLoginForm;