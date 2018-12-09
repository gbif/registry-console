import React, { Fragment } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Input, Table, Spin, Alert, Row, Col, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const Search = Input.Search;

const DataTable = props => {
  const { searchable, updateQuery, fetchData, data, query, loading, error, columns, noHeader, user } = props;
  const { q } = query;
  const Header = loading ? <Spin size="small"/> :
    <FormattedMessage
      id="nResults"
      defaultMessage={`{resultCount, number} {resultCount, plural,
        one {results}
        other {results}
      }
    `}
      values={{ resultCount: data.count, q }}
    />;
  const translatedSearch = props.intl.formatMessage({ id: 'search', defaultMessage: 'Search' });
  // TODO probably, it'd better not to have such logic here
  const createNew = () => {
    props.history.push('create');
  };

  return (
    <Fragment>
      {!error &&
      <div style={{ background: 'white', padding: 16 }}>
        <Row>
          {user && <Col span={4}>
            <Button htmlType="button" type="primary" size="large" onClick={() => createNew()}>
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Button>
          </Col>}
          <Col span={user ? 20 : 24}>
            {searchable && <Search
              placeholder={translatedSearch}
              enterButton={translatedSearch}
              size="large"
              onChange={(e) => updateQuery({ q: e.target.value })}
              value={q}
              onSearch={val => fetchData({ q: val })}
              style={{ marginBottom: '16px' }}
            />}
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data.results}
          bordered
          title={noHeader ? null : () => Header}
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
        message={<FormattedMessage id="error.title" defaultMessage="Error"/>}
        description={<FormattedMessage
          id="error.description"
          defaultMessage="An error happened while trying to process your request. Please report the error at https://github.com/gbif/portal-feedback/issues/new"
        />}
        type="error"
        showIcon
      />}
    </Fragment>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withRouter(injectIntl(DataTable)));

