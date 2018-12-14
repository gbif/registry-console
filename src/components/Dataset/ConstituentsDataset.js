import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { getConstituentDataset } from '../../api/dataset';
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

const ConstituentsDataset = ({ datasetKey }) => {
  return (
    <React.Fragment>
      <h1>
        <FormattedMessage id="datasetConstituent" defaultMessage="Constituent datasets"/>
      </h1>
      <DataQuery
        api={getConstituentDataset}
        initQuery={{ key: datasetKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} noHeader={true} columns={columns}/>}
      />
    </React.Fragment>
  );
};

export default ConstituentsDataset;