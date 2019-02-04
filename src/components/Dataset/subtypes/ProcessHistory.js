import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal, Row, Col, Button } from 'antd';
import moment from 'moment';

// APIs
import { getDatasetProcessHistory } from '../../../api/dataset';

// Components
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';
import { PresentationItem, PresentationGroupHeader, FormattedRelativeDate } from '../../common';

// Helpers
import { prettifyEnum } from '../../util/helpers';
import BadgeNumber from '../../common/BadgeNumber';
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
		render: (number, record) => <BadgeNumber
      number={number}
      red={record.fragmentsReceived - record.rawOccurrencesPersistedNew - record.rawOccurrencesPersistedUpdated - record.rawOccurrencesPersistedUnchanged - record.rawOccurrencesPersistedError !== 0}
    />
	},
	{
		title: <FormattedMessage id="new" defaultMessage="New"/>,
		dataIndex: 'rawOccurrencesPersistedNew',
		render: text => <BadgeNumber value={text}/>
	},
	{
		title: <FormattedMessage id="updated" defaultMessage="Updated"/>,
		dataIndex: 'rawOccurrencesPersistedUpdated',
		render: text => <BadgeNumber value={text}/>
	},
	{
		title: <FormattedMessage id="unchanged" defaultMessage="Unchanged"/>,
		dataIndex: 'rawOccurrencesPersistedUnchanged',
		render: text => <BadgeNumber number={text}/>
	},
	{
		title: <FormattedMessage id="failed" defaultMessage="Failed"/>,
		dataIndex: 'rawOccurrencesPersistedError',
		render: number => <BadgeNumber number={number} red={number > 0}/>
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
			modalContent: undefined
		};
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

	render() {
		const { datasetKey, initQuery = { q: '', limit: 25, offset: 0 } } = this.props;
		const { modalContent } = this.state;
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
					render={props => <DataTable
            {...props}
            noHeader={true}
            columns={this.getColumns()}
            rowKey="crawlJob.attempt"
            width={1200}
          />}
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
