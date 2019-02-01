import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Col, Row, Table } from 'antd';
import injectSheet from 'react-jss';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import _get from 'lodash/get';

import { getSyncState } from '../../api/installation';
import TableTitle from '../common/TableTitle';
import RecordDetails from '../common/RecordDetails';
import IngestionHistoryLink from '../common/IngestionHistoryLink';
import Actions from './syncState.actions';

const styles = {
  scrollContainer: {
    overflow: 'auto',
    width: '100%'
  },
  table: {
    minWidth: '800px',
    '& .small-cell': {
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: 'center'
    },
    '& .badge-green': {
      color: '#fff',
      padding: '3px 5px',
      borderRadius: '3px',
      background: '#8fbc8f'
    },
    '& .badge-red': {
      color: '#fff',
      padding: '3px 5px',
      borderRadius: '3px',
      background: 'tomato'
    }
  }
};
const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '200px',
    render: (text, record) => <Link to={`/dataset/${record.gbifKey}`}>{text}</Link>
  },
  {
    title: <FormattedMessage id="lastPublished" defaultMessage="Last published"/>,
    dataIndex: 'lastPublished'
  },
  {
    title: <FormattedMessage id="source" defaultMessage="Source"/>,
    dataIndex: 'dwca',
    render: link => <a href={link} target="_blank" rel="noopener noreferrer">DwCA</a>
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="iptCount.tooltip" defaultMessage="Occurrences according to the IPT"/>}
      text={<FormattedMessage id="iptCount" defaultMessage="IPT count"/>}
    />,
    dataIndex: 'records',
    render: text => <FormattedNumber value={text}/>
  },
  {
    title: <TableTitle
      title={<FormattedMessage id="gbifCount.tooltip" defaultMessage="Occurrences in the GBIF index"/>}
      text={<FormattedMessage id="gbifCount" defaultMessage="GBIF count"/>}
    />,
    dataIndex: '_gbifCount',
    render: (text, record) => (
      <span className={record.occurrenceCount !== record._gbifCount ? 'badge-red' : 'badge-green'}>
        <FormattedNumber value={text}/>
      </span>
    )
  },
  {
    width: '30px',
    render: record => <IngestionHistoryLink uuid={record.gbifKey}/>,
    className: 'small-cell'
  },
  {
    width: '30px',
    render: record => <RecordDetails crawl={record}/>,
    className: 'small-cell'
  }
];

class SyncState extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      error: null
    };
  }

  componentDidMount() {
    const { endpoints } = this.props;
    const feedEndpoints = endpoints.filter(endpoint => endpoint.type === 'FEED');
    // If there is no at least one endpoint with type = FEED, we should interrupt request
    if (feedEndpoints.length === 0) {
      this.setState({ loading: false });
      return;
    }
    // Preparing URL
    const iptBaseURL = this.getUrl(feedEndpoints[0].url);

    getSyncState(iptBaseURL).then(response => {
      const data = response.registeredResources;
      data.forEach(item => {
        if (item.type === 'OCCURRENCE') {
          item.occurrenceCount = item.records;
        } else {
          item.occurrenceCount = _get(item, 'recordsByExtension["http://rs.tdwg.org/dwc/terms/Occurrence"]', 0);
        }
      });
      this.setState({
        data: response.registeredResources,
        loading: false
      });
    }).catch(error => {
      this.setState({
        loading: false,
        error
      });
    });
  }

  // Removing everything after 'ipt' if there is something
  getUrl(url) {
    if (url.endsWith('ipt')) {
      return url;
    }

    const index = url.indexOf('ipt');
    return url.slice(0, index + 3); // 3 - length of 'ipt' word
  }

  render() {
    const { data, loading, error } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.scrollContainer}>
        <Row>
          <Col span={20}>
            <h2><FormattedMessage id="syncState" defaultMessage="Sync state"/></h2>
          </Col>
          <Col span={4} className="text-right">
            <Actions/>
          </Col>
        </Row>


        {!error && (
          <Table
            bordered
            columns={columns}
            dataSource={data}
            rowKey={record => record.gbifKey}
            loading={loading}
            pagination={false}
            className={classes.table}
          />
        )}
        {error && (
          <Alert
            message={<FormattedMessage id="error.title.syncState" defaultMessage="Failed to get inventory"/>}
            description={<FormattedMessage
              id="error.description.syncState"
              defaultMessage="This might have failed due to {url}. Please upgrade to the latest IPT to use this functionality."
              values={{
                url: <a href="https://github.com/gbif/ipt/issues/1344" target="_blank" rel="noopener noreferrer">
                  IPT Bug 1344
                </a>
              }}
            />}
            type="error"
            showIcon
          />
        )}
      </div>
    );
  }
}

SyncState.propTypes = {
  endpoints: PropTypes.array
};

export default injectSheet(styles)(SyncState);