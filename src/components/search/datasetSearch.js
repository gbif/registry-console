import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import {
  searchDatasets,
  searchDeletedDatasets,
  searchDuplicateDatasets,
  searchConstituentDatasets,
  searchDatasetsWithNoEndpoint
} from '../../api/dataset';
import { standardColumns } from './columns';
import { ItemHeader } from '../common';
import { HasRight, rights } from '../auth';
import Paper from './Paper';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '400px',
    render: (text, record) => <Link to={`/dataset/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];
const pageTitle = { id: 'title.datasets', defaultMessage: 'Datasets | GBIF Registry' };
const listName = <FormattedMessage id="datasets" defaultMessage="Datasets"/>;
const typeSearch = <FormattedMessage id="listType.search" defaultMessage="Search"/>;
const typeDeleted = <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>;
const typeDuplicate = <FormattedMessage id="listType.duplicate" defaultMessage="Duplicate"/>;
const typeConstituent = <FormattedMessage id="listType.constituent" defaultMessage="Constituent"/>;
const typeWithNoEndpoint = <FormattedMessage id="listType.withNoEndpoint" defaultMessage="With no endpoint"/>;
const searchTitle = <FormattedMessage id="menu.dataset.search" defaultMessage="Search dataset"/>;
const deletedTitle = <FormattedMessage id="menu.dataset.deleted" defaultMessage="Deleted dataset"/>;
const duplicateTitle = <FormattedMessage id="menu.dataset.duplicate" defaultMessage="Duplicate of dataset"/>;
const constituentTitle = <FormattedMessage id="menu.dataset.constituent" defaultMessage="Constituent datasets"/>;
const withNoEndpointTitle = <FormattedMessage id="menu.dataset.withNoEndpoint" defaultMessage="Datasets with no endpoint"/>;

export const DatasetSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchDatasets}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeSearch]} pageTitle={pageTitle} listTitle={searchTitle}>
          <HasRight rights={rights.CAN_ADD_DATASET}>
            <Link to="/dataset/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </HasRight>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};

export const DatasetDeleted = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchDeletedDatasets}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeDeleted]} pageTitle={pageTitle} listTitle={deletedTitle}/>
        <Paper padded>
          <DataTable {...props} columns={columns}/>
        </Paper>
      </React.Fragment>
    }/>;
};

export const DatasetDuplicate = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchDuplicateDatasets}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeDuplicate]} pageTitle={pageTitle} listTitle={duplicateTitle}/>
        <Paper padded>
          <DataTable {...props} columns={columns}/>
        </Paper>
      </React.Fragment>
    }/>;
};

export const DatasetConstituent = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchConstituentDatasets}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeConstituent]} pageTitle={pageTitle} listTitle={constituentTitle}/>
        <Paper padded>
          <DataTable {...props} columns={columns}/>
        </Paper>
      </React.Fragment>
    }/>;
};

export const DatasetWithNoEndpoint = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchDatasetsWithNoEndpoint}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeWithNoEndpoint]} pageTitle={pageTitle} listTitle={withNoEndpointTitle}/>
        <Paper padded>
          <DataTable {...props} columns={columns}/>
        </Paper>
      </React.Fragment>
    }/>;
};