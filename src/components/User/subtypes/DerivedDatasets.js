import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import truncate from 'lodash/truncate';
import _get from 'lodash/get';

import { getDerivedDatasets } from '../../../api/user';
import config from '../../../api/util/config';
import { DateValue } from '../../common';
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';

const downloadColumns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '350px',
    render: (description, record) => <a href={`${config.gbifUrl}/derivedDataset/${record.doi}`}>{truncate(description, {'length': 200})}</a>
  },
  {
    title: <FormattedMessage id="description" defaultMessage="Description"/>,
    dataIndex: 'description',
    width: '365px',
    render: (description, record) => <div>{truncate(description, {'length': 200})}</div>
  },
  {
    title: <FormattedMessage id="created" defaultMessage="Created"/>,
    dataIndex: 'created',
    width: '250px',
    render: text => <DateValue value={text}/>
  },
];

export const DerivedDatasets = ({ userKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="downloads" defaultMessage="Downloads"/>
      </h2>
      <DataQuery
        api={query => getDerivedDatasets(userKey, query)}
        initQuery={{ limit: 25, offset: 0 }}
        render={props => <DataTable {...props} columns={downloadColumns} width={915}/>}
      />
    </React.Fragment>
  );
};

DerivedDatasets.propTypes = {
  userKey: PropTypes.string.isRequired
};