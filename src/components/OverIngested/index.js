import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';
import { Col, Row, Table } from 'antd';
import injectSheet from 'react-jss';

import { overIngestedSearch } from '../../api/monitoring';
import Paper from '../search/Paper';
import OffBy from './OffBy';
import CrawlInfo from './CrawlInfo';
import CrawlDetails from './CrawlDetails';
import IngestionHistoryLink from './IngestionHistoryLink';

const styles = {
  scrollContainer: {
    overflow: 'auto',
    width: '100%'
  },
  table: {
    minWidth: '600px',
    '& .small-cell': {
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: 'center'
    }
  }
};
const columns = [
  {
    title: <FormattedMessage id="dataset" defaultMessage="Dataset"/>,
    dataIndex: 'datasetKey',
    width: '200px',
    render: (text, record) => <Link to={`/dataset/${record.datasetKey}`}>{text}</Link>
  },
  {
    title: <FormattedMessage id="gbifCount" defaultMessage="GBIF count"/>,
    dataIndex: 'recordCount',
    width: '100px',
    render: text => <FormattedNumber value={text}/>,
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.recordCount - b.recordCount
  },
  {
    title: <FormattedMessage id="lastCrawlCount" defaultMessage="Last crawl count"/>,
    dataIndex: 'lastCrawlCount',
    width: '75px',
    render: text => <FormattedNumber value={text}/>
  },
  {
    title: <FormattedMessage id="offBy" defaultMessage="Off by %"/>,
    dataIndex: 'percentagePreviousCrawls',
    width: '50px',
    render: text => <OffBy percentage={text}/>
  },
  {
    title: <FormattedMessage id="lastCrawlId" defaultMessage="Last crawl id"/>,
    dataIndex: 'lastCrawlId',
    width: '75px',
    render: text => text
  },
  {
    title: <FormattedMessage id="histogram" defaultMessage="Histogram"/>,
    dataIndex: 'crawlInfo',
    width: '100px',
    render: text => <CrawlInfo crawlInfo={text}/>
  },
  {
    width: '30px',
    render: crawl => <IngestionHistoryLink uuid={crawl.datasetKey}/>,
    className: 'small-cell'
  },
  {
    width: '30px',
    render: crawl => <CrawlDetails crawl={crawl}/>,
    className: 'small-cell'
  }
];

class OverIngested extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: []
    };
  }

  componentDidMount() {
    overIngestedSearch().then(response => {
      this.setState({
        loading: false,
        data: Object.values(response.data)
      });
    });
  }

  render() {
    const { data, loading } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Paper>
          <Row>
            <Col spab={24}>
              <div className={classes.scrollContainer}>
                <Table
                  bordered
                  columns={columns}
                  dataSource={data}
                  rowKey={record => record.datasetKey}
                  loading={loading}
                  pagination={false}
                  className={classes.table}
                />
              </div>
            </Col>
          </Row>
        </Paper>
      </React.Fragment>
    );
  }
}

export default injectSheet(styles)(OverIngested);