import React from 'react';
import { FormattedMessage } from 'react-intl';

// Components
import { DateValue } from '../common';

export const standardColumns = [
  {
    title: <FormattedMessage id="created" defaultMessage="Created"/>,
    dataIndex: 'created',
    width: '250px',
    render: text => <DateValue value={text}/>
  },
  {
    title: <FormattedMessage id="createdBy" defaultMessage="Created by"/>,
    dataIndex: 'createdBy',
    width: '200px'
  },
  {
    title: <FormattedMessage id="modified" defaultMessage="Modified"/>,
    dataIndex: 'modified',
    width: '250px',
    render: text => <DateValue value={text}/>
  }
];