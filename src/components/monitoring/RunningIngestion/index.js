import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Alert, Col, Row, Table } from 'antd';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';

import { ingestionSearch } from '../../../api/monitoring';
import Actions from './ingestion.actions';
import ItemHeader from '../../common/ItemHeader';
import Paper from '../../search/Paper';
import FormattedColoredNumber from './FormattedColoredNumber';
import CrawlDetails from '../OverIngested/CrawlDetails';
import IngestionHistoryLink from '../OverIngested/IngestionHistoryLink';
import LogsLink from './LogsLink';
import GBIFIconLink from './GBIFIconLink';
import TableTitle from './TableTitle';
import GBIFLink from '../../common/GBIFLink';

const styles = {
  scrollContainer: {
    overflow: 'auto',
    width: '100%'
  },
  table: {
    minWidth: '1200px',
    '& .small-cell': {
      paddingLeft: 0,
      paddingRight: 0
    }
  }
};
const columns = [
  {
    title: <TableTitle
      title={<FormattedMessage id="url" defaultMessage="URL"/>}
      text={<FormattedMessage id="url" defaultMessage="URL"/>}
    />,
    dataIndex: 'dataset',
    render: dataset => <GBIFLink uuid={dataset.key} link="dataset">{dataset.title}</GBIFLink>
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="declaredCount.full" defaultMessage="Declared count"/>}
      text={<FormattedMessage id="declaredCount.short" defaultMessage="DC"/>}
    />,
    key: 'declaredCount',
    render: crawl => <FormattedColoredNumber
      value={crawl.declaredCount}
      green={crawl.declaredCount === crawl.rawOccurrencesPersistedNew + crawl.rawOccurrencesPersistedUpdated + crawl.rawOccurrencesPersistedUnchanged}
    />
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="pagesCrawled.full" defaultMessage="Pages crawled"/>}
      text={<FormattedMessage id="pagesCrawled.short" defaultMessage="PC"/>}
    />,
    dataIndex: 'pagesCrawled',
    render: text => <FormattedNumber value={text}/>
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="pagesFragmentedSuccessful.full" defaultMessage="Pages fragmented successfully"/>}
      text={<FormattedMessage id="pagesFragmentedSuccessful.short" defaultMessage="PFS"/>}
    />,
    key: 'pagesFragmentedSuccessful',
    render: crawl => <FormattedColoredNumber
      value={crawl.pagesFragmentedSuccessful}
      green={crawl.pagesCrawled === crawl.pagesFragmentedSuccessful}
    />
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="pagesFragmentedError.full" defaultMessage="Pages not fragmented (error)"/>}
      text={<FormattedMessage id="pagesFragmentedError.short" defaultMessage="PFE"/>}
    />,
    key: 'pagesFragmentedError',
    render: crawl => <FormattedColoredNumber
      value={crawl.pagesFragmentedError}
      green={crawl.pagesFragmentedError > 0}
    />
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="fragmentsEmitted.full" defaultMessage="Fragments emitted"/>}
      text={<FormattedMessage id="fragmentsEmitted.short" defaultMessage="FE"/>}
    />,
    dataIndex: 'fragmentsEmitted',
    render: text => <FormattedNumber value={text}/>,
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.fragmentsEmitted - b.fragmentsEmitted
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="fragmentsReceived.full" defaultMessage="Fragments received"/>}
      text={<FormattedMessage id="fragmentsReceived.short" defaultMessage="FR"/>}
    />,
    key: 'fragmentsReceived',
    render: crawl => <FormattedColoredNumber
      value={crawl.fragmentsReceived}
      green={crawl.fragmentsEmitted === crawl.fragmentsReceived}
    />
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="rawOccurrencesPersistedNew.full" defaultMessage="Raw occurrences persisted (new)"/>}
      text={<FormattedMessage id="rawOccurrencesPersistedNew.short" defaultMessage="RON"/>}
    />,
    dataIndex: 'rawOccurrencesPersistedNew',
    render: text => <FormattedNumber value={text}/>
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="rawOccurrencesPersistedUpdated.full" defaultMessage="Raw occurrences persisted (modified)"/>}
      text={<FormattedMessage id="rawOccurrencesPersistedUpdated.short" defaultMessage="ROM"/>}
    />,
    dataIndex: 'rawOccurrencesPersistedUpdated',
    render: text => <FormattedNumber value={text}/>
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="rawOccurrencesPersistedUnchanged.full" defaultMessage="Raw occurrences persisted (unchanged)"/>}
      text={<FormattedMessage id="rawOccurrencesPersistedUnchanged.short" defaultMessage="ROU"/>}
    />,
    dataIndex: 'rawOccurrencesPersistedUnchanged',
    render: text => <FormattedNumber value={text}/>
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="rawOccurrencesPersistedError.full" defaultMessage="Raw occurrences persisted (error)"/>}
      text={<FormattedMessage id="rawOccurrencesPersistedError.short" defaultMessage="ROE"/>}
    />,
    key: 'rawOccurrencesPersistedError',
    render: crawl => <FormattedColoredNumber
      value={crawl.rawOccurrencesPersistedError}
      green={crawl.rawOccurrencesPersistedError > 0}
    />
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="verbatimOccurrencesPersistedSuccessful.full" defaultMessage="Verbatim occurrences persisted successfully"/>}
      text={<FormattedMessage id="verbatimOccurrencesPersistedSuccessful.short" defaultMessage="VOP"/>}
    />,
    dataIndex: 'verbatimOccurrencesPersistedSuccessful',
    render: text => <FormattedNumber value={text}/>
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="verbatimOccurrencesPersistedError.full" defaultMessage="Verbatim occurrences persisted (error)"/>}
      text={<FormattedMessage id="verbatimOccurrencesPersistedError.short" defaultMessage="VOE"/>}
    />,
    key: 'verbatimOccurrencesPersistedError',
    render: crawl => <FormattedColoredNumber
      value={crawl.verbatimOccurrencesPersistedError}
      green={crawl.verbatimOccurrencesPersistedError > 0}
    />
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="interpretedOccurrencesPersistedSuccessful.full" defaultMessage="Interpreted occurrences persisted successfully"/>}
      text={<FormattedMessage id="interpretedOccurrencesPersistedSuccessful.short" defaultMessage="OI"/>}
    />,
    key: 'interpretedOccurrencesPersistedSuccessful',
    render: crawl => <FormattedColoredNumber
      value={crawl.interpretedOccurrencesPersistedSuccessful}
      green={crawl.verbatimOccurrencesPersistedSuccessful === crawl.interpretedOccurrencesPersistedSuccessful}
    />
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="interpretedOccurrencesPersistedError.full" defaultMessage="Interpreted occurrences persisted (error)"/>}
      text={<FormattedMessage id="interpretedOccurrencesPersistedError.short" defaultMessage="OE"/>}
    />,
    key: 'interpretedOccurrencesPersistedError',
    render: crawl => <FormattedNumber
      value={crawl.interpretedOccurrencesPersistedError}
      green={crawl.interpretedOccurrencesPersistedError > 0}
    />
  },
  {
    width: '30px',
    render: crawl => <LogsLink uuid={crawl.datasetKey}/>,
    className: 'small-cell',
    align: 'center'
  },
  {
    width: '30px',
    render: crawl => <GBIFIconLink uuid={crawl.datasetKey} link="dataset"/>,
    className: 'small-cell',
    align: 'center'
  },
  {
    width: '30px',
    render: crawl => <IngestionHistoryLink uuid={crawl.datasetKey}/>,
    className: 'small-cell',
    align: 'center'
  },
  {
    width: '30px',
    render: crawl => <CrawlDetails crawl={crawl}/>,
    className: 'small-cell',
    align: 'center'
  }
];

class RunningIngestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      error: null
    };
  }

  componentDidMount() {
    ingestionSearch().then(response => {
      this.setState({
        loading: false,
        data: response
      });
    }).catch(error => this.setState({ error }));
  }

  render() {
    const { data, loading, error } = this.state;
    const { classes, intl } = this.props;
    // Parameters for ItemHeader with BreadCrumbs and page title
    const category = intl.formatMessage({ id: 'monitoring', defaultMessage: 'Monitoring' });
    const listName = intl.formatMessage({ id: 'ingestion', defaultMessage: 'Running ingestions' });
    const pageTitle = intl.formatMessage({
      id: 'title.ingestion',
      defaultMessage: 'Running ingestions | GBIF Registry'
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

export default injectIntl(injectSheet(styles)(RunningIngestion));