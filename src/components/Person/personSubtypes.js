import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { collectionSearch } from '../../api/grbio.collection';
import { institutionSearch } from '../../api/grbio.institution';
// Configuration
import { standardColumns } from '../search/columns';
// Widgets
import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';

const collectionColumns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    width: '400px',
    render: (text, record) => <Link to={`/grbio/collection/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const Collections = ({ personKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="collections" defaultMessage="Collections"/>
      </h2>
      <DataQuery
        api={collectionSearch}
        initQuery={{ contact: personKey, limit: 25, offset: 0 }}
        render={props => <DataTable {...props} columns={collectionColumns}/>}
      />
    </React.Fragment>
  );
};

Collections.propTypes = {
  personKey: PropTypes.string.isRequired
};

const institutionColumns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    width: '400px',
    render: (text, record) => <Link to={`/grbio/institution/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const Institutions = ({ personKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="institutions" defaultMessage="Institutions"/>
      </h2>
      <DataQuery
        api={institutionSearch}
        initQuery={{ contact: personKey, limit: 25, offset: 0 }}
        render={props => <DataTable {...props} columns={institutionColumns}/>}
      />
    </React.Fragment>
  );
};

Institutions.propTypes = {
  personKey: PropTypes.string.isRequired
};