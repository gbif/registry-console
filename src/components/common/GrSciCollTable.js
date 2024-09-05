import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import { Select, Input, Table, Spin, Alert, Row, Col, Button } from 'antd';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

// Wrappers
import withContext from '../hoc/withContext';

const styles = {
  scrollContainer: {
    overflow: 'auto',
    width: '100%'
  },
  table: {
    '& thead > tr > th': {
      wordBreak: 'keep-all'
    }
  },
  filtersWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -5,
    '&>*': {
      flex: '1 0 300px',
      margin: 5,
      maxWidth: '100%'
    }
  },
  searchButton: {
    margin: '10px 0'
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
  const { countries, updateQuery, fetchData, data, query, searchValue, loading, error, columns, width, classes, noHeader } = props;
  const { q, code, city, country, name, fuzzyName } = query;
  
  const Header = loading ? <Spin size="small"/> :
    <Row type="flex">
      <Col xs={12} sm={12} md={12}>
        <FormattedMessage
          id="nResults"
          defaultMessage="{formattedNumber} {count, plural, zero {results} one {result} other {results}}"
          values={{ formattedNumber: typeof data.count !== "undefined" ? <FormattedNumber value={data.count}/> : null, count: data.count }}
        />
        {searchValue ?
          <FormattedMessage id="query" defaultMessage=" for '{query}'" values={{ query: searchValue }}/> : null}
      </Col>
      <Col xs={12} sm={12} md={12} className="text-right">
        <FormattedMessage
          id="nPages"
          defaultMessage="page {current}/{total}"
          values={{
            current: <FormattedNumber value={1 + data.offset / data.limit}/>,
            total: <FormattedNumber value={Math.ceil(data.count / data.limit)}/>
          }}/>
      </Col>
    </Row>;
  const translatedSearch = props.intl.formatMessage({ id: 'search', defaultMessage: 'Search' });
  // If filters were added to the column
  if (columns[columns.length - 1].hasOwnProperty('filters') && query.type) {
    // Adding active filter
    columns[columns.length - 1].filteredValue = [query.type];
  }

  // get a map with countryCode: translated country names using intl.formatMessage
  const countryNames = countries.reduce((acc, countryCode) => {
    acc[countryCode] = props.intl.formatMessage({ id: `country.${countryCode}` });
    return acc;
  }
  , {});
  
  // generate a list of objects with label and value for the Select component
  const countryOptions  = countries.map(countryCode => {
    return { label: countryNames[countryCode], value: countryCode };
  });

  return (
    <React.Fragment>
      {!error && (
        <Row type="flex">
          <Col span={24}>
            <div className={classes.filtersWrapper}>
              <Input
                className="dataTable-search"
                placeholder={translatedSearch}
                size="large"
                onChange={(e) => updateQuery({ q: e.target.value })}
                value={q}
                disabled={!!query.type}
              />
              <Input value={code} size="large" placeholder="Code"        onChange={(e) => updateQuery({ ...query, code: e.target.value })}/>
              <Input value={name} size="large" placeholder="Name"        onChange={(e) => updateQuery({ ...query, name: e.target.value })}/>
              <Input value={fuzzyName} size="large" placeholder="Fuzzy name"  onChange={(e) => updateQuery({ ...query, fuzzyName: e.target.value })}/>
              <Input value={city} size="large" placeholder="City"        onChange={(e) => updateQuery({ ...query, city: e.target.value })}/>
              {/* <Input value={country} size="large" placeholder="Country"     onChange={(e) => updateQuery({ ...query, country: e.target.value })}/> */}
              <Select optionFilterProp="label" options={countryOptions} showSearch={true} size="large" value={country} onChange={(country) => updateQuery({ ...query, country })} placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}></Select>
            </div>
            <Button className={classes.searchButton} type="primary" onClick={() => fetchData(query)}>Search</Button>
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
                } : {total: 0, current: 1, pageSize: 10}}
                scroll={{ x: width || 870 }}
                loading={loading}
                className={classes.table}
                onChange={({ current, pageSize }, filters) => fetchData({
                  ...query,
                  limit: pageSize,
                  offset: (current - 1) * pageSize,
                  type: _get(filters, 'modified[0]')
                })}
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

const mapContextToProps = ({ countries }) => ({ countries });
export default injectSheet(styles)(withContext(mapContextToProps)(injectIntl(DataTable)));

