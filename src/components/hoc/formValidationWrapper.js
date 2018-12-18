import React from 'react';
import { isEmail, isURL, isMobilePhone } from 'validator';

export default WrappedComponent => {
  return class extends React.Component {

    handleEmail = (rule, value, callback) => {
      if (Array.isArray(value)) {
        const isValid = value.every(item => item && isEmail(item));
        if (!isValid) {
          callback(this.props.intl.formatMessage({
            id: 'invalid.emails',
            defaultMessage: 'One or more emails are invalid'
          }));
        }
      } else if (value && !isEmail(value)) {
        callback(this.props.intl.formatMessage({
          id: 'invalid.email',
          defaultMessage: 'Email is invalid'
        }));
      }
      callback();
    };

    handlePhone = (rule, value, callback) => {
      if (Array.isArray(value)) {
        const isValid = value.every(item => item && isMobilePhone(item));
        if (!isValid) {
          callback(this.props.intl.formatMessage({
            id: 'invalid.phones',
            defaultMessage: 'One or more phone are invalid'
          }));
        }
      } else if (value && !isMobilePhone(value)) {
        callback(this.props.intl.formatMessage({
          id: 'invalid.phone',
          defaultMessage: 'Phone is invalid'
        }));
      }
      callback();
    };

    handleHomepage = (rule, value, callback) => {
      if (Array.isArray(value)) {
        const isValid = value.every(item => item && isURL(item));
        if (!isValid) {
          callback(this.props.intl.formatMessage({
            id: 'invalid.homepages',
            defaultMessage: 'One or more homepages are invalid'
          }));
        }
      } else if (value && !isURL(value)) {
        callback(this.props.intl.formatMessage({
          id: 'invalid.homepage',
          defaultMessage: 'Homepage is invalid'
        }));
      }
      callback();
    };

    handleUrl = (rule, value, callback) => {
      if (value && !isURL(value)) {
        callback(this.props.intl.formatMessage({
          id: 'invalid.url',
          defaultMessage: 'Url is invalid'
        }));
      }
      callback();
    };

    render() {
      return <WrappedComponent
        handleEmail={this.handleEmail}
        handlePhone={this.handlePhone}
        handleHomepage={this.handleHomepage}
        handleUrl={this.handleUrl}
        {...this.props}
      />;
    }
  };
};