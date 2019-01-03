import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Popconfirm } from 'antd';
import PropTypes from 'prop-types';

/**
 * A simple widget to represent a button with a confirmation popup
 * @param title - text of confirmation popup
 * @param onConfirm - on confirm callback
 * @returns {*}
 * @constructor
 */
const ConfirmDeleteControl = ({ title, onConfirm }) => {
  return (
    <Popconfirm
      placement="topRight"
      title={title}
      onConfirm={onConfirm}
      okText={<FormattedMessage id="yes" defaultMessage="Yes"/>}
      cancelText={<FormattedMessage id="no" defaultMessage="No"/>}
    >
      <Button htmlType="button" className="btn-link" type="primary" ghost={true}>
        <FormattedMessage id="delete" defaultMessage="Delete"/>
      </Button>
    </Popconfirm>
  );
};

ConfirmDeleteControl.propTypes = {
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default ConfirmDeleteControl;