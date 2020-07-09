import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { searchVocabularies } from '../../api/vocabulary';
import { standardColumns } from './columns';
import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { ItemHeader } from '../common';
import { HasRole, roles } from '../auth';
import Paper from './Paper';

const columns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    width: '400px',
    render: (text, record) => <Link to={`/vocabulary/${record.name}`}>{text}</Link>,
  },
  ...standardColumns
];
const title = { id: 'title.vocabularies', defaultMessage: 'Vocabularies | GBIF Registry' };
const listName = <FormattedMessage id="vocabularies" defaultMessage="Vocabularies"/>;

export const VocabularySearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={searchVocabularies}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName]} pageTitle={title} listTitle={listName}>
          <HasRole roles={roles.VOCABULARY_ADMIN}>
            <Link to="/vocabulary/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </HasRole>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }
  />
};