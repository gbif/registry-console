import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { collectionSearch } from '../../api/collection';
// Configuration
import { standardColumns } from '../search/columns';
// Widgets
import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';

const columns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    width: '400px',
    render: (text, record) => <Link to={`/collection/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const Collections = ({ institutionKey, initQuery = { limit: 25, offset: 0 } }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="collections" defaultMessage="Collections"/>
      </h2>
      <DataQuery
        api={query => collectionSearch(institutionKey, query)}
        initQuery={initQuery}
        render={props => <DataTable {...props} columns={columns}/>}
      />
    </React.Fragment>
  );
};

Collections.propTypes = {
  institutionKey: PropTypes.string.isRequired
};