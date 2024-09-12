import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import { Input, Table, Spin, Alert, Row, Col } from 'antd';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

const Search = Input.Search;

const styles = {
  scrollContainer: {
    overflow: 'auto',
    width: '100%'
  },
  table: {
    '& thead > tr > th': {
      wordBreak: 'keep-all'
    }
  }
};

/**
 * Generic table component
 * Used for displaying main items lists
 * (Organizations, Datasets, Installations, Nodes, Users, Collections) where they appear
 * @param props
 * @returns {*}
 * @constructor
 */
const DataTable = props => {
  const { searchable, searchableTypes, updateQuery, fetchData, data, query, searchValue, loading, error, columns, width, classes, noHeader } = props;
  const { q } = query;
  data.offset = data.offset || 0;

  const Header = loading ? <Spin size="small" /> :
    <Row type="flex">
      <Col xs={12} sm={12} md={12}>
        <span id="tableCount">
          <FormattedMessage
            id="nResults"
            defaultMessage="{formattedNumber} {count, plural, zero {results} one {result} other {results}}"
            values={{ formattedNumber: typeof data.count !== "undefined" ? <FormattedNumber value={data.count} /> : null, count: data.count }}
          />
        </span>
        {searchValue ?
          <FormattedMessage id="query" defaultMessage=" for '{query}'" values={{ query: searchValue }} /> : null}
      </Col>
      <Col xs={12} sm={12} md={12} className="text-right">
        <FormattedMessage
          id="nPages"
          defaultMessage="page {current}/{total}"
          values={{
            current: <FormattedNumber value={1 + data.offset / data.limit} />,
            total: <FormattedNumber value={Math.ceil(data.count / data.limit)} />
          }} />
      </Col>
    </Row>;
  const translatedSearch = props.intl.formatMessage({ id: 'search', defaultMessage: 'Search' });
  // If filters were added to the column
  if (columns[columns.length - 1].hasOwnProperty('filters') && query.type) {
    // Adding active filter
    columns[columns.length - 1].filteredValue = [query.type];
  }

  // disable search if the type filter is active and the searchable prop is not an array that includes the type filter
  const isDisabled = !!query.type && (Array.isArray(searchableTypes) && !searchableTypes.includes(query.type));

  columns[columns.length - 1].filteredValue = null;
  return (
    <React.Fragment>
      {!error && (
        <Row type="flex">
          <Col span={24}>
            {searchable && <Search
              className="dataTable-search"
              placeholder={translatedSearch}
              enterButton
              size="large"
              onChange={(e) => updateQuery({ ...query, q: e.target.value })}
              value={q}
              onSearch={val => fetchData({ q: val, ...query })}
              style={{ marginBottom: '16px' }}
              disabled={isDisabled}
            />
            }
            <div className={classes.scrollContainer}>
              <Table
                columns={columns}
                dataSource={data.results || []}
                bordered
                title={noHeader ? null : () => Header}
                rowKey={record => (_get(record, props.rowKey) || record.key)}
                expandedRowKeys={props.expandedRowKeys ? props.expandedRowKeys : []}
                onExpandedRowsChange={props.onExpandedRowsChange}
                pagination={data.results ? {
                  total: data.count,
                  current: 1 + data.offset / data.limit,
                  pageSize: data.limit,
                  position: data.count <= data.limit ? 'node' : 'bottom'
                } : { total: 0, current: 1, pageSize: 10 }}
                scroll={{ x: width || 870 }}
                loading={loading}
                className={classes.table}
                onChange={({ current, pageSize }, filters) => {
                  return fetchData({
                    q,
                    limit: pageSize,
                    offset: (current - 1) * pageSize,
                    type: _get(filters, 'modified[0]', query.type)
                  })
                }}
              />
            </div>
          </Col>
        </Row>
      )}
      {error && <Alert
        message={<FormattedMessage id="error.title" defaultMessage="Error" />}
        description={<FormattedMessage
          id="error.description"
          defaultMessage="An error happened while trying to process your request. Please report the error at https://github.com/gbif/portal-feedback/issues/new"
        />}
        type="error"
        showIcon
      />}
    </React.Fragment>
  );
};

DataTable.propTypes = {
  updateQuery: PropTypes.func.isRequired, // method to update request parameters during manipulation with table (pagination, search)
  fetchData: PropTypes.func.isRequired, // method to re-request data after parameters were updated
  query: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired, // object data to show in table
  columns: PropTypes.array.isRequired, // array of column objects to display in table
  error: PropTypes.bool.isRequired, // true if data fetching failed
  loading: PropTypes.bool.isRequired, // data fetching in progress or not
  searchable: PropTypes.bool, // indicates if table should show search field or not
  searchableTypes: PropTypes.array, // array of types for which search field should be shown
  width: PropTypes.number, // Optional parameter if you want to set width from outside
  noHeader: PropTypes.bool // An option to hide table's header
};

export default injectSheet(styles)(injectIntl(DataTable));

