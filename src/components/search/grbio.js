import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import DataTable from '../DataTable'
import DataQuery from '../DataQuery'
import { collectionSearch, institutionSearch, personSearch } from '../../api/grbio'
import { standardColumns } from './columns'

const collectionColumns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name" />,
    dataIndex: 'name',
    render: (text, record) => <Link to={`/grbio/collection/${record.key}`}>{text}</Link>,
  },
  ...standardColumns
];

export const CollectionSearch = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={collectionSearch} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={collectionColumns} searchable />} />
}

const institutionColumns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name" />,
    dataIndex: 'name',
    render: (text, record) => <Link to={`/grbio/institution/${record.key}`}>{text}</Link>,
  },
  ...standardColumns
];

export const InstitutionSearch = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={institutionSearch} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={institutionColumns} searchable />} />
}

const personColumns = [
  {
    title: <FormattedMessage id="firstName" defaultMessage="Name" />,
    dataIndex: 'firstName',
    render: (text, record) => <Link to={`/grbio/person/${record.key}`}>{text}</Link>,
  },
  {
    title: <FormattedMessage id="email" defaultMessage="Email" />,
    dataIndex: 'email',
  },
  ...standardColumns
];

export const PersonSearch = ({initQuery={q:'', limit: 25, offset: 0}}) => {
  return <DataQuery 
    api={personSearch} 
    initQuery={initQuery} 
    render={props => <DataTable {...props} columns={personColumns} searchable />} />
}
