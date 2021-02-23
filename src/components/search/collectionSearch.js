import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import _cloneDeep from 'lodash/cloneDeep';

// APIs
import { canCreate } from '../../api/permissions';
import { collectionSearch } from '../../api/collection';
import DataTable from '../common/GrSciCollTable';
import DataQuery from '../DataQuery';
import { standardColumns } from './columns';
import { ItemHeader } from '../common';
import { HasAccess } from '../auth';
import Paper from './Paper';
import { Tooltip } from 'antd';

const columns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    width: '250px',
    render: (text, record) => <div style={{minWidth: 200}}>
      <Link style={{display: 'inline-block', marginRight: 8}} to={`/collection/${record.key}`}>{text}</Link>
      {!record.active && <Tooltip title="inactive">
        <span style={{display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: 'tomato'}} />
      </Tooltip>}
    </div>
  },
  {
    title: <FormattedMessage id="code" defaultMessage="Code"/>,
    dataIndex: 'code',
    width: '150px',
  },
  {
    title: <FormattedMessage id="institution" defaultMessage="Institution"/>,
    dataIndex: 'institutionKey',
    width: '250px',
    render: (text, record) => <Link style={{display: 'inline-block', minWidth: 200}} to={`/institution/${record.institutionKey}`}>{record.institutionName}</Link>
  },
  {
    title: <FormattedMessage id="city" defaultMessage="City"/>,
    dataIndex: 'city',
    width: '150px',
    render: (text, {address = {}, mailingAddress = {}}) => <div>
      {address.city} {mailingAddress && mailingAddress.city && mailingAddress.city !== address.city && <div style={{color: '#aaa'}}>{mailingAddress.city}</div>}
    </div>
  },
  {
    title: <FormattedMessage id="country" defaultMessage="Country"/>,
    dataIndex: 'country',
    width: '150px',
    render: (text, {address = {}, mailingAddress = {}}) => <div>
      {address.country && <FormattedMessage id={`country.${address.country}`} defaultMessage={address.country}/>}
      {mailingAddress.country && mailingAddress.country !== address.country && <div style={{color: '#aaa'}}><FormattedMessage id={`country.${mailingAddress.country}`} defaultMessage={mailingAddress.country}/></div>}
    </div>
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
          listType={[listName, getType(props.query.type)]}
          pageTitle={pageTitle}
          listTitle={getTitle(props.query.type)}
        >
          <HasAccess fn={() => canCreate('grscicoll/collection')}>
            <Link to="/collection/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </HasAccess>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};