import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Button, Alert, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

/**
 * A modal window with login form
 * @param invalid - if form is valid or not, passed from parent
 * @param onLogin - a callback function passed from parent
 */

const NormalLoginForm = (props) => {
    const { invalid, intl } = props;
    const placeholderUsername = intl.formatMessage({ id: 'placeholder.username', defaultMessage: 'Username' });
    const placeholderPassword = intl.formatMessage({ id: 'placeholder.password', defaultMessage: 'Password' });


    return (
        <Form onFinish={props.onLogin} id="loginForm">
          {invalid && (
            <FormItem>
              <Alert
                type="error"
                message={<FormattedMessage id="invalid.credentials" defaultMessage="Invalid username or password"/>}
              />
            </FormItem>
          )}
  
          <FormItem name="userName" rules={[{
                required: true,
                message: <FormattedMessage id="provide.userName" defaultMessage="Please input your username!"/>
              }]} >
           <Input
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder={placeholderUsername}
                autoComplete="username"
              />
          </FormItem>
  
          <FormItem name='password' rules={[{
                required: true,
                message: <FormattedMessage id="provide.password" defaultMessage="Please input your Password!"/>
              }]}>
            <Input
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder={placeholderPassword}
                autoComplete="current-password"
              />
          </FormItem>
  
          <FormItem style={{ width: '100%', marginTop: '16px' }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              <FormattedMessage id="logIn" defaultMessage="Log in"/>
            </Button>
          </FormItem>
        </Form>
      );
    
}




NormalLoginForm.propTypes = {
  invalid: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired
};

export default injectIntl(NormalLoginForm)