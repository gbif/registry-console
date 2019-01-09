import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { search, deleted, nonPublishing } from '../../api/installation';
import { standardColumns } from './columns';
import { ItemHeader } from '../common';
import PermissionWrapper from '../hoc/PermissionWrapper';
import Paper from './Paper';

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
const typeSearch = <FormattedMessage id="listType.search" defaultMessage="Search"/>;
const typeDeleted = <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>;
const typeNonPublishing = <FormattedMessage id="listType.servingNoDatasets" defaultMessage="Serving no datasets"/>;
const searchTitle = <FormattedMessage id="menu.installation.search" defaultMessage="Search installations"/>;
const deletedTitle = <FormattedMessage id="menu.installation.deleted" defaultMessage="Deleted installations"/>;
const nonPublishingTitle = <FormattedMessage id="menu.installation.installationNoDataset" defaultMessage="Serving no datasets installations"/>;

export const InstallationSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={search}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeSearch]} pageTitle={title} listTitle={searchTitle}>
          <PermissionWrapper uuids={[]} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']} createType="installation">
            <Link to="/installation/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </PermissionWrapper>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};

export const InstallationDeleted = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={deleted}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeDeleted]} pageTitle={title} listTitle={deletedTitle}/>
        <Paper padded>
          <DataTable {...props} columns={columns}/>
        </Paper>
      </React.Fragment>
    }/>;
};

export const InstallationNonPublishing = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={nonPublishing}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeNonPublishing]} pageTitle={title} listTitle={nonPublishingTitle}/>
        <Paper padded>
          <DataTable {...props} columns={columns}/>
        </Paper>
      </React.Fragment>
    }/>;
};