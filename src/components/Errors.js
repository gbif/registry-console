import React from 'react';
import { connect } from 'react-redux';
import { clearErrors } from '../actions/errors';
import { message } from 'antd';
import { injectIntl } from 'react-intl';

class Errors extends React.Component {
  componentDidUpdate() {
    const { errors, intl } = this.props;
    if (errors.length > 0) {
      const error = errors[0];
      const errorTitle = intl.formatMessage({ id: 'error.title', defaultMessage: 'An error occurred' });
      // Preparing error message for the cases when it contains HTML tags
      const preparedText = error.statusText ? error.statusText
        .replace(/<\/li>/g, '; ')
        .replace(/<\/?[^>]+(>|$)/g, '') : '';

      message.error(preparedText ? <span><b>{errorTitle}:</b> {preparedText}</span> : errorTitle);
      clearErrors();
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  errors: state.errors
});

const mapDispatchToProps = {
  clearErrors: clearErrors
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Errors));