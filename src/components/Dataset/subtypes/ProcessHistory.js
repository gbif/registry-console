import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal, Row, Col, Button, Tooltip } from 'antd';
import moment from 'moment';
import _ from 'lodash';

// APIs
import { getDatasetProcessHistory, getDatasetOccurrences } from '../../../api/dataset';

// Components
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';
import { PresentationItem, PresentationGroupHeader, FormattedRelativeDate } from '../../common';

// Helpers
import { prettifyEnum } from '../../util/helpers';
import BadgeValue from '../../common/BadgeValue';
import RecordDetails from '../../common/RecordDetails';

const columns = [
	{
		title: <FormattedMessage id="finishReason" defaultMessage="Finish reason"/>,
		dataIndex: 'finishReason',
		width: '200px',
		render: text => text && <FormattedMessage id={`crawl.finishReason.${text}`} defaultMessage={text}/>
	},
	{
		title: <FormattedMessage id="startedCrawling" defaultMessage="Started Crawling"/>,
		dataIndex: 'startedCrawling',
		width: '100px',
		render: text => text && <FormattedRelativeDate value={text}/>
	},
	{
		title: <FormattedMessage id="finishedCrawling" defaultMessage="Finished crawling"/>,
		dataIndex: 'finishedCrawling',
		width: '100px',
		render: text => text && <FormattedRelativeDate value={text}/>
	},
	{
		title: <FormattedMessage id="duration" defaultMessage="Duration"/>,
		key: 'duration',
		width: '100px',
		render: record => moment.duration(moment(record.finishedCrawling).diff(moment(record.startedCrawling))).humanize()
	},
	{
		title: <FormattedMessage id="received" defaultMessage="Received"/>,
		dataIndex: 'fragmentsReceived',
		render: (number, record) => (
      <Tooltip title={<FormattedMessage id="tooltip.fragmentsReceived" defaultMessage="Received fragments expected to equal New + Updated + Unchanged + Errors"/>}>
        <BadgeValue
          value={number}
          red={record.fragmentsReceived - record.rawOccurrencesPersistedNew - record.rawOccurrencesPersistedUpdated - record.rawOccurrencesPersistedUnchanged - record.rawOccurrencesPersistedError !== 0}
          number
        />
      </Tooltip>
    )
	},
	{
		title: <FormattedMessage id="new" defaultMessage="New"/>,
		dataIndex: 'rawOccurrencesPersistedNew',
		render: text => <BadgeValue value={text} number/>
	},
	{
		title: <FormattedMessage id="updated" defaultMessage="Updated"/>,
		dataIndex: 'rawOccurrencesPersistedUpdated',
		render: text => <BadgeValue value={text} number/>
	},
	{
		title: <FormattedMessage id="unchanged" defaultMessage="Unchanged"/>,
		dataIndex: 'rawOccurrencesPersistedUnchanged',
		render: text => <BadgeValue number={text} number/>
	},
	{
		title: <FormattedMessage id="failed" defaultMessage="Failed"/>,
		dataIndex: 'rawOccurrencesPersistedError',
		render: number => <BadgeValue number={number} red={number > 0} number/>
	},
  {
    width: '30px',
    render: crawl => <RecordDetails crawl={crawl}/>,
    className: 'small-cell'
  }
];

export class ProcessHistory extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			modalContent: undefined,
      occurrences: null
		};
	}

	componentDidMount() {
    const { datasetKey } = this.props;
    getDatasetOccurrences(datasetKey).then(response => {
      this.setState({
        occurrences: response.data
      })
    });
  }

  getColumns = () => {
		return [
			{
				title: <FormattedMessage id="title" defaultMessage="Title"/>,
				dataIndex: 'crawlJob.attempt',
				width: '300px',
				render: (attemptNr, record) => (
					<button className="actionLink" onClick={() => this.setState({modalContent: record})}>
						<FormattedMessage id="crawlAttemptX"
															defaultMessage={`${attemptNr}`}
															values={{ attemptNr: attemptNr }}/>
					</button>)
			},
			...columns
		];
	};

  isOutOfSync = (data, count) => {
    console.log(data, count);
    const results = data.results || [];
    let first = _.find(results, e  => e.finishReason === 'NORMAL');
    if (!first) {
      return false;
    }
    let offBy = Math.abs((count / _.get(first, 'fragmentsReceived', count)) - 1);
    return offBy > 0.1;
  };

	render() {
		const { datasetKey, initQuery = { q: '', limit: 25, offset: 0 } } = this.props;
		const { modalContent, occurrences } = this.state;
		console.log(occurrences);
		const hasModalContent = !!modalContent;

		const getPresentationItem = field => {
			return <PresentationItem label={<FormattedMessage id={`${field}.full`} defaultMessage={prettifyEnum(field)}/>} md={16} size="small">
				{typeof this.state.modalContent[field] !== 'undefined' && <FormattedNumber value={this.state.modalContent[field]} />}
			</PresentationItem>
		};
		return (
			<React.Fragment>
				<h2>
					<FormattedMessage id="crawlHistory" defaultMessage="Ingestion"/>
				</h2>
				<DataQuery
					api={query => getDatasetProcessHistory(datasetKey, query)}
					initQuery={initQuery}
					render={props => (
            <React.Fragment>
              <div style={{ marginBottom: '16px' }}>
                <FormattedMessage
                  id="occurrencesInGBIF"
                  defaultMessage="{count} occurrences in the GBIF index"
                  values={{
                    count: occurrences ? <FormattedNumber value={occurrences.count}/> : 0
                  }}
                />
                {occurrences && this.isOutOfSync(props.data, occurrences.count) && (
                  <Tooltip
                    title={<FormattedMessage
                      id="outOfSync.tooltip"
                      defaultMessage="Last NORMAL ingestion process received count doesn't equal occurrence index count"
                    />}
                  >
                    <BadgeValue value={<FormattedMessage id="outOfSync" defaultMessage="Out of sync"/>} red={true}/>
                  </Tooltip>
                )}
              </div>
              <DataTable
                {...props}
                columns={this.getColumns()}
                rowKey="crawlJob.attempt"
                width={1200}
                noHeader
              />
            </React.Fragment>
          )}
				/>
				{hasModalContent && <Modal
						visible={hasModalContent}
						width={600}
						title={<Row>
							<Col span={20}>
								<FormattedMessage id="details.crawling" defaultMessage="Ingestion details"/>
							</Col>
						</Row>}
						destroyOnClose={true}
						closable={false}
						footer={[
							<Button key="submit" type="primary" onClick={() => this.setState({modalContent: undefined})}>
								Close
							</Button>
						]}
						onCancel={() => this.setState({modalContent: undefined})}
					>
						<PresentationGroupHeader title={<FormattedMessage id="crawling" defaultMessage="Crawling"/>} />
						<dl>
							{getPresentationItem('pagesCrawled')}
							{getPresentationItem('pagesFragmentedSuccessful')}
							{getPresentationItem('pagesFragmentedError')}
						</dl>

						<PresentationGroupHeader title={<FormattedMessage id="recordPersisting" defaultMessage="Record persisting"/>} />
						<dl>
							{getPresentationItem('fragmentsEmitted')}
							{getPresentationItem('fragmentsReceived')}
							{getPresentationItem('rawOccurrencesPersistedNew')}
							{getPresentationItem('rawOccurrencesPersistedUpdated')}
							{getPresentationItem('rawOccurrencesPersistedUnchanged')}
							{getPresentationItem('rawOccurrencesPersistedError')}
							{getPresentationItem('fragmentsProcessed')}
						</dl>

						<PresentationGroupHeader title={<FormattedMessage id="recordNormalization" defaultMessage="Record normalization (e.g. parsing XML)"/>} />
						<dl>
							{getPresentationItem('verbatimOccurrencesPersistedSuccessful')}
							{getPresentationItem('verbatimOccurrencesPersistedError')}
						</dl>

						<PresentationGroupHeader title={<FormattedMessage id="recordInterpretation" defaultMessage="Record interpretation (e.g. quality, and nub lookup)"/>} />
						<dl>
							{getPresentationItem('interpretedOccurrencesPersistedSuccessful')}
							{getPresentationItem('interpretedOccurrencesPersistedError')}
						</dl>
					</Modal>}
			</React.Fragment>
		)
	}
}

ProcessHistory.propTypes = {
  datasetKey: PropTypes.string.isRequired
};
