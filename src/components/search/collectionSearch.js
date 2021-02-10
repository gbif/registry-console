import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import _cloneDeep from 'lodash/cloneDeep';

import { collectionSearch } from '../../api/collection';
import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { standardColumns } from './columns';
import { ItemHeader } from '../common';
import { HasRole, roles } from '../auth';
import Paper from './Paper';

const columns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    width: '250px',
    render: (text, record) => <Link style={{display: 'inline-block', minWidth: 200}} to={`/collection/${record.key}`}>{text}</Link>
  },
  {
    title: <FormattedMessage id="code" defaultMessage="Code"/>,
    dataIndex: 'code',
    width: '100px',
  },
  {
    title: <FormattedMessage id="institution" defaultMessage="Institution"/>,
    dataIndex: 'institutionKey',
    width: '250px',
    render: (text, record) => <Link style={{display: 'inline-block', minWidth: 200}} to={`/institution/${record.institutionKey}`}>{text}</Link>
  },
  {
    title: <FormattedMessage id="active" defaultMessage="Active"/>,
    dataIndex: 'active',
    width: '80px',
    render: (text, record) => <span>{text ? 'Yes' : 'No'}</span>
  },
  ..._cloneDeep(standardColumns)
];
// Attaching filters to the last column
columns[columns.length - 1].filters = [
  { text: <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>, value: 'deleted' }
];
// Setting filter type as radio - can choose only one option
columns[columns.length - 1].filterMultiple = false;

const pageTitle = { id: 'title.collections', defaultMessage: 'Collections | GBIF Registry' };
const listName = <FormattedMessage id="collections" defaultMessage="Collections"/>;

const getType = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>;
    default:
      return <FormattedMessage id="listType.search" defaultMessage="Search"/>;
  }
};

const getTitle = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="menu.collection.deleted" defaultMessage="Deleted collections"/>;
    default:
      return <FormattedMessage id="menu.collection.search" defaultMessage="Search collections"/>;
  }
};

export const CollectionSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={collectionSearch}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader
          listType={[listName, getType(props.filter.type)]}
          pageTitle={pageTitle}
          listTitle={getTitle(props.filter.type)}
        >
          <HasRole roles={[roles.REGISTRY_ADMIN, roles.GRSCICOLL_ADMIN, roles.GRSCICOLL_EDITOR]}>
            <Link to="/collection/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </HasRole>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};