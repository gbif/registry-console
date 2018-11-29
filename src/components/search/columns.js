import React from 'react'
import { FormattedMessage, FormattedRelative } from 'react-intl'

export const standardColumns = [
  {
    title: <FormattedMessage id="created" defaultMessage="Created" />,
    dataIndex: 'created',
    width: "200px",
    render: text => <FormattedRelative value={text} />
  },
  {
    title: <FormattedMessage id="createdBy" defaultMessage="Created by" />,
    dataIndex: 'createdBy',
    width: "200px",
  },
  {
    title: <FormattedMessage id="modified" defaultMessage="Modified" />,
    dataIndex: 'modified',
    width: "200px",
    render: text => <FormattedRelative value={text} />
  }
];