import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { getEndorsedDatasets } from '../../api/node';
import DataTable from '../widgets/DataTable';
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

const EndorsedDatasets = ({ nodeKey, title }) => {
  return (
    <React.Fragment>
      <span className="help">{title}</span>
      <h2>
        <FormattedMessage id="endorsedDatasets" defaultMessage="Endorsed datasets"/>
      </h2>
      <DataQuery
        api={getEndorsedDatasets}
        initQuery={{ key: nodeKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={columns}/>}
      />
    </React.Fragment>
  );
};

export default EndorsedDatasets;