import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import DataTable from '../widgets/DataTable';
import DataQuery from '../DataQuery';
import { collectionSearch } from '../../api/grbio.collection';
import { institutionSearch } from '../../api/grbio.institution';
import { personSearch } from '../../api/grbio.person';
import { standardColumns } from './columns';
import { ItemHeader } from '../widgets';
import PermissionWrapper from '../hoc/PermissionWrapper';
import Paper from './Paper';

const collectionsTitle = { id: 'title.collections', defaultMessage: 'Collections | GBIF Registry' };
const institutionsTitle = { id: 'title.institutions', defaultMessage: 'Institutions | GBIF Registry' };
const personsTitle = { id: 'title.persons', defaultMessage: 'Persons | GBIF Registry' };
const collectionsListName = <FormattedMessage id="collections" defaultMessage="Collections"/>;
const institutionsListName = <FormattedMessage id="institutions" defaultMessage="Institutions"/>;
const personsListName = <FormattedMessage id="persons" defaultMessage="Persons"/>;
const typeSearch = <FormattedMessage id="listType.search" defaultMessage="Search"/>;

const collectionColumns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    width: '400px',
    render: (text, record) => <Link to={`/grbio/collection/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const CollectionSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={collectionSearch}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[collectionsListName, typeSearch]} pageTitle={collectionsTitle} listTitle={collectionsListName}>
          <PermissionWrapper uuids={[]} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']} createType="collection">
            <Link to="/grbio/collection/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </PermissionWrapper>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={collectionColumns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};

const institutionColumns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    render: (text, record) => <Link to={`/grbio/institution/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const InstitutionSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={institutionSearch}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[institutionsListName, typeSearch]} pageTitle={institutionsTitle} listTitle={institutionsListName}>
          <PermissionWrapper uuids={[]} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']} createType="institution">
            <Link to="/grbio/institution/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </PermissionWrapper>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={institutionColumns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};

const personColumns = [
  {
    title: <FormattedMessage id="firstName" defaultMessage="Name"/>,
    dataIndex: 'firstName',
    render: (text, record) => <Link to={`/grbio/person/${record.key}`}>{text}</Link>
  },
  {
    title: <FormattedMessage id="email" defaultMessage="Email"/>,
    dataIndex: 'email'
  },
  ...standardColumns
];

export const PersonSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={personSearch}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[personsListName, typeSearch]} pageTitle={personsTitle} listTitle={personsListName}>
          <PermissionWrapper uuids={[]} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']} createType="person">
            <Link to="/grbio/person/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </PermissionWrapper>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={personColumns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};
