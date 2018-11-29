import React, { Fragment } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Input, Table, Spin, Alert } from 'antd';

const Search = Input.Search;

const DataTable = (props) => {
  const { searchable, updateQuery, fetchData, data, query, loading, error, columns } = props;
  const { q } = query
  const Header = loading ? <Spin size="small" /> : <FormattedMessage id="nResults"
    defaultMessage={`{resultCount, number} {resultCount, plural,
        one {results}
        other {results}
      }
    `}
    values={{ resultCount: data.count, q }}
  />;
  const translatedSearch = props.intl.formatMessage({id: 'search', defaultMessage: "Search"})
  return (
    <Fragment>
      {!error &&
        <div style={{ background: 'white', padding: 16 }}>
          {searchable && <Search
            placeholder={translatedSearch}
            enterButton={translatedSearch}
            size="large"
            onChange={(e) => updateQuery({ q: e.target.value })}
            value={q}
            onSearch={val => fetchData({q: val})}
            style={{ marginBottom: '16px' }}
          />
          }
          <Table
            columns={columns}
            dataSource={data.results}
            bordered
            title={() => Header}
            pagination={{
              total: data.count,
              current: 1 + data.offset / data.limit,
              pageSize: data.limit,
              onChange: page => fetchData({ q: q, offset: (page - 1) * data.limit })
            }}
            loading={loading}
          />
        </div>}
      {error && <Alert
      message={<FormattedMessage id="error.title" defaultMessage="Error" />}
      description={<FormattedMessage id="error.description" defaultMessage="An error happened while trying to process your request. Please report the error at https://github.com/gbif/portal-feedback/issues/new" />}
      type="error"
      showIcon
    />}
    </Fragment>
  )
}

export default injectIntl(DataTable)

