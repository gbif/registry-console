import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import truncate from 'lodash/truncate';
import _get from 'lodash/get';

import { getDownloads } from '../../../api/user';
import config from '../../../api/util/config';
import { DateValue } from '../../common';
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';

const downloadColumns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'key',
    width: '365px',
    render: (key, record) => <a href={`${config.gbifUrl}/occurrence/download/${key}`}>{truncate(JSON.stringify(_get(record, 'request.predicate', {})), {'length': 200})}</a>
  },
  {
    title: <FormattedMessage id="status" defaultMessage="Status"/>,
    dataIndex: 'status',
    width: '110px'
  },
  {
    title: <FormattedMessage id="created" defaultMessage="Created"/>,
    dataIndex: 'created',
    width: '250px',
    render: text => <DateValue value={text}/>
  },
];

export const Downloads = ({ userKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="downloads" defaultMessage="Downloads"/>
      </h2>
      <DataQuery
        api={query => getDownloads(userKey, query)}
        initQuery={{ limit: 25, offset: 0 }}
        render={props => <DataTable {...props} columns={downloadColumns} width={915}/>}
      />
    </React.Fragment>
  );
};

Downloads.propTypes = {
  userKey: PropTypes.string.isRequired
};