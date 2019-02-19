import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import _cloneDeep from 'lodash/cloneDeep';

import { institutionSearch } from '../../api/institution';
import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { standardColumns } from './columns';
import { ItemHeader } from '../common';
import { HasRight, rights } from '../auth';
import Paper from './Paper';

const columns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    render: (text, record) => <Link to={`/institution/${record.key}`}>{text}</Link>
  },
  ..._cloneDeep(standardColumns)
];
// Attaching filters to the last column
columns[columns.length - 1].filters = [
  { text: <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>, value: 'deleted' }
];
// Setting filter type as radio - can choose only one option
columns[columns.length - 1].filterMultiple = false;

const pageTitle = { id: 'title.institutions', defaultMessage: 'Institutions | GBIF Registry' };
const listName = <FormattedMessage id="institutions" defaultMessage="Institutions"/>;

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
      return <FormattedMessage id="menu.institution.deleted" defaultMessage="Deleted institutions"/>;
    default:
      return <FormattedMessage id="menu.institution.search" defaultMessage="Search institutions"/>;
  }
};

export const InstitutionSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={institutionSearch}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader
          listType={[listName, getType(props.filter.type)]}
          pageTitle={pageTitle}
          listTitle={getTitle(props.filter.type)}
        >
          <HasRight rights={rights.CAN_ADD_INSTITUTION}>
            <Link to="/institution/create" className="ant-btn ant-btn-primary">
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
