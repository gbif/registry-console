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
  const { searchable, updateQuery, fetchData, data, query, searchValue, loading, filter, error, columns, width, classes, noHeader } = props;
  const { q } = query;
  const Header = loading ? <Spin size="small"/> :
    <React.Fragment>
      <FormattedMessage
        id="nResults"
        defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}}`}
        values={{ formattedNumber: <FormattedNumber value={data.count}/>, count: data.count }}
      />
      {searchValue ? <FormattedMessage id="query" defaultMessage=" for '{query}'" values={{ query: searchValue }}/> : null}
    </React.Fragment>;
  const translatedSearch = props.intl.formatMessage({ id: 'search', defaultMessage: 'Search' });
  // If filters were added to the column
  if (columns[columns.length - 1].hasOwnProperty('filters')) {
    // Adding active filter
    columns[columns.length - 1].filteredValue = [filter.type];
  }

  return (
    <React.Fragment>
      {!error && (
        <Row>
          <Col spab={24}>
            {searchable && <Search
              className="dataTable-search"
              placeholder={translatedSearch}
              enterButton={translatedSearch}
              size="large"
              onChange={(e) => updateQuery({ q: e.target.value })}
              value={q}
              onSearch={val => fetchData({ q: val, offset: 0 })}
              style={{ marginBottom: '16px' }}
              disabled={!!filter.type}
            />
            }
            <div className={classes.scrollContainer}>
              <Table
                columns={columns}
                dataSource={data.results}
                bordered
                title={noHeader ? null : () => Header}
                rowKey={record => (_get(record, props.rowKey) || record.key)}
                pagination={{
                  total: data.count,
                  current: 1 + data.offset / data.limit,
                  pageSize: data.limit,
                  position: data.count <= data.limit ? 'node' : 'bottom'
                }}
                loading={loading}
                style={{ minWidth: `${width || 600}px` }}
                className={classes.table}
                onChange={({ current, pageSize }, filters) => fetchData({ q, offset: (current - 1) * pageSize }, filters)}
              />
            </div>
          </Col>
        </Row>
      )}
      {error && <Alert
        message={<FormattedMessage id="error.title" defaultMessage="Error"/>}
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
  width: PropTypes.number, // Optional parameter if you want to set width from outside
  noHeader: PropTypes.bool // An option to hide table's header
};

export default injectSheet(styles)(injectIntl(DataTable));

