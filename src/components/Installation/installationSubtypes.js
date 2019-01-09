import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { getServedDatasets, getSyncHistory } from '../../api/installation';
// Configuration
import { standardColumns } from '../search/columns';
// Components
import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/dataset/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];
const syncColumns = [
  {
    title: <FormattedMessage id="syncDate" defaultMessage="Sync date"/>,
    dataIndex: 'syncDate',
    width: '150px',
    render: text => <FormattedRelative value={text}/>
  },
  {
    title: <FormattedMessage id="result" defaultMessage="Result"/>,
    dataIndex: 'result',
    width: '150px'
  },
  {
    title: <FormattedMessage id="details" defaultMessage="Details"/>,
    dataIndex: 'details',
    width: '50%'
  }
];

export const ServedDataset = ({ instKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="servedDatasets" defaultMessage="Served datasets"/>
      </h2>
      <DataQuery
        api={getServedDatasets}
        initQuery={{ key: instKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={columns}/>}
      />
    </React.Fragment>
  );
};

ServedDataset.propTypes = {
  instKey: PropTypes.string.isRequired
};

export const SyncHistory = ({ instKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="synchronizationHistory" defaultMessage="Synchronization history"/>
      </h2>
      <DataQuery
        api={getSyncHistory}
        initQuery={{ key: instKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={syncColumns}/>}
      />
    </React.Fragment>
  );
};

SyncHistory.propTypes = {
  instKey: PropTypes.string.isRequired
};