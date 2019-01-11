import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { personSearch } from '../../api/grbioPerson';
import { standardColumns } from './columns';
import { ItemHeader } from '../common';
import { HasRight, rights } from '../auth';
import Paper from './Paper';

const personsTitle = { id: 'title.persons', defaultMessage: 'Persons | GBIF Registry' };
const personsListName = <FormattedMessage id="persons" defaultMessage="Persons"/>;
const typeSearch = <FormattedMessage id="listType.search" defaultMessage="Search"/>;

const personColumns = [
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
        <ItemHeader listType={[personsListName, typeSearch]} pageTitle={personsTitle} listTitle={personsListName}>
          <HasRight rights={rights.CAN_ADD_GRBIO_PERSON}>
            <Link to="/person/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </HasRight>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={personColumns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};
