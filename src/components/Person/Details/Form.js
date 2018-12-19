import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Input } from 'antd';

import { createPerson, updatePerson } from '../../../api/grbio.person';
import formValidationWrapper from '../../hoc/formValidationWrapper';
import withContext from '../../hoc/withContext';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 8 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 16 }
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

class PersonForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    // if (this.props.data && !this.props.form.isFieldsTouched()) {
    //   return;
    // }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.props.person) {
          createPerson(values)
            .then(response => this.props.onSubmit(response.data))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updatePerson({ ...this.props.person, ...values })
            .then(() => this.props.onSubmit())
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { person, handleEmail } = this.props;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} layout={'vertical'}>
          <FormItem {...formItemLayout} label={<FormattedMessage id="firstName" defaultMessage="Fist name"/>}>
            {getFieldDecorator('firstName', {
              initialValue: person && person.firstName,
              rules: [{
                required: true,
                message: <FormattedMessage id="provide.firstName" defaultMessage="Please provide first name"/>
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="email" defaultMessage="Email"/>}
          >
            {getFieldDecorator('email', {
              initialValue: person && person.email,
              rules: [{
                required: true,
                message: <FormattedMessage id="provide.email" defaultMessage="Please provide an email"/>
              }, {
                validator: handleEmail
              }]
            })(<Input/>)}
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              {person ?
                <FormattedMessage id="edit" defaultMessage="Edit"/> :
                <FormattedMessage id="create" defaultMessage="Create"/>
              }
            </Button>
          </FormItem>
        </Form>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

const WrappedPersonForm = Form.create()(withContext(mapContextToProps)(formValidationWrapper(PersonForm)));
export default WrappedPersonForm;