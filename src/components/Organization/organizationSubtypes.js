import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { getHostedDatasets, getInstallations, getPublishedDatasets } from '../../api/organization';
// Configuration
import { standardColumns } from '../search/columns';
// Components
import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';

const datasetColumns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/dataset/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const HostedDataset = ({ orgKey, initQuery = { limit: 25, offset: 0 } }) => {
  return (
    <div className="item-details">
      <h2>
        <FormattedMessage id="hostedDatasets" defaultMessage="Hosted datasets"/>
      </h2>
      <DataQuery
        api={query => getHostedDatasets(orgKey, query)}
        initQuery={initQuery}
        render={props => <DataTable {...props} columns={datasetColumns}/>}
      />
    </div>
  );
};

HostedDataset.propTypes = {
  orgKey: PropTypes.string.isRequired
};

const installationColumns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/installation/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const Installations = ({ orgKey, initQuery = { limit: 25, offset: 0 } }) => {
  return (
    <div className="item-details">
      <h2>
        <FormattedMessage id="installations" defaultMessage="Installations"/>
      </h2>
      <DataQuery
        api={query => getInstallations(orgKey, query)}
        initQuery={initQuery}
        render={props => <DataTable {...props} columns={installationColumns}/>}
      />
    </div>
  );
};

Installations.propTypes = {
  orgKey: PropTypes.string.isRequired
};

const publishedColumns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/dataset/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const PublishedDataset = ({ orgKey, initQuery = { limit: 25, offset: 0 } }) => {
  return (
    <div className="item-details">
      <h2>
        <FormattedMessage id="publishedDatasets" defaultMessage="Published datasets"/>
      </h2>
      <DataQuery
        api={query => getPublishedDatasets(orgKey, query)}
        initQuery={initQuery}
        render={props => <DataTable {...props} columns={publishedColumns}/>}
      />
    </div>
  );
};

PublishedDataset.propTypes = {
  orgKey: PropTypes.string.isRequired
};