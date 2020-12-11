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
      let title = item.status < 300 ?
        intl.formatMessage({ id: 'success', defaultMessage: 'Success' }) :
        intl.formatMessage({ id: 'error', defaultMessage: 'Error' });

      if (item.status === 403) {
        title = intl.formatMessage({ id: 'unauthorized', defaultMessage: 'Unauthorized' });
      }
      const defaultText = intl.formatMessage({ id: 'error.title', defaultMessage: 'An error occurred' });

      // get message from string or object
      let description = item.statusText;
      if (typeof item.statusText === 'object') {
        description = item.statusText.error || description;
        description = item.statusText.message || description;
      }
      // remove tags
      var modifiedDescription = description.replace(/<[^>]+>/g, '');

      if (typeof modifiedDescription !== 'string') {
        console.error(item.statusText);
      }

      notification[item.type]({
        message: title,
        description: modifiedDescription || defaultText,
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