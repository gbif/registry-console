import React from 'react';
import { notification } from 'antd';
import { injectIntl } from 'react-intl';

import withContext from './hoc/withContext';

class Errors extends React.Component {
  componentDidUpdate() {
    const { errors, intl, clearErrors } = this.props;
    if (errors.length === 0) {
      return;
    }

    for (const error of errors) {
      const errorTitle = intl.formatMessage({ id: 'error.title', defaultMessage: 'An error occurred' });
      // Preparing error message for the cases when it contains HTML tags
      const preparedText = error.statusText ? error.statusText
        .replace(/<\/li>/g, '; ')
        .replace(/<\/?[^>]+(>|$)/g, '') : '';

      notification.error({
        message: `${error.status} ${errorTitle}`,
        description: preparedText,
      });
    }

    clearErrors();
  }

  render() {
    return null;
  }
}

const mapContextToProps = ({ errors, clearErrors }) => ({ errors, clearErrors });

export default withContext(mapContextToProps)(injectIntl(Errors));