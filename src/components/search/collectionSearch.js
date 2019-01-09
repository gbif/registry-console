import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { collectionSearch } from '../../api/collection';
import { standardColumns } from './columns';
import { ItemHeader } from '../common';
import PermissionWrapper from '../hoc/PermissionWrapper';
import Paper from './Paper';

const collectionsTitle = { id: 'title.collections', defaultMessage: 'Collections | GBIF Registry' };
const collectionsListName = <FormattedMessage id="collections" defaultMessage="Collections"/>;
const typeSearch = <FormattedMessage id="listType.search" defaultMessage="Search"/>;

const collectionColumns = [
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
        <ItemHeader listType={[collectionsListName, typeSearch]} pageTitle={collectionsTitle} listTitle={collectionsListName}>
          <PermissionWrapper uuids={[]} roles={['REGISTRY_ADMIN']} createType="collection">
            <Link to="/collection/create" className="ant-btn ant-btn-primary">
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