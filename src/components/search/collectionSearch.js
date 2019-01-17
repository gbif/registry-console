import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { collectionSearch, collectionDeleted } from '../../api/collection';
import { standardColumns } from './columns';
import { ItemHeader } from '../common';
import { HasRight, rights } from '../auth';
import Paper from './Paper';

const pageTitle = { id: 'title.collections', defaultMessage: 'Collections | GBIF Registry' };
const listName = <FormattedMessage id="collections" defaultMessage="Collections"/>;
const typeSearch = <FormattedMessage id="listType.search" defaultMessage="Search"/>;
const typeDeleted = <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>;
const searchTitle = <FormattedMessage id="menu.collection.search" defaultMessage="Search collections"/>;
const deletedTitle = <FormattedMessage id="menu.collection.deleted" defaultMessage="Deleted collections"/>;

const columns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    width: '400px',
    render: (text, record) => <Link to={`/collection/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const CollectionSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={collectionSearch}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeSearch]} pageTitle={pageTitle} listTitle={searchTitle}>
          <HasRight rights={rights.CAN_ADD_COLLECTION}>
            <Link to="/collection/create" className="ant-btn ant-btn-primary">
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

export const CollectionDeleted = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={collectionDeleted}
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