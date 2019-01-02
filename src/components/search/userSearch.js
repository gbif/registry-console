import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DataTable from '../widgets/DataTable';
import DataQuery from '../DataQuery';
import { search } from '../../api/user';
import { ItemHeader } from '../widgets';
import Paper from './Paper';

const columns = [
  {
    title: <FormattedMessage id="userName" defaultMessage="User name"/>,
    dataIndex: 'userName',
    render: (text, record) => <Link to={`/user/${record.userName}`}>{text}</Link>
  },
  {
    title: <FormattedMessage id="firstName" defaultMessage="First name"/>,
    dataIndex: 'firstName'
  },
  {
    title: <FormattedMessage id="lastName" defaultMessage="Last name"/>,
    dataIndex: 'lastName'
  },
  {
    title: <FormattedMessage id="email" defaultMessage="Email"/>,
    dataIndex: 'email'
  }
];
const title = { id: 'title.users', defaultMessage: 'Users | GBIF Registry' };
const listName = <FormattedMessage id="users" defaultMessage="Users"/>;
const typeSearch = <FormattedMessage id="listType.search" defaultMessage="Search"/>;

export const UserSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={search}
    initQuery={initQuery}
    listType={[listName, typeSearch]}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeSearch]} pageTitle={title} listTitle={listName}/>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};

