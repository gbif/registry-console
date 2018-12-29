import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DataTable from '../widgets/DataTable';
import DataQuery from '../DataQuery';
import { search, deleted, pending, nonPublishing } from '../../api/organization';
import { standardColumns } from './columns';
import { ItemHeader } from '../widgets';
import PermissionWrapper from '../hoc/PermissionWrapper';
import Paper from './Paper';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '400px',
    render: (text, record) => <Link to={`/organization/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];
const title = { id: 'title.organizations', defaultMessage: 'Organizations | GBIF Registry' };
const listName = <FormattedMessage id="organizations" defaultMessage="Organizations"/>;
const typeSearch = <FormattedMessage id="listType.search" defaultMessage="Search"/>;
const typeDeleted = <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>;
const typePending = <FormattedMessage id="listType.pending" defaultMessage="Pending"/>;
const typeNonPublishing = <FormattedMessage id="listType.nonPublishingOrganizations" defaultMessage="Non publishing organizations"/>;

export const OrganizationSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={search}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeSearch]} pageTitle={title}>
          <PermissionWrapper uid={[]} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']} createType="organization">
            <Link to="/organization/create" className="ant-btn ant-btn-primary">
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

export const OrganizationDeleted = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={deleted}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeDeleted]} pageTitle={title}/>
        <Paper padded>
          <DataTable {...props} columns={columns}/>
        </Paper>
      </React.Fragment>
    }/>;
};

export const OrganizationPending = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={pending}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typePending]} pageTitle={title}/>
        <Paper padded>
          <DataTable {...props} columns={columns}/>
        </Paper>
      </React.Fragment>
    }/>;
};

export const OrganizationNonPublishing = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={nonPublishing}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeNonPublishing]} pageTitle={title}/>
        <Paper padded>
          <DataTable {...props} columns={columns}/>
        </Paper>
      </React.Fragment>
    }/>;
};

