import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Alert, Col, Row, Select, Spin, Table, Pagination } from 'antd';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';

// import { startCase } from 'lodash';
import { pipelinesHistorySearch } from '../../../api/monitoring';
import Actions from './ingestion.actions';
import ItemHeader from '../../common/ItemHeader';
import Paper from '../../search/Paper';

import { columns } from './columns';

const styles = ({ direction }) => ({
  scrollContainer: {
    overflow: 'auto',
    width: '100%',
    '& tr.oddRow': {
      background: '#f5f5f5'
    }
  },
  table: {

  },
  select: {
    marginRight: 20
  },
  checkboxes: {
    marginBottom: 20
  }
});

class IngestionHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      results: [],
      count: 0,
      limit: 20, 
      offset: 0,
      error: undefined,
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    this.getData({limit: this.state.limit});
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getData = query => {
    this.setState({loading: true});
    this.load(query).then(response => { }).catch(error => {
      if (this._isMount) {
        this.setState({ error, loading: false });
      }
    });
  }

  load = async query => {
    query = query || {};
    let response = await pipelinesHistorySearch(query);

    //tranform response into multiple rows as that is the preferred office view these days
    let rows = [];
    response.results.forEach((r, index) => {
      if (!r.executions || r.executions.length === 0) {
        rows.push({ ...r, _execution: {key: 'none', type: 'PLACEHOLDER'}, even: index % 2=== 0, firstInGroup: true });
      } else {
        r.executions.forEach((e, i) => {
          rows.push({ ...r, _execution: e, even: index % 2=== 0, firstInGroup: i === 0 });
        })
      }
    });

    if (this._isMount) {
      this.setState({
        loading: false,
        results: rows,
        count: response.count,
        limit: response.limit, 
        offset: response.offset,
        error: false
      });
    }
  }

  onLimitChange = value => {
    this.setState({ limit: value });
    this.getData({limit: value});
  };

  getHeader = count => {
    const { loading } = this.state;
    return (
      loading ?
        <Spin size="small" /> :
        <FormattedMessage
          id="nResultsInTotal"
          defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}} in total`}
          values={{ formattedNumber: <FormattedNumber value={count} />, count: count }}
        />
    );
  };

  render() {
    const { results, count, limit, offset, loading, error } = this.state;
    const { classes, intl } = this.props;
    // Parameters for ItemHeader with BreadCrumbs and page title
    const category = intl.formatMessage({ id: 'monitoring', defaultMessage: 'Monitoring' });
    const listName = intl.formatMessage({ id: 'pipelineHistory', defaultMessage: 'Ingestion history' });
    const pageTitle = intl.formatMessage({
      id: 'title.pipelineHistory',
      defaultMessage: 'Ingestion history | GBIF Registry'
    });

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
              <Col xs={24} sm={24} md={12} className={classes.checkboxes}>
                <Select defaultValue={this.state.limit} className={classes.select} onChange={this.onLimitChange}>
                  <Select.Option value={10}>10</Select.Option>
                  <Select.Option value={25}>25</Select.Option>
                  <Select.Option value={50}>50</Select.Option>
                  <Select.Option value={100}>100</Select.Option>
                  <Select.Option value={250}>250</Select.Option>
                </Select>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div className={classes.scrollContainer} style={{overflow: 'auto', width: '100%'}}>
                  <Table
                    bordered
                    title={() => this.getHeader(count)}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: 870 }}
                    rowKey={record => `${record.datasetKey}_${record.attempt}_${record._execution.key}`}
                    rowClassName={(record, index) => record.even === true ? 'evenRow' : 'oddRow'}
                    dataSource={results}
                    pagination={false}
                    style={{ marginBottom: '16px' }}
                  />
                  <Pagination total={count} pageSize={limit} current={1 + offset / limit} onChange={( page, pageSize ) => {
                    this.getData({
                      offset: (page - 1) * pageSize,
                      limit: limit
                    })}}
                    />
                </div>

                {!error && !loading && results.length === 0 && <Alert
                  className={classes.warning}
                  description={<FormattedMessage
                    id="warning.ingestionFilters"
                    defaultMessage="If you have filters enabled you might not see anything"
                  />}
                  type="warning"
                />}
              </Col>
            </Row>
          </Paper>
        )}
        {error && console.error(error)}
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

export default injectIntl(injectSheet(styles)(IngestionHistory));
