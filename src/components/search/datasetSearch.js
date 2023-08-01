import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import _cloneDeep from 'lodash/cloneDeep';

// APIs
import { canCreate } from '../../api/permissions';
import { searchDatasets } from '../../api/dataset';

import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { standardColumns } from './columns';
import { ItemHeader } from '../common';
import { HasAccess } from '../auth';
import Paper from './Paper';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '400px',
    render: (text, record) => <Link to={`/dataset/${record.key}`}>{text}</Link>
  },
  ..._cloneDeep(standardColumns)
];
// Attaching filters to the last column
columns[columns.length - 1].filters = [
  { text: <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>, value: 'deleted' },
  { text: <FormattedMessage id="listType.duplicate" defaultMessage="Duplicate"/>, value: 'duplicate' },
  { text: <FormattedMessage id="listType.constituent" defaultMessage="Constituent"/>, value: 'constituent' },
  { text: <FormattedMessage id="listType.withNoEndpoint" defaultMessage="With no endpoint"/>, value: 'withNoEndpoint' },
  { text: <FormattedMessage id="listType.allActive" defaultMessage="All active"/>, value: '' }
];
// Setting filter type as radio - can choose only one option
columns[columns.length - 1].filterMultiple = false;

const pageTitle = { id: 'title.datasets', defaultMessage: 'Datasets | GBIF Registry' };
const listName = <FormattedMessage id="datasets" defaultMessage="Datasets"/>;

const getType = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>;
    case 'duplicate':
      return <FormattedMessage id="listType.duplicate" defaultMessage="Duplicate"/>;
    case 'constituent':
      return <FormattedMessage id="listType.constituent" defaultMessage="Constituent"/>;
    case 'withNoEndpoint':
      return <FormattedMessage id="listType.withNoEndpoint" defaultMessage="With no endpoint"/>;
    default:
      return <FormattedMessage id="listType.search" defaultMessage="Search"/>;
  }
};

const getTitle = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="menu.dataset.deleted" defaultMessage="Deleted dataset"/>;
    case 'duplicate':
      return <FormattedMessage id="menu.dataset.duplicate" defaultMessage="Duplicate of dataset"/>;
    case 'constituent':
      return <FormattedMessage id="menu.dataset.constituent" defaultMessage="Constituent datasets"/>;
    case 'withNoEndpoint':
      return <FormattedMessage id="menu.dataset.withNoEndpoint" defaultMessage="Datasets with no endpoint"/>;
    default:
      return <FormattedMessage id="menu.dataset.search" defaultMessage="Search dataset"/>;
  }
};

export const DatasetSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchDatasets}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, getType(props.query.type)]} pageTitle={pageTitle} listTitle={getTitle(props.query.type)}>
          <HasAccess fn={() => canCreate('dataset')}>
            <Link to="/dataset/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </HasAccess>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable searchableTypes={['deleted']}/>
        </Paper>
      </React.Fragment>
    }/>;
};