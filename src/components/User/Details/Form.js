import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Input, Select, Checkbox } from 'antd';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';

import { updateUser, getRoles } from '../../../api/user';
import formValidationWrapper from '../../hoc/formValidationWrapper';
import { addError } from '../../../actions/errors';
import withContext from '../../hoc/withContext';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 24 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 24 }
  }
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};
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
        <Form onSubmit={this.handleSubmit} layout={'vertical'}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="userName" defaultMessage="Username"/>}
            extra={<FormattedMessage
              id="extra.userName"
              defaultMessage="You can log in using a username or an email address."
            />}
          >
            {getFieldDecorator('userName', { initialValue: user && user.userName })(
              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="firstName" defaultMessage="First name"/>}
          >
            {getFieldDecorator('firstName', { initialValue: user && user.firstName })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}
          >
            {getFieldDecorator('lastName', { initialValue: user && user.lastName })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="email" defaultMessage="Email"/>}
          >
            {getFieldDecorator('email', {
              initialValue: user && user.email,
              rules: [{
                validator: handleEmail
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="country" defaultMessage="Country"/>}
          >
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

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="roles" defaultMessage="Roles"/>}
          >
            {getFieldDecorator('roles', { initialValue: user && user.roles })(
              <CheckboxGroup className={classes.customGroup} options={roles}/>
            )}
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="update" defaultMessage="Update"/>
            </Button>
          </FormItem>
        </Form>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = { addError: addError };
const mapContextToProps = ({ countries }) => ({ countries });

const WrappedOrganizationForm = Form.create()(withContext(mapContextToProps)(connect(null, mapDispatchToProps)(formValidationWrapper(injectSheet(styles)(UserForm)))));
export default WrappedOrganizationForm;