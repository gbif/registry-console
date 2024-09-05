import React from 'react';
import { FormattedMessage } from 'react-intl';
import { PlusOutlined } from '@ant-design/icons';
import withWidth, { MEDIUM } from '../hoc/Width';
import { Button } from 'antd';

export const CreateMessage = withWidth()(({ width }) => {
  return <>
    {width > MEDIUM && <FormattedMessage id="createNew" defaultMessage="Create new" />}
    {width <= MEDIUM && <PlusOutlined />}
  </>
});

export const CreateButton = withWidth()(({ width, onClick = () => { } }) => {
  return <Button htmlType="button" size={width <= MEDIUM ? 'small' : 'middle'} type="primary" onClick={onClick}>
    <CreateMessage />
  </Button>
});

