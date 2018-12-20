import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { getInstallations } from '../../api/organization';
import DataTable from '../widgets/DataTable';
import DataQuery from '../DataQuery';
import { standardColumns } from '../search/columns';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/installation/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

const Installations = ({ orgKey, title }) => {
  return (
    <React.Fragment>
      <span className="help">{title}</span>
      <h2>
        <FormattedMessage id="installations" defaultMessage="Installations"/>
      </h2>
      <DataQuery
        api={getInstallations}
        initQuery={{ key: orgKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} columns={columns}/>}
      />
    </React.Fragment>
  );
};

export default Installations;