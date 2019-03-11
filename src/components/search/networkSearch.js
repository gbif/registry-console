import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { searchNetwork } from '../../api/network';
import { standardColumns } from './columns';
import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { ItemHeader } from '../common';
import { HasRight, rights } from '../auth';
import Paper from './Paper';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '400px',
    render: (text, record) => <Link to={`/organization/${record.key}`}>{text}</Link>,
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
          <HasRight rights={rights.CAN_ADD_ORGANIZATION}>
            <Link to="/network/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </HasRight>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }
  />
};