import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import DataTable from '../DataTable'
import DataQuery from '../DataQuery'
import { search, deleted, nonPublishing } from '../../api/installation'
import { standardColumns } from './columns'

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title" />,
    dataIndex: 'title',
    render: (text, record) => <Link to={`/installation/${record.key}`}>{text}</Link>,
  },
  ...standardColumns
];

export const InstallationSearch = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={search} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={columns} searchable/>} />
}

export const InstallationDeleted = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={deleted} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={columns} />} />
}

export const InstallationNonPublishing = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={nonPublishing} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={columns} />} />
}