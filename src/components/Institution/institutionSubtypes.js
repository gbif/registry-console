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
      <div style={{display: 'flex'}}>
        <h2 style={{flex: '1 1 auto'}}>
          <FormattedMessage id="collections" defaultMessage="Collections"/>
        </h2>
        <Link style={{flex: '0 0 auto'}} to="/collection/create" className="ant-btn ant-btn-primary">
          <FormattedMessage id="createNew" defaultMessage="Create new"/>
        </Link>
      </div>
      <DataQuery
        api={(query, filter) => collectionSearch({...query, institution: institutionKey}, filter)}
        initQuery={initQuery}
        render={props => <DataTable {...props} columns={columns}/>}
      />
    </React.Fragment>
  );
};

Collections.propTypes = {
  institutionKey: PropTypes.string.isRequired
};