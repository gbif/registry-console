import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// APIs
import { institutionSuggestionSearch } from '../../api/institution';
import DataTable from '../common/SuggestTable';
import DataQuery from '../DataQuery';
import { DateValue, ItemHeader } from '../common';
import Paper from './Paper';

const columns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    width: '250px',
    render: (text, record) => <div style={{minWidth: 200}}>
      {record.status === 'APPLIED' && <Link style={{display: 'inline-block', marginRight: 8}} to={`/institution/${record.entityKey}?suggestionId=${record.key}`}>{record.entityName}</Link>}
      {record.status !== 'APPLIED' && <>
        {record.type === 'CREATE' && <Link style={{display: 'inline-block', marginRight: 8}} to={`/institution/create?suggestionId=${record.key}`}>{record.entityName || record.suggestedEntity.name}</Link>}
        {record.type !== 'CREATE' && <Link style={{display: 'inline-block', marginRight: 8}} to={`/institution/${record.entityKey}?suggestionId=${record.key}`}>{record.entityName}</Link>}
      </>}
    </div>
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
    title: <FormattedMessage id="country" defaultMessage="Country"/>,
    dataIndex: 'entityCountry',
    width: '150px',
    render: (text, { entityCountry }) => entityCountry ? <FormattedMessage id={`country.${entityCountry}`} defaultMessage={entityCountry}/> : null
  },
  {
    title: <FormattedMessage id="active" defaultMessage="Active"/>,
    dataIndex: 'active',
    width: '80px',
    render: (text, record) => <span>{text ? 'Yes' : 'No'}</span>
  },
];

const pageTitle = { id: 'title.institution', defaultMessage: 'Institution | GBIF Registry' };

const getTitle = type => {
  return <FormattedMessage id="menu.institution.suggestions" defaultMessage="Suggested changes for institutions"/>;
};

export const InstitutionSuggestionSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={institutionSuggestionSearch}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader
          pageTitle={pageTitle}
          listTitle={getTitle(props.query.type)}
          listType={['Institution', 'Suggestions']}
        >
          {/* <HasAccess fn={() => canCreate('grscicoll/institution')}>
            <Link to="/institution/create" className="ant-btn ant-btn-primary">
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