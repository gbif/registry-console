import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Alert, Col, Row, Table } from 'antd';
import injectSheet from 'react-jss';

import { overIngestedSearch } from '../../../api/monitoring';
import Paper from '../../search/Paper';
import OffBy from './OffBy';
import CrawlInfo from './CrawlInfo';
import RecordDetails from '../../common/RecordDetails';
import IngestionHistoryLink from '../../common/IngestionHistoryLink';
import ItemHeader from '../../common/ItemHeader';
import Actions from './overingested.actions';

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
    render: crawl => <RecordDetails crawl={crawl}/>,
    className: 'small-cell'
  }
];

class OverIngested extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      error: null
    };
  }

  componentDidMount() {
    overIngestedSearch().then(response => {
      this.setState({
        loading: false,
        data: Object.values(response.data)
      });
    }).catch(error => this.setState({ error }));
  }

  render() {
    const { data, loading, error } = this.state;
    const { classes, intl } = this.props;
    // Parameters for ItemHeader with BreadCrumbs and page title
    const category = intl.formatMessage({ id: 'monitoring', defaultMessage: 'Monitoring' });
    const listName = intl.formatMessage({ id: 'overingested', defaultMessage: 'Over-ingested datasets' });
    const pageTitle = intl.formatMessage({
      id: 'title.overingested',
      defaultMessage: 'Over-ingested datasets | GBIF Registry'
    });

    return (
      <React.Fragment>
        <ItemHeader
          listType={[category, listName]}
          pageTitle={pageTitle}
          title={listName}
        >
          <Actions/>
        </ItemHeader>

        {!error && (
          <Paper padded>
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
  }
}

export default injectIntl(injectSheet(styles)(OverIngested));