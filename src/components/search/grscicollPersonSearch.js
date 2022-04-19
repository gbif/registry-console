import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import _cloneDeep from 'lodash/cloneDeep';

// APIs
import { canCreate } from '../../api/permissions';
import { personSearch } from '../../api/grscicollPerson';

import { standardColumns } from './columns';
import { HasAccess } from '../auth';
import Paper from './Paper';
import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { ItemHeader } from '../common';

const columns = [
  {
    title: <FormattedMessage id="firstName" defaultMessage="Name"/>,
    dataIndex: 'firstName',
    width: '150px',
    render: (text, record) => <Link to={`/person/${record.key}`}>{text}</Link>
  },
  {
    title: <FormattedMessage id="lastName" defaultMessage="Last name"/>,
    dataIndex: 'lastName',
    width: '150px',
    render: (text, record) => <Link to={`/person/${record.key}`}>{text}</Link>
  },
  {
    title: <FormattedMessage id="email" defaultMessage="Email"/>,
    dataIndex: 'email',
    width: '100px',
  },
  ..._cloneDeep(standardColumns)
];
// Attaching filters to the last column
columns[columns.length - 1].filters = [
  { text: <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>, value: 'deleted' }
];
// Setting filter type as radio - can choose only one option
columns[columns.length - 1].filterMultiple = false;

const pageTitle = { id: 'title.persons', defaultMessage: 'Persons | GBIF Registry' };
const listName = <FormattedMessage id="persons" defaultMessage="Persons"/>;

const getType = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>;
    default:
      return <FormattedMessage id="listType.search" defaultMessage="Search"/>;
  }
};

const getTitle = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="menu.grSciCollPerson.deleted" defaultMessage="GRSciColl staff deleted"/>;
    default:
      return <FormattedMessage id="menu.grSciCollPerson.search" defaultMessage="GRSciColl staff search"/>;
  }
};

export const PersonSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={personSearch}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader
          listType={[listName, getType(props.query.type)]}
          pageTitle={pageTitle}
          listTitle={getTitle(props.query.type)}
        >
          <HasAccess fn={() => canCreate('grscicoll/person')}>
            <Link to="/person/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </HasAccess>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};
