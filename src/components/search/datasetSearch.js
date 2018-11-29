import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import DataTable from '../DataTable'
import DataQuery from '../DataQuery'
import { searchDatasets, searchDeletedDatasets, searchDuplicateDatasets, searchDatasetsWithNoEndpoint } from '../../api/dataset'
import { standardColumns } from './columns'

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title" />,
    dataIndex: 'title',
    render: (text, record) => <Link to={`/dataset/${record.key}`}>{text}</Link>,
  },
  ...standardColumns
];

export const DatasetSearch = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={searchDatasets} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={columns} searchable/>} />
}

export const DatasetDeleted = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={searchDeletedDatasets} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={columns} />} />
}

export const DatasetDuplicate = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={searchDuplicateDatasets} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={columns} />} />
}

export const DatasetWithNoEndpoint = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={searchDatasetsWithNoEndpoint} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={columns} />} />
}