import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DataTable from '../widgets/DataTable';
import DataQuery from '../DataQuery';
import { search } from '../../api/node';
import { standardColumns } from './columns';
import { ItemHeader } from '../widgets';
import Paper from './Paper';

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
const listName = <FormattedMessage id="nodes" defaultMessage="Nodes"/>;
const typeSearch = <FormattedMessage id="search" defaultMessage="Search"/>;

export const NodeSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={search}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeSearch]} pageTitle={title}/>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};

