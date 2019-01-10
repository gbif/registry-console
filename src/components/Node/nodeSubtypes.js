import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { getEndorsedDatasets, getEndorsedOrganizations, getInstallations, getPendingEndorsement } from '../../api/node';
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

export const EndorsedDatasets = ({ nodeKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="endorsedDatasets" defaultMessage="Endorsed datasets"/>
      </h2>
      <DataQuery
        api={getEndorsedDatasets}
        initQuery={{ key: nodeKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={datasetColumns}/>}
      />
    </React.Fragment>
  );
};

EndorsedDatasets.propTypes = {
  nodeKey: PropTypes.string.isRequired
};

const organizationColumns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/organization/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const EndorsedOrganizations = ({ nodeKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="endorsedOrganizations" defaultMessage="Endorsed organizations"/>
      </h2>
      <DataQuery
        api={getEndorsedOrganizations}
        initQuery={{ key: nodeKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={organizationColumns}/>}
      />
    </React.Fragment>
  );
};

EndorsedOrganizations.propTypes = {
  nodeKey: PropTypes.string.isRequired
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

export const Installations = ({ nodeKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="installations" defaultMessage="Installations"/>
      </h2>
      <DataQuery
        api={getInstallations}
        initQuery={{ key: nodeKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={installationColumns}/>}
      />
    </React.Fragment>
  );
};

Installations.propTypes = {
  nodeKey: PropTypes.string.isRequired
};

const pendingColumns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/organization/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const PendingEndorsement = ({ nodeKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="pendingEndorsements" defaultMessage="Pending endorsements"/>
      </h2>
      <DataQuery
        api={getPendingEndorsement}
        initQuery={{ key: nodeKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={pendingColumns}/>}
      />
    </React.Fragment>
  );
};

PendingEndorsement.propTypes = {
  nodeKey: PropTypes.string.isRequired
};