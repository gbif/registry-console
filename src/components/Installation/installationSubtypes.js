import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { getServedDatasets } from '../../api/installation';
// Configuration
import { standardColumns } from '../search/columns';
// Components
import DataTable from '../widgets/DataTable';
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