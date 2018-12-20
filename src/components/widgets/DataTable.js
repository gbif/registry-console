import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Input, Table, Spin, Alert, Row, Col } from 'antd';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

const Search = Input.Search;

const styles = {
  container: {
    background: 'white',
    padding: 16
  },
  scrollContainer: {
    overflow: 'auto',
    width: '100%'
  },
  table: {
    minWidth: '600px'
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
  const { searchable, updateQuery, fetchData, data, query, loading, error, columns, classes } = props;
  const { q } = query;
  const Header = loading ? <Spin size="small"/> :
    <FormattedMessage
      id="nResults"
      defaultMessage={`{resultCount, number} {resultCount, plural,
        zero {results}
        one {result}
        other {results}
      }
    `}
      values={{ resultCount: data.count, q }}
    />;
  const translatedSearch = props.intl.formatMessage({ id: 'search', defaultMessage: 'Search' });

  return (
    <React.Fragment>
      {!error && (
        <Row className={classes.container}>
          <Col spab={24}>
            {searchable && <Search
              placeholder={translatedSearch}
              enterButton={translatedSearch}
              size="large"
              onChange={(e) => updateQuery({ q: e.target.value })}
              value={q}
              onSearch={val => fetchData({ q: val })}
              style={{ marginBottom: '16px' }}
            />
            }
            <div className={classes.scrollContainer}>
              <Table
                columns={columns}
                dataSource={data.results}
                bordered
                title={() => Header}
                pagination={{
                  total: data.count,
                  current: 1 + data.offset / data.limit,
                  pageSize: data.limit,
                  onChange: page => fetchData({ q: q, offset: (page - 1) * data.limit }),
                  position: data.count <= data.limit ? 'node' : 'bottom'
                }}
                loading={loading}
                className={classes.table}
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
  searchable: PropTypes.bool
};

export default injectSheet(styles)(injectIntl(DataTable));

