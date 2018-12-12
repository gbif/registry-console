import React from 'react';
import { notification } from 'antd';

export default WrappedComponent => {
  return class extends React.Component {
    showNotification = (type, message, description) => {
      notification[type]({
        message,
        description
      });
    };

    render() {
      return <WrappedComponent showNotification={this.showNotification} {...this.props} />;
    }
  }
};