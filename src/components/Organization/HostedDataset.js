import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { getHostedDatasets } from '../../api/organization';
import DataTable from '../DataTable';
import DataQuery from '../DataQuery';
import { standardColumns } from '../search/columns';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/dataset/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

const HostedDataset = ({ orgKey }) => {
  return (
    <React.Fragment>
      <h1>
        <FormattedMessage id="orgHostedDataset" defaultMessage="Datasets hosted  by the organization"/>
      </h1>
      <DataQuery
        api={getHostedDatasets}
        initQuery={{ key: orgKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} noHeader={true} columns={columns}/>}
      />
    </React.Fragment>
  );
};

export default HostedDataset;