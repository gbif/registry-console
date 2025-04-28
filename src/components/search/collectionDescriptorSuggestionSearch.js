import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// APIs
import { collectionDescriptorSuggestionSearch } from '../../api/collection';
import DataTable from '../common/SuggestTable';
import DataQuery from '../DataQuery';
import { DateValue, ItemHeader } from '../common';
import Paper from './Paper';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '250px',
    render: (text, record) => {
      if (!record.collectionKey || record.collectionKey === 'undefined') {
        return <div style={{minWidth: 200}}>{text}</div>;
      }
      
      return (
        <div style={{minWidth: 200}}>
          <Link 
            style={{display: 'inline-block', marginRight: 8}} 
            to={`/collection/${record.collectionKey}?descriptorSuggestionId=${record.key}`}
          >
            {text}
          </Link>
        </div>
      );
    }
  },
  {
    title: <FormattedMessage id="type" defaultMessage="Type"/>,
    dataIndex: 'type',
    width: '150px',
  },
  {
    title: <FormattedMessage id="status" defaultMessage="Status"/>,
    dataIndex: 'status',
    width: '250px',
  },
  {
    title: <FormattedMessage id="proposerEmail" defaultMessage="Proposer email"/>,
    dataIndex: 'proposerEmail',
    width: '150px',
  },
  {
    title: <FormattedMessage id="proposedDate" defaultMessage="Proposed"/>,
    dataIndex: 'proposed',
    width: '150px',
    render: text => <DateValue value={text}/>
  },
  {
    title: <FormattedMessage id="format" defaultMessage="Format"/>,
    dataIndex: 'format',
    width: '100px',
  }
];

const pageTitle = { id: 'title.collection', defaultMessage: 'Collection | GBIF Registry' };

const getTitle = () => {
  return <FormattedMessage id="menu.collection.descriptorSuggestions" defaultMessage="Suggested changes for collection descriptors"/>;
};

export const CollectionDescriptorSuggestionSearch = ({ initQuery = { status: 'PENDING', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={collectionDescriptorSuggestionSearch}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader
          pageTitle={pageTitle}
          listTitle={getTitle()}
          listType={['Collection', 'Descriptor Suggestions']}
        />
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};

export default CollectionDescriptorSuggestionSearch; 