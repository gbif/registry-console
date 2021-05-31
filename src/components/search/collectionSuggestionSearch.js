import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import _cloneDeep from 'lodash/cloneDeep';

// APIs
// import { canCreate } from '../../api/permissions';
import { collectionSuggestionSearch } from '../../api/collection';
import DataTable from '../common/SuggestTable';
import DataQuery from '../DataQuery';
import { standardColumns } from './columns';
import { ItemHeader } from '../common';
// import { HasAccess } from '../auth';
import Paper from './Paper';

const columns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    width: '250px',
    render: (text, record) => <div style={{minWidth: 200}}>
      {record.status === 'APPLIED' && <Link style={{display: 'inline-block', marginRight: 8}} to={`/collection/${record.entityKey}`}>{record.entityName}</Link>}
      {record.status !== 'APPLIED' && <>
        {record.type === 'CREATE' && <Link style={{display: 'inline-block', marginRight: 8}} to={`/collection/create?suggestionId=${record.key}`}>{record.entityName}</Link>}
        {record.type !== 'CREATE' && <Link style={{display: 'inline-block', marginRight: 8}} to={`/collection/${record.entityKey}?suggestionId=${record.key}`}>{record.entityName}</Link>}
      </>}
    </div>
  },
  {
    title: <FormattedMessage id="type" defaultMessage="Type"/>,
    dataIndex: 'type',
    width: '150px',
    // render: (text, record) => <div style={{minWidth: 200}}>
    //   <Link style={{display: 'inline-block', marginRight: 8}} to={`/collection/${record.entityKey}`}>{record.type}</Link>
    // </div>
  },
  {
    title: <FormattedMessage id="status" defaultMessage="Status"/>,
    dataIndex: 'status',
    width: '250px',
    // render: (text, record) => <Link style={{display: 'inline-block', minWidth: 200}} to={`/collection/${record.collectionKey}`}>{record.collectionName}</Link>
  },
  {
    title: <FormattedMessage id="proposerEmail" defaultMessage="Proposer email"/>,
    dataIndex: 'proposerEmail',
    width: '150px',
    // render: (text, {address = {}, mailingAddress = {}}) => <div>
    //   {address.city} {mailingAddress && mailingAddress.city && mailingAddress.city !== address.city && <div style={{color: '#aaa'}}>{mailingAddress.city}</div>}
    // </div>
  },
  {
    title: <FormattedMessage id="country" defaultMessage="Country"/>,
    dataIndex: 'suggestedEntity',
    width: '150px',
    render: (text, {suggestedEntity = {}}) => {
      const { address = {}, mailingAddress = {} } = suggestedEntity;
      return <div>
        {address.country && <FormattedMessage id={`country.${address.country}`} defaultMessage={address.country}/>}
        {mailingAddress.country && mailingAddress.country !== address.country && <div style={{color: '#aaa'}}><FormattedMessage id={`country.${mailingAddress.country}`} defaultMessage={mailingAddress.country}/></div>}
      </div>
    }
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
columns[2].filters = [
  // { text: <FormattedMessage id="listType.pending" defaultMessage="Pending"/>, value: 'PENDING' },
  { text: <FormattedMessage id="listType.discarded" defaultMessage="Discarded"/>, value: 'DISCARDED' },
  { text: <FormattedMessage id="listType.applied" defaultMessage="Applied"/>, value: 'APPLIED' }
];
// Setting filter type as radio - can choose only one option
columns[2].filterMultiple = false;

const pageTitle = { id: 'title.collection', defaultMessage: 'Collection | GBIF Registry' };

const getTitle = type => {
  return <FormattedMessage id="menu.collection.suggestions" defaultMessage="Suggested changes for collections"/>;
};

export const CollectionSuggestionSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={collectionSuggestionSearch}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader
          pageTitle={pageTitle}
          listTitle={getTitle(props.query.type)}
          listType={['Collection', 'Suggestions']}
        >
          {/* <HasAccess fn={() => canCreate('grscicoll/collection')}>
            <Link to="/collection/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </HasAccess> */}
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};