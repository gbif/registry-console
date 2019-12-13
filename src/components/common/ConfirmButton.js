import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon, Popconfirm } from 'antd';
import PropTypes from 'prop-types';

/**
 * A peace of reusable code for button with confirmation
 * @param title - title of confirmation popup
 * @param btnText - text for button|link; required if type is not an 'icon'
 * @param onConfirm - confirmation callback
 * @param type - optional parameter to display confirm content as button|link|icon
 * @param iconType - required parameter for the type 'icon', value should be provided as an Ant icon type
 * @returns {*}
 * @constructor
 */
const ConfirmButton = ({ title, btnText, onConfirm, type }) => {
  const getElement = () => {
    switch (type) {
      case 'link':
        return (
          <Button htmlType="button" className="btn-link" type="primary" ghost={true}>
            {btnText}
          </Button>
        );
      case 'danger':
          return (
            <Button type="danger">
              {btnText}
            </Button>
          );
      case 'icon':
        return <Icon type="delete" />;
      default:
        return (
          <Button htmlType="button">
            {btnText}
          </Button>
        );
    }
  };

  return (
    <Popconfirm
      placement="bottomRight"
      title={title}
      onConfirm={onConfirm}
      okText={<FormattedMessage id="yes" defaultMessage="Yes"/>}
      cancelText={<FormattedMessage id="no" defaultMessage="No"/>}
    >
      {getElement()}
    </Popconfirm>
  );
};

ConfirmButton.defaultProps = {
  type: 'button'
};

ConfirmButton.propTypes = {
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  onConfirm: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['link', 'icon', 'button', 'danger']),
  btnText: function(props, propName) {
    if ((props['type'] !== 'icon' && !props[propName])) {
      return new Error('Please provide a button text');
    }
  },
  iconType: function(props, propName) {
    if ((props['type'] === 'icon' && !props[propName])) {
      return new Error('Please provide an icon type');
    }
  }
};

export default ConfirmButton;