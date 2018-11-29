import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import DataTable from '../DataTable'
import DataQuery from '../DataQuery'
import { search } from '../../api/user'

const columns = [
  {
    title: <FormattedMessage id="userName" defaultMessage="User name" />,
    dataIndex: 'userName',
    render: (text, record) => <Link to={`/user/${record.userName}`}>{text}</Link>,
  },
  {
    title: <FormattedMessage id="firstName" defaultMessage="First name" />,
    dataIndex: 'firstName',
  },
  {
    title: <FormattedMessage id="lastName" defaultMessage="Last name" />,
    dataIndex: 'lastName'
  },
  {
    title: <FormattedMessage id="email" defaultMessage="Email" />,
    dataIndex: 'email',
  },
];

export const UserSearch = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={search} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={columns} searchable/>} />
}

