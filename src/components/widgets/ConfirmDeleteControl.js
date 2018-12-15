import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Popconfirm } from 'antd';

const ConfirmDeleteControl = ({ title, onConfirm }) => {
  return (
    <Popconfirm
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

export default ConfirmDeleteControl;