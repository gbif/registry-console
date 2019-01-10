import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Popconfirm } from 'antd';
import PropTypes from 'prop-types';

/**
 * A peace of reusable code for button with confirmation
 * @param title - title of confirmation popup
 * @param btnText - text for button
 * @param onConfirm - confirmation callback
 * @param link - optional boolean parameter to add styles for button to look like a link
 * @returns {*}
 * @constructor
 */
const ConfirmButton = ({ title, btnText, onConfirm, link }) => {
  return (
    <Popconfirm
      placement="bottomRight"
      title={title}
      onConfirm={onConfirm}
      okText={<FormattedMessage id="yes" defaultMessage="Yes"/>}
      cancelText={<FormattedMessage id="no" defaultMessage="No"/>}
    >
      {link ? (
        <Button htmlType="button" className="btn-link" type="primary" ghost={true}>
          {btnText}
        </Button>
      ) : (
        <Button htmlType="button">
          {btnText}
        </Button>
      )}
    </Popconfirm>
  );
};

ConfirmButton.propTypes = {
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  btnText: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  onConfirm: PropTypes.func.isRequired,
  link: PropTypes.bool
};

export default ConfirmButton;