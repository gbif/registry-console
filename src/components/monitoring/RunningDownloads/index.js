import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Button, Alert, Col, Input, Row, Select, Spin, Table } from 'antd';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import _get from 'lodash/get';
import truncate from 'lodash/truncate';
import config from '../../../api/util/config';
import { downloadSearch, deleteDownload } from '../../../api/monitoring';
import Actions from './ingestion.actions';
import ItemHeader from '../../common/ItemHeader';
import Paper from '../../search/Paper';
import RecordDetails from '../../common/RecordDetails';
import { ConfirmButton, DateValue } from '../../common';
import { Link } from 'react-router-dom';
// Wrappers
import withContext from '../../hoc/withContext';

const styles = ({ direction }) => ({
  scrollContainer: {
    overflow: 'auto',
    width: '100%'
  },
  search: {
    marginBottom: '16px'
  },
  select: {
    marginBottom: '16px',
    width: '100%'
  },
});

const downloadColumns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name" />,
    dataIndex: 'key',
    width: '365px',
    render: (key, record) => <div>
      {/* <a href={`${config.gbifUrl}/occurrence/download/${key}`}>{truncate(JSON.stringify(_get(record, 'request.predicate', {})), { 'length': 200 })}</a> */}
      <div>
        <span>Creator: <Link to={`/user/${record?.request?.creator}`}>{record?.request?.creator}</Link></span>
        <span style={{ margin: '0 8px' }}>Total records: {record.totalRecords}</span>
      </div>
      <div style={{ whiteSpace: 'nowrap', marginBottom: 12 }}>
        <RecordDetails crawl={record} text="View details" />
        <Button style={{ margin: '0 8px' }} size='small' href={`${config.gbifUrl}/occurrence/download/${key}`}>View on GBIF.org</Button>
        <Button size='small' href={`${config.dataApi_v1}/occurrence/download/${key}`}>View API response</Button>
      </div>

      <RecordDetails crawl={record} text={<div style={{ color: '#888', fontSize: 12 }}>{truncate(JSON.stringify(_get(record, 'request.predicate', {})), { 'length': 200 })}</div>} />
    </div>
  },
  {
    title: <FormattedMessage id="status" defaultMessage="Status" />,
    dataIndex: 'status',
    width: '110px'
  },
  {
    title: <FormattedMessage id="created" defaultMessage="Created" />,
    dataIndex: 'created',
    width: '250px',
    render: text => <DateValue value={text} />
  }
];

class RunningDownloads extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      selectedItems: [],
      error: null,
      filter: {
        source: '',
        status: 'RUNNING',
        limit: 10, // default value
        offset: 0, // default value
      },
      selectedRowKeys: []
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;

    this.getData();
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  handleDelete = key => {
    deleteDownload(key)
      .then(response => {
        this.props.addSuccess({ statusText: 'The download has been deleted' });
        this.getData();
      })
      .catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
  };

  getData() {
    downloadSearch(this.state.filter).then(response => {
      if (this._isMount) {
        this.setState({
          loading: false,
          data: response.data
        });
      }
    }).catch(error => {
      if (this._isMount) {
        this.setState({ error });
      }
    });
  }

  onSearch = event => {
    // https://reactjs.org/docs/events.html#event-pooling
    event.persist();
    this.setState(state => {
      return {
        filter: {
          ...this.state.filter,
          source: event.target.value
        }
      }
    }, this.getData);
  };

  onSelect = value => {
    this.setState(state => {
      return {
        filter: {
          ...this.state.filter,
          limit: value
        }
      };
    }, this.getData);
  };

  onStatusSelect = value => {
    this.setState(state => {
      return {
        filter: {
          ...state.filter,
          status: value
        }
      };
    }, this.getData);
  };

  // Setting selected row IDs to filter through this list
  onRowSelect = (e, key) => {
    const { selectedRowKeys } = this.state;
    if (e.target.checked) {
      this.setState({
        selectedRowKeys: selectedRowKeys.concat(key)
      });
    } else {
      this.setState({
        selectedRowKeys: selectedRowKeys.filter(rowKey => rowKey !== key)
      });
    }
  };

  getHeader = () => {
    const { loading, data } = this.state;

    return (
      loading ?
        <Spin size="small" /> :
        <FormattedMessage
          id="nResultsInTotal"
          defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}} in total`}
          values={{ formattedNumber: <FormattedNumber value={data.count} />, count: data.count }}
        />
    );
  };

  render() {

    // Adding column with Delete Dataset action
    const tableColumns = downloadColumns.concat({
      render: record => {
        if (record.status !== 'RUNNING') {
          return null;
        }
        return <ConfirmButton
          title={<div style={{ maxWidth: 400 }}>
            Delete this running download?
          </div>}
          onConfirm={() => this.handleDelete(record.key)}
          type={'button'}
          btnText={<FormattedMessage id="remove" defaultMessage="Remove" />}
        />
      }
    });

    const { loading, error, data } = this.state;
    const { classes, intl } = this.props;
    // Parameters for ItemHeader with BreadCrumbs and page title
    const category = intl.formatMessage({ id: 'monitoring', defaultMessage: 'Monitoring' });
    const listName = intl.formatMessage({ id: 'crawls', defaultMessage: 'Downloads' });
    const pageTitle = intl.formatMessage({
      id: 'title.downloadHistory',
      defaultMessage: 'Download history | GBIF Registry'
    });
    const translatedSearch = intl.formatMessage({ id: 'searchTable', defaultMessage: 'Search table' });

    console.log(data);
    return (
      <React.Fragment>
        <ItemHeader
          listType={[category]}
          pageTitle={pageTitle}
          title={listName}
        >
          <Actions />
        </ItemHeader>
        {!error && (
          <Paper padded>
            <Row gutter={8}>
              <Col xs={24} sm={24} md={9}>
                <Input.Search
                  type="text"
                  placeholder={translatedSearch}
                  style={{ marginBottom: '16px' }}
                  onInput={this.onSearch}
                  className={classes.search}
                />
              </Col>

              <Col xs={24} sm={24} md={3}>
                <Select defaultValue={10} className={classes.select} onChange={this.onSelect}>
                  <Select.Option value={10}>10</Select.Option>
                  <Select.Option value={25}>25</Select.Option>
                  <Select.Option value={50}>50</Select.Option>
                  <Select.Option value={100000}>
                    <FormattedMessage id="all" defaultMessage="All" />
                  </Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={24} md={3}>
                <Select value={this.state.filter.status} className={classes.select} onChange={this.onStatusSelect}>
                  <Select.Option value="RUNNING">Running</Select.Option>
                  <Select.Option value="SUCCEEDED">Succeeded</Select.Option>
                  <Select.Option value="CANCELLED">Cancelled</Select.Option>
                </Select>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div className={classes.scrollContainer}>
                  <Table
                    columns={tableColumns}
                    dataSource={data.results || []}
                    bordered
                    title={this.getHeader}
                    rowKey={record => record.key}
                    pagination={data.results ? {
                      total: data.count,
                      current: 1 + data.offset / data.limit,
                      pageSize: data.limit,
                      position: data.count <= data.limit ? 'node' : 'bottom'
                    } : { total: 0, current: 1, pageSize: 10 }}
                    // scroll={{ x: width || 870 }}
                    loading={loading}
                    onChange={({ current, pageSize }, filters) => {
                      this.setState(state => {
                        return {
                          filter: {
                            ...state.filter,
                            limit: pageSize,
                            offset: (current - 1) * pageSize,
                          }
                        }
                      }, this.getData);
                    }}
                  />
                </div>

                {!error && this.state?.filter?.source !== '' && data.count === 0 && <Alert
                  description="The source text need to match the record perfectly - there is no fuzzy or partial matching"
                  type="warning"
                />}
              </Col>
            </Row>
          </Paper>
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
  }
}

const mapContextToProps = ({ addSuccess, addError }) => ({ addError, addSuccess });

export default withContext(mapContextToProps)(injectIntl(injectSheet(styles)(RunningDownloads)));
