import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { getHostedDatasets, getInstallations, getPublishedDatasets } from '../../api/organization';
// Configuration
import { standardColumns } from '../search/columns';
// Components
import DataTable from '../widgets/DataTable';
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

export const HostedDataset = ({ orgKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="hostedDatasets" defaultMessage="Hosted datasets"/>
      </h2>
      <DataQuery
        api={getHostedDatasets}
        initQuery={{ key: orgKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={datasetColumns}/>}
      />
    </React.Fragment>
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

export const Installations = ({ orgKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="installations" defaultMessage="Installations"/>
      </h2>
      <DataQuery
        api={getInstallations}
        initQuery={{ key: orgKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={installationColumns}/>}
      />
    </React.Fragment>
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

export const PublishedDataset = ({ orgKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="publishedDatasets" defaultMessage="Published datasets"/>
      </h2>
      <DataQuery
        api={getPublishedDatasets}
        initQuery={{ key: orgKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={publishedColumns}/>}
      />
    </React.Fragment>
  );
};

PublishedDataset.propTypes = {
  orgKey: PropTypes.string.isRequired
};