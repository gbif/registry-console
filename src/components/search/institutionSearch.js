import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { institutionSearch } from '../../api/institution';
import { standardColumns } from './columns';
import { ItemHeader } from '../common';
import PermissionWrapper from '../hoc/PermissionWrapper';
import Paper from './Paper';

const institutionsTitle = { id: 'title.institutions', defaultMessage: 'Institutions | GBIF Registry' };
const institutionsListName = <FormattedMessage id="institutions" defaultMessage="Institutions"/>;
const typeSearch = <FormattedMessage id="listType.search" defaultMessage="Search"/>;

const institutionColumns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    render: (text, record) => <Link to={`/institution/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const InstitutionSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={institutionSearch}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[institutionsListName, typeSearch]} pageTitle={institutionsTitle} listTitle={institutionsListName}>
          <PermissionWrapper uuids={[]} roles={['REGISTRY_ADMIN']} createType="institution">
            <Link to="/institution/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </PermissionWrapper>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={institutionColumns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};
