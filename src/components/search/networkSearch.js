import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// APIs
import { canCreate } from '../../api/permissions';
import { searchNetwork } from '../../api/network';

import { standardColumns } from './columns';
import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { ItemHeader } from '../common';
import { HasAccess } from '../auth';
import Paper from './Paper';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '400px',
    render: (text, record) => <Link to={`/network/${record.key}`}>{text}</Link>,
  },
  ...standardColumns
];
const title = { id: 'title.networks', defaultMessage: 'Networks | GBIF Registry' };
const listName = <FormattedMessage id="networks" defaultMessage="Networks"/>;

export const NetworkSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchNetwork}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName]} pageTitle={title} listTitle={listName}>
          <HasAccess fn={() => canCreate('network')}>
            <Link to="/network/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </HasAccess>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }
  />
};