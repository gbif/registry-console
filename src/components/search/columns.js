import React from 'react';
import { FormattedMessage } from 'react-intl';

// Components
import { FormattedRelativeDate } from '../common';

export const standardColumns = [
  {
    title: <FormattedMessage id="created" defaultMessage="Created"/>,
    dataIndex: 'created',
    width: '125px',
    render: text => <FormattedRelativeDate value={text}/>
  },
  {
    title: <FormattedMessage id="createdBy" defaultMessage="Created by"/>,
    dataIndex: 'createdBy',
    width: '200px'
  },
  {
    title: <FormattedMessage id="modified" defaultMessage="Modified"/>,
    dataIndex: 'modified',
    width: '125px',
    render: text => <FormattedRelativeDate value={text}/>
  }
];