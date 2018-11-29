import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import DataTable from '../DataTable'
import DataQuery from '../DataQuery'
import { search, deleted, nonPublishing } from '../../api/organization'
import { standardColumns } from './columns'

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title" />,
    dataIndex: 'title',
    render: (text, record) => <Link to={`/organization/${record.key}`}>{text}</Link>,
  },
  ...standardColumns
];

export const OrganizationSearch = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={search} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={columns} searchable/>} />
}

export const OrganizationDeleted = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={deleted} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={columns} />} />
}

export const OrganizationNonPublishing = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={nonPublishing} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={columns} />} />
}

