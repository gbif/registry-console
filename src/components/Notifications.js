import React from 'react';
import { notification } from 'antd';
import { injectIntl } from 'react-intl';

import withContext from './hoc/withContext';

class Notifications extends React.Component {
  componentDidUpdate() {
    const { notifications, intl, clearNotifications } = this.props;
    if (notifications.length === 0) {
      return;
    }

    for (const item of notifications) {
      const title = item.status === 200 ?
        intl.formatMessage({ id: 'success', defaultMessage: 'Success' }) :
        intl.formatMessage({ id: 'error', defaultMessage: 'Error' });

      const defaultText = intl.formatMessage({ id: 'error.title', defaultMessage: 'An error occurred' });

      // Preparing error message for the cases when it contains HTML tags
      const preparedText = item.statusText ? item.statusText
        .replace(/<\/li>/g, '; ')
        .replace(/<\/?[^>]+(>|$)/g, '') : '';

      notification[item.type]({
        message: title,
        description: preparedText || defaultText,
      });
    }

    clearNotifications();
  }

  render() {
    return null;
  }
}

const mapContextToProps = ({ notifications, clearNotifications }) => ({ notifications, clearNotifications });

export default withContext(mapContextToProps)(injectIntl(Notifications));