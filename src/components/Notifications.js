import React from 'react';
import { notification } from 'antd';
import { injectIntl } from 'react-intl';

// Wrappers
import withContext from './hoc/withContext';

/**
 * A component responsible to the feedback to a user via Ant notifications
 *
 * It takes list of notifications from the ContextProvider and displays it to a user removing notifications after that
 * Does not take any configuration props, only helpers from the ContextProvider
 */
class Notifications extends React.Component {
  componentDidUpdate() {
    const { notifications, intl, clearNotifications } = this.props;
    if (notifications.length === 0) {
      return;
    }

    for (const item of notifications) {
      const title = item.status < 300 ?
        intl.formatMessage({ id: 'success', defaultMessage: 'Success' }) :
        intl.formatMessage({ id: 'error', defaultMessage: 'Error' });

      const defaultText = intl.formatMessage({ id: 'error.title', defaultMessage: 'An error occurred' });

      // Preparing error message for the cases when it contains HTML tags
      const isStringMessage = typeof item.statusText === 'string';
      const preparedText = isStringMessage ? item.statusText
        .replace(/<\/li>/g, '; ')
        .replace(/<\/?[^>]+(>|$)/g, '') : '';

      if (!isStringMessage) {
        console.error(item.statusText);
      }

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