import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import _cloneDeep from 'lodash/cloneDeep';

// APIs
import { canCreate } from '../../api/permissions';
import { search } from '../../api/organization';

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
    render: (text, record) => <Link to={`/organization/${record.key}`}>{text}</Link>,
  },
  ..._cloneDeep(standardColumns)
];
// Attaching filters to the last column
columns[columns.length - 1].filters = [
  { text: <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>, value: 'deleted' },
  { text: <FormattedMessage id="listType.pending" defaultMessage="Pending"/>, value: 'pending' },
  {
    text: <FormattedMessage id="listType.nonPublishingOrganizations" defaultMessage="Non publishing organizations"/>,
    value: 'nonPublishing'
  }
];
// Setting filter type as radio - can choose only one option
columns[columns.length - 1].filterMultiple = false;

const title = { id: 'title.organizations', defaultMessage: 'Organizations | GBIF Registry' };
const listName = <FormattedMessage id="organizations" defaultMessage="Organizations"/>;

const getType = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>;
    case 'pending':
      return <FormattedMessage id="listType.pending" defaultMessage="Pending"/>;
    case 'nonPublishing':
      return <FormattedMessage id="listType.nonPublishingOrganizations"
                               defaultMessage="Non publishing organizations"/>;
    default:
      return <FormattedMessage id="listType.search" defaultMessage="Search"/>;
  }
};

const getTitle = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="menu.organization.deleted" defaultMessage="Deleted organizations"/>;
    case 'pending':
      return <FormattedMessage id="menu.organization.pending" defaultMessage="Pending organizations"/>;
    case 'nonPublishing':
      return <FormattedMessage id="menu.organization.nonPublishing"
                               defaultMessage="Non publishing organizations"/>;
    default:
      return <FormattedMessage id="menu.organization.search" defaultMessage="Search organizations"/>;
  }
};

export const OrganizationSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={search}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, getType(props.filter.type)]} pageTitle={title} listTitle={getTitle(props.filter.type)}>
          <HasAccess fn={() => canCreate('organization')}>
            <Link to="/organization/create" className="ant-btn ant-btn-primary">
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
