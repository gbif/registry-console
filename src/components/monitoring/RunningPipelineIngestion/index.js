import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Alert, Col, Input, Switch, Row, Select, Spin, Table } from 'antd';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
// import { startCase } from 'lodash';
import { pipelinesIngestionSearch } from '../../../api/monitoring';
import Actions from './ingestion.actions';
import ItemHeader from '../../common/ItemHeader';
import Paper from '../../search/Paper';

import { columns } from './columns';

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

class RunningPipelineIngestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      error: undefined,
      q: '',
      limit: 10, // default value
      live: false
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
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  getData() {
    this.load().then(response => { }).catch(error => {
      if (this._isMount) {
        this.setState({ error });
      }
    });
  }

  load = async () => {
    let response = await pipelinesIngestionSearch();
    if (this._isMount) {
      this.setState({
        loading: false,
        data: response
      });
      this.updateLiveProcess();
      this.setState({
        loading: false,
        data: response
      });
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
      this.timeoutId = setTimeout(() => this.getData(), 10000);
    }
  };

  // Filtering original list using all parameters set by user manually
  getFiltered = () => {
    const { data, q } = this.state;
    return data.filter(e => {
      return q === '' || e.attempt === q || e.datasetKey === q || (e.datasetTitle && e.datasetTitle.toLowerCase().includes(q.toLowerCase()));
    });
  };

  getHeader = filteredResults => {
    const { loading } = this.state;
    const data = filteredResults;
    return (
      loading ?
        <Spin size="small" /> :
        <FormattedMessage
          id="nResultsInTotal"
          defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}} in total`}
          values={{ formattedNumber: <FormattedNumber value={data.length} />, count: data.length }}
        />
    );
  };

  renderStep = step => {
    return <div>
      <strong>{step.type}</strong>
      <div>
        <span>Started: {step.started}</span><span style={{marginLeft: 20}}> Finished: {step.finished}</span>
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
      {/* <ul style={{ padding: 0, listStyleType: 'none' }}>{
        record.steps.map(step => <li key={step.type} style={{marginBottom: 30}}>
          {this.renderStep(step)}
        </li>)}
      </ul> */}
      <div style={{ whiteSpace: 'nowrap' }}>
        <pre>{JSON.stringify(record, null, 2)}</pre>
      </div>
    </React.Fragment>
    // if (!record.metrics || record.metrics.length === 0) {
    //   return <div>No metrics provided</div>
    // }
    // return <ul style={{ padding: 0, listStyleType: 'none' }}>{
    //   record.metrics.map(x => <li key={x.name} style={{ whiteSpace: 'nowrap' }}>
    //     <span style={{ textAlign: 'right', display: 'inline-block', marginRight: 20, minWidth: 100 }}>{<FormattedNumber value={x.value || 0}/>}</span>
    //     {/* <span style={{ margin: '0 20px', display: 'inline-block', minWidth: 250 }}>{startCase(x.name.split('.').pop())}</span> */}
    //     {x.name}
    //   </li>)}
    // </ul>
  }

  render() {
    const { data, loading, error } = this.state;
    const { classes, intl } = this.props;
    const results = this.getFiltered();
    // Parameters for ItemHeader with BreadCrumbs and page title
    const category = intl.formatMessage({ id: 'monitoring', defaultMessage: 'Monitoring' });
    const listName = intl.formatMessage({ id: 'pipelineIngestion', defaultMessage: 'Running pipeline ingestions' });
    const pageTitle = intl.formatMessage({
      id: 'title.pipelineIngestion',
      defaultMessage: 'Running pipeline ingestions | GBIF Registry'
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
              <Col xs={24} sm={24} md={12}>
                <Input.Search
                  type="text"
                  placeholder={translatedSearch}
                  style={{ marginBottom: '16px' }}
                  onInput={this.onSearch}
                  className={classes.search}
                />
              </Col>

              <Col xs={24} sm={24} md={12} className={classes.checkboxes}>
                <Select defaultValue={10} className={classes.select} onChange={this.onLimitChange}>
                  <Select.Option value={10}>10</Select.Option>
                  <Select.Option value={25}>25</Select.Option>
                  <Select.Option value={50}>50</Select.Option>
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
            </Row>
            <Row>
              <Col span={24}>
                <div className={classes.scrollContainer}>
                  <Table
                    bordered
                    title={() => this.getHeader(results)}
                    loading={loading}
                    columns={columns}
                    scroll={{ x: 870 }}
                    rowKey={record => `${record.datasetKey}_${record.attempt}`}
                    expandedRowRender={this.expandedRowRender}
                    // rowClassName={record => (record.metrics && record.metrics.length > 0 ? "show" : "hidden")}
                    dataSource={results}
                    pagination={{ pageSize: this.state.limit }}
                  />
                </div>

                {!error && data.length > 0 && results.length === 0 && <Alert
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

export default injectIntl(injectSheet(styles)(RunningPipelineIngestion));