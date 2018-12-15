import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { getEndorsedDatasets } from '../../api/node';
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

const EndorsedDatasets = ({ orgKey }) => {
  return (
    <React.Fragment>
      <h1>
        <FormattedMessage id="nodeDatasets" defaultMessage="Datasets published through the Nodes endorsement"/>
      </h1>
      <DataQuery
        api={getEndorsedDatasets}
        initQuery={{ key: orgKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={columns}/>}
      />
    </React.Fragment>
  );
};

export default EndorsedDatasets;