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
    title: <FormattedMessage id="title" defaultMessage="Title" />,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/dataset/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const EndorsedDatasets = ({ nodeKey, initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="endorsedDatasets" defaultMessage="Endorsed datasets" />
      </h2>
      <DataQuery
        api={query => getEndorsedDatasets(nodeKey, query)}
        initQuery={initQuery}
        render={props => <DataTable {...props} columns={datasetColumns} />}
      />
    </React.Fragment>
  );
};

EndorsedDatasets.propTypes = {
  nodeKey: PropTypes.string.isRequired
};

const organizationColumns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title" />,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/organization/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const EndorsedOrganizations = ({ nodeKey, initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="endorsedOrganizations" defaultMessage="Endorsed organizations" />
      </h2>
      <DataQuery
        api={query => getEndorsedOrganizations(nodeKey, query)}
        initQuery={initQuery}
        render={props => <DataTable {...props} columns={organizationColumns} />}
      />
    </React.Fragment>
  );
};

EndorsedOrganizations.propTypes = {
  nodeKey: PropTypes.string.isRequired
};

const installationColumns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title" />,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/installation/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const Installations = ({ nodeKey, initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="installations" defaultMessage="Installations" />
      </h2>
      <DataQuery
        api={query => getInstallations(nodeKey, query)}
        initQuery={initQuery}
        render={props => <DataTable {...props} columns={installationColumns} />}
      />
    </React.Fragment>
  );
};

Installations.propTypes = {
  nodeKey: PropTypes.string.isRequired
};

const pendingColumns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title" />,
    dataIndex: 'title',
    width: '50%',
    // render: (text, record) => <Link to={`/organization/${record.key}`}>{text}</Link>
    render: (text, record) => {
      const colorLookup = {
        "ENDORSED": "green",
        "REJECTED": "tomato",
        "WAITING_FOR_ENDORSEMENT": "deepskyblue",
        "ON_HOLD": "orange",
      }
      return <div>
        <Link to={`/organization/${record.key}`}>{text}</Link>{' '}
        <span style={{ background: colorLookup[record.endorsementStatus], color: 'white', fontSize: 12, padding: '0 2px', borderRadius: 3 }}>
          <FormattedMessage id={`endorsementStatus.${record.endorsementStatus}`} /></span>
      </div>
    }
  },
  ...standardColumns
];

export const PendingEndorsement = ({ nodeKey, initQuery = { limit: 25, offset: 0 } }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="pendingEndorsements" defaultMessage="Pending endorsements" />
      </h2>
      <DataQuery
        api={query => getPendingEndorsement(nodeKey, query)}
        initQuery={initQuery}
        render={props => <DataTable {...props} columns={pendingColumns} />}
      />
    </React.Fragment>
  );
};

PendingEndorsement.propTypes = {
  nodeKey: PropTypes.string.isRequired
};