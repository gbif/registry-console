import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { getPendingEndorsement } from '../../api/node';
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

const PendingEndorsement = ({ nodeKey, title }) => {
  return (
    <React.Fragment>
      <span className="help">{title}</span>
      <h2>
        <FormattedMessage id="pendingEndorsements" defaultMessage="Pending endorsements"/>
      </h2>
      <DataQuery
        api={getPendingEndorsement}
        initQuery={{ key: nodeKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={columns}/>}
      />
    </React.Fragment>
  );
};

export default PendingEndorsement;