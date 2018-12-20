import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DataTable from '../DataTable';
import DataQuery from '../DataQuery';
import { search, deleted, nonPublishing } from '../../api/installation';
import { standardColumns } from './columns';
import { ItemHeader } from '../widgets';
import PermissionWrapper from '../hoc/PermissionWrapper';

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
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeSearch]} pageTitle={title}>
          <PermissionWrapper uid={[]} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']} createType="installation">
            <Link to="/installation/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </PermissionWrapper>
        </ItemHeader>
        <DataTable {...props} columns={columns} searchable/>
      </React.Fragment>
    }/>;
};

export const InstallationDeleted = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={deleted}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeDeleted]} pageTitle={title}/>
        <DataTable {...props} columns={columns}/>
      </React.Fragment>
    }/>;
};

export const InstallationNonPublishing = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={nonPublishing}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeNonPublishing]} pageTitle={title}/>
        <DataTable {...props} columns={columns}/>
      </React.Fragment>
    }/>;
};