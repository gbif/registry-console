import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DataTable from '../DataTable';
import DataQuery from '../DataQuery';
import { search } from '../../api/node';
import { standardColumns } from './columns';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '400px',
    render: (text, record) => <Link to={`/node/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];
const title = { id: 'title.nodes', defaultMessage: 'Nodes | GBIF Registry' };

export const NodeSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={search}
    initQuery={initQuery}
    render={props => <DataTable {...props} columns={columns} title={title} searchable/>}/>;
};

