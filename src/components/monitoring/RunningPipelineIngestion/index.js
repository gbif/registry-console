import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Alert, Checkbox, Col, Input, Row, Select, Spin, Table } from 'antd';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';

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
    pipelinesIngestionSearch().then(response => {
      if (this._isMount) {
        this.setState({
          loading: false,
          data: response
        });
        this.updateLiveProcess();
      }
    }).catch(error => {
      if (this._isMount) {
        this.setState({ error });
      }
    });
  }

  onSearch = event => {
    this.setState({ q: event.target.value });
  };

  onLimitChange = value => {
    this.setState({ limit: value });
  };

  toggleLive = event => {
    this.setState({ live: event.target.checked }, this.updateLiveProcess);
  };

  updateLiveProcess = () => {
    if (!this.state.live && this.timeoutId) {
      clearTimeout(this.timeoutId);
    } else if (this.state.live && this._isMount) {
      this.timeoutId = setTimeout(() => this.getData(), 2000);
    }
  };

  // Filtering original list using all parameters set by user manually
  getFiltered = () => {
    const { data, q } = this.state;
    return data.filter(e => {
      return q === '' || e.attempt === q || e.datasetKey === q || (e.datasetTitle && e.datasetTitle.toLowerCase().includes(q.toLowerCase()));
    });
  };

  getHeader = () => {
    const { loading, data } = this.state;
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

  render() {
    const { data, loading, error } = this.state;
    const { classes, intl } = this.props;
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
                <Select defaultValue={10} className={classes.select} onChange={this.onLimitChange}>
                  <Select.Option value={10}>10</Select.Option>
                  <Select.Option value={25}>25</Select.Option>
                  <Select.Option value={50}>50</Select.Option>
                  <Select.Option value={100000}>
                    <FormattedMessage id="all" defaultMessage="All" />
                  </Select.Option>
                </Select>
              </Col>

              <Col xs={24} sm={24} md={12} className={classes.checkboxes}>
                <Checkbox onChange={this.toggleLive} name="live">
                  <FormattedMessage id="ingestion.checkbox.liveView" defaultMessage="Live view" />
                </Checkbox>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div className={classes.scrollContainer}>
                  <Table
                    columns={columns}
                    rowKey="crawlId"
                    expandedRowRender={record => <ul>{record.metricInfos.map(x => <li key={x.name}>{x.name} - {x.value}</li>)}</ul>}
                    dataSource={this.getFiltered()}
                  />
                </div>

                {!error && <Alert
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