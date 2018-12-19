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
import { ItemHeader } from '../widgets';
import PermissionWrapper from '../hoc/PermissionWrapper';

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
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeSearch]} pageTitle={title}>
          <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
            <Link to="/dataset/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </PermissionWrapper>
        </ItemHeader>
        <DataTable {...props} columns={columns} searchable/>
      </React.Fragment>
    }/>;
};

export const DatasetDeleted = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchDeletedDatasets}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeDeleted]} pageTitle={title}/>
        <DataTable {...props} columns={columns}/>
      </React.Fragment>
    }/>;
};

export const DatasetDuplicate = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchDuplicateDatasets}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeDuplicate]} pageTitle={title}/>
        <DataTable {...props} columns={columns}/>
      </React.Fragment>
    }/>;
};

export const DatasetConstituent = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchConstituentDatasets}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeConstituent]} pageTitle={title}/>
        <DataTable {...props} columns={columns}/>
      </React.Fragment>
    }/>;
};

export const DatasetWithNoEndpoint = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchDatasetsWithNoEndpoint}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeWithNoEndpoint]} pageTitle={title}/>
        <DataTable {...props} columns={columns}/>
      </React.Fragment>
    }/>;
};