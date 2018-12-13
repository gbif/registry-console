import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { getEndorsedOrganizations } from '../../api/node';
import DataTable from '../DataTable';
import DataQuery from '../DataQuery';
import { standardColumns } from '../search/columns';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/organization/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

const EndorsedOrganizations = ({ orgKey }) => {
  return (
    <React.Fragment>
      <h1>
        <FormattedMessage id="nodeOrganizations" defaultMessage="Organizations endorsed by the node"/>
      </h1>
      <DataQuery
        api={getEndorsedOrganizations}
        initQuery={{ key: orgKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={columns}/>}
      />
    </React.Fragment>
  );
};

export default EndorsedOrganizations;