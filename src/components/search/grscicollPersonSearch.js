import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { personSearch, personDeleted } from '../../api/grscicollPerson';
import { standardColumns } from './columns';
import { HasRight, rights } from '../auth';
import Paper from './Paper';
import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { ItemHeader } from '../common';

const pageTitle = { id: 'title.persons', defaultMessage: 'Persons | GBIF Registry' };
const listName = <FormattedMessage id="persons" defaultMessage="Persons"/>;
const typeSearch = <FormattedMessage id="listType.search" defaultMessage="Search"/>;
const typeDeleted = <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>;
const searchTitle = <FormattedMessage id="menu.grSciCollPerson.search" defaultMessage="GrSciColl staff search"/>;
const deletedTitle = <FormattedMessage id="menu.grSciCollPerson.deleted" defaultMessage="GrSciColl staff deleted"/>;

const columns = [
  {
    title: <FormattedMessage id="firstName" defaultMessage="Name"/>,
    dataIndex: 'firstName',
    render: (text, record) => <Link to={`/person/${record.key}`}>{text}</Link>
  },
  {
    title: <FormattedMessage id="email" defaultMessage="Email"/>,
    dataIndex: 'email'
  },
  ...standardColumns
];

export const PersonSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={personSearch}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeSearch]} pageTitle={pageTitle} listTitle={searchTitle}>
          <HasRight rights={rights.CAN_ADD_GRSCICOLL_PERSON}>
            <Link to="/person/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </HasRight>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};

export const PersonDeleted = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={personDeleted}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeDeleted]} pageTitle={pageTitle} listTitle={deletedTitle}/>
        <Paper padded>
          <DataTable {...props} columns={columns}/>
        </Paper>
      </React.Fragment>
    }/>;
};
