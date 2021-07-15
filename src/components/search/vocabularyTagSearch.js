import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import _cloneDeep from 'lodash/cloneDeep';

// APIs
import { canCreate } from '../../api/permissions';
import { searchVocabularyTags } from '../../api/vocabularyTag';

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
    render: (text, record) => <Link to={`/vocabularyTag/${record.key}`}>{text}</Link>
  },
  ..._cloneDeep(standardColumns)
];
// Attaching filters to the last column
columns[columns.length - 1].filters = [
  { text: <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>, value: 'deleted' },
  {
    text: <FormattedMessage id="listType.servingNoDatasets" defaultMessage="Serving no datasets"/>,
    value: 'servingNoDatasets'
  }
];
// Setting filter type as radio - can choose only one option
columns[columns.length - 1].filterMultiple = false;

const title = { id: 'title.installations', defaultMessage: 'Installations | GBIF Registry' };
const listName = <FormattedMessage id="installations" defaultMessage="Installations"/>;

const getType = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>;
    case 'servingNoDatasets':
      return <FormattedMessage id="listType.servingNoDatasets" defaultMessage="Serving no datasets"/>;
    default:
      return <FormattedMessage id="listType.search" defaultMessage="Search"/>;
  }
};

const getTitle = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="menu.installation.deleted" defaultMessage="Deleted installations"/>;
    case 'servingNoDatasets':
      return <FormattedMessage id="menu.installation.empty" defaultMessage="Empty installations"/>;
    default:
      return <FormattedMessage id="menu.installation.search" defaultMessage="Search installations"/>;
  }
};

export const VocabularyTagSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchVocabularyTags}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, getType(props.query.type)]} pageTitle={title} listTitle={getTitle(props.query.type)}>
          <HasAccess fn={() => canCreate('vocabularyTag')}>
            <Link to="/vocabularyTag/create" className="ant-btn ant-btn-primary">
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