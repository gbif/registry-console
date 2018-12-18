import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DataTable from '../DataTable';
import DataQuery from '../DataQuery';
import { search, deleted, nonPublishing } from '../../api/installation';
import { standardColumns } from './columns';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '400px',
    render: (text, record) => <Link to={`/installation/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];
const title = { id: 'title.installations', defaultMessage: 'Installations | GBIF Registry' };
const listName = <FormattedMessage id="installations" defaultMessage="Installations"/>;
const typeSearch = <FormattedMessage id="search" defaultMessage="Search"/>;
const typeDeleted = <FormattedMessage id="deleted" defaultMessage="Deleted"/>;
const typeNonPublishing = <FormattedMessage id="installations.nonPublishing" defaultMessage="Serving no datasets"/>;

export const InstallationSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={search}
    initQuery={initQuery}
    listType={[listName, typeSearch]}
    render={props => <DataTable {...props} columns={columns} title={title} searchable/>}
  />;
};

export const InstallationDeleted = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={deleted}
    initQuery={initQuery}
    listType={[listName, typeDeleted]}
    render={props => <DataTable {...props} columns={columns} title={title}/>}
  />;
};

export const InstallationNonPublishing = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={nonPublishing}
    initQuery={initQuery}
    listType={[listName, typeNonPublishing]}
    render={props => <DataTable {...props} columns={columns} title={title}/>}
  />;
};