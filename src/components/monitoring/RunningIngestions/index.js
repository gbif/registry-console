import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Alert, Col, Input, Switch, Row, Select, Spin, Table, Pagination } from 'antd';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
// import { startCase } from 'lodash';
import { pipelinesRunningIngestion, finishAllExecution } from '../../../api/monitoring';
import Actions from './ingestion.actions';
import { ItemHeader, ConfirmButton } from '../../common';
import Paper from '../../search/Paper';
import { columns } from './columns';
import { HasRole, roles } from '../../auth';

const styles = ({ direction }) => ({
  scrollContainer: {
    overflow: 'auto',
    width: '100%'
  },
  table: {

  },
  select: {
    marginRight: 20
  }
});

class RunningIngestions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      error: undefined,
      count: 0,
      limit: 20,
      offset: 0,
      live: false
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
    if (this.timeoutId) clearTimeout(this.timeoutId);
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
    let response = await pipelinesRunningIngestion(query);

    //tranform response into multiple rows as that is the preferred office view these days
    let rows = [];
    response.results.forEach((r, index) => {
      if (!r.executions || r.executions.length === 0) {
        rows.push({ ...r, _execution: {key: 'none', type: 'PLACEHOLDER'}, even: index % 2=== 0 });
      } else {
        r.executions.forEach(e => {
          rows.push({ ...r, _execution: e, even: index % 2=== 0 });
        })
      }
    });

    if (this._isMount) {
      this.setState({
        loading: false,
        data: rows,
        count: response.count,
        limit: response.limit,
        offset: response.offset,
        error: false
      });
      this.updateLiveProcess();
    }
  }

  onSearch = event => {
    this.setState({ q: event.target.value });
  };

  onLimitChange = value => {
    this.setState({ limit: value });
  };

  toggleLive = checked => {
    this.setState({ live: checked }, this.updateLiveProcess);
  };

  updateLiveProcess = () => {
    if (!this.state.live && this.timeoutId) {
      clearTimeout(this.timeoutId);
    } else if (this.state.live && this._isMount) {
      this.timeoutId = setTimeout(() => this.getData({limit: this.state.limit}), 10000);
    }
  };

  getHeader = () => {
    const { count, loading } = this.state;
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

  renderStep = step => {
    return <div>
      <strong>{step.type}</strong>
      <div>
        <span>Started: {step.started}</span><span style={{ marginLeft: 20 }}> Finished: {step.finished}</span>
      </div>
      <ul style={{ padding: 0, listStyleType: 'none' }}>
        {
          step.metrics.map(x => <li key={x.name} style={{ whiteSpace: 'nowrap' }}>
            <span style={{ textAlign: 'right', display: 'inline-block', marginRight: 20, minWidth: 100 }}>
              {/* {<FormattedNumber value={x.value || 0} />} */}
              {x.value}
            </span>
            {x.name}
          </li>)}
      </ul>
    </div>
  }

  expandedRowRender = record => {
    return <React.Fragment>
      <div style={{ whiteSpace: 'nowrap' }}>
        <pre>{JSON.stringify(record, null, 2)}</pre>
      </div>
    </React.Fragment>
  }

  render() {
    const { data, count, limit, offset, loading, error } = this.state;
    const { classes, intl } = this.props;
    // Parameters for ItemHeader with BreadCrumbs and page title
    const category = intl.formatMessage({ id: 'monitoring', defaultMessage: 'Monitoring' });
    const listName = intl.formatMessage({ id: 'pipelineIngestion', defaultMessage: 'Running ingestions' });
    const pageTitle = intl.formatMessage({
      id: 'title.pipelineIngestion',
      defaultMessage: 'Running ingestions | GBIF Registry'
    });
    const translatedSearch = intl.formatMessage({ id: 'searchTable', defaultMessage: 'Search table' });

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
                <Select defaultValue={limit} style={{ marginBottom: '16px' }} className={classes.select} onChange={this.onLimitChange}>
                  <Select.Option value={10}>20</Select.Option>
                  <Select.Option value={25}>50</Select.Option>
                  <Select.Option value={50}>100</Select.Option>
                  <Select.Option value={100000}>
                    <FormattedMessage id="all" defaultMessage="All" />
                  </Select.Option>
                </Select>
                <Switch style={{ paddinTop: 4 }}
                  onChange={this.toggleLive}
                  checkedChildren={<FormattedMessage id="ingestion.checkbox.liveView" defaultMessage="Live view" />}
                  unCheckedChildren={<FormattedMessage id="ingestion.checkbox.liveView" defaultMessage="Live view" />}
                />
              </Col>
              <HasRole roles={roles.REGISTRY_ADMIN}>
                <ConfirmButton
                  title={<FormattedMessage id="delete.confirmation.generic" defaultMessage="Do you want to finish all execution?" />}
                  btnText={<FormattedMessage id="finish" defaultMessage="Finish all executions" />}
                  onConfirm={finishAllExecution}
                  type={'danger'}
                />
              </HasRole>
            </Row>
            <Row>
              <Col span={24}>
                <div className={classes.scrollContainer} style={{ overflow: 'auto', width: '100%' }}>
                  <Table
                    bordered
                    title={() => this.getHeader(data)}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: 870 }}
                    rowKey={record => `${record.datasetKey}_${record.attempt}`}
                    dataSource={data}
                    pagination={false}
                  />
                  <Pagination total={count} pageSize={limit} current={1 + offset / limit} onChange={( page, pageSize ) => {
                    this.getData({
                      offset: (page - 1) * pageSize,
                      limit: limit
                    })}}
                    />
                </div>
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

export default injectIntl(injectSheet(styles)(RunningIngestions));
