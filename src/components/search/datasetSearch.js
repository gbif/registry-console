import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DataTable from '../DataTable';
import DataQuery from '../DataQuery';
import {
  searchDatasets,
  searchDeletedDatasets,
  searchDuplicateDatasets,
  searchConstituentDatasets,
  searchDatasetsWithNoEndpoint
} from '../../api/dataset';
import { standardColumns } from './columns';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '400px',
    render: (text, record) => <Link to={`/dataset/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];
const title = { id: 'title.datasets', defaultMessage: 'Datasets | GBIF Registry' };
const listName = <FormattedMessage id="datasets" defaultMessage="Datasets"/>;
const typeSearch = <FormattedMessage id="search" defaultMessage="Search"/>;
const typeDeleted = <FormattedMessage id="deleted" defaultMessage="Deleted"/>;
const typeDuplicate = <FormattedMessage id="duplicate" defaultMessage="'Duplicate"/>;
const typeConstituent = <FormattedMessage id="constituent" defaultMessage="Constituent"/>;
const typeWithNoEndpoint = <FormattedMessage id="withNoEdnpoint" defaultMessage="With no endpoint"/>;

export const DatasetSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchDatasets}
    initQuery={initQuery}
    listType={[listName, typeSearch]}
    render={props => <DataTable {...props} columns={columns} title={title} searchable/>}/>;
};

export const DatasetDeleted = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchDeletedDatasets}
    initQuery={initQuery}
    listType={[listName, typeDeleted]}
    render={props => <DataTable {...props} columns={columns} title={title}/>}/>;
};

export const DatasetDuplicate = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchDuplicateDatasets}
    initQuery={initQuery}
    listType={[listName, typeDuplicate]}
    render={props => <DataTable {...props} columns={columns} title={title}/>}/>;
};

export const DatasetConstituent = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchConstituentDatasets}
    initQuery={initQuery}
    listType={[listName, typeConstituent]}
    render={props => <DataTable {...props} columns={columns} title={title}/>}/>;
};

export const DatasetWithNoEndpoint = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchDatasetsWithNoEndpoint}
    initQuery={initQuery}
    listType={[listName, typeWithNoEndpoint]}
    render={props => <DataTable {...props} columns={columns} title={title}/>}/>;
};