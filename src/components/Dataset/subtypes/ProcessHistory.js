import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal, Row, Col, Button } from 'antd';

// APIs
import { getDatasetProcessHistory } from '../../../api/dataset';

// Components
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';
import { PresentationItem, PresentationGroupHeader, FormattedRelativeDate } from '../../common';

// Helpers
import { prettifyEnum } from '../../util/helpers';

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
		width: '125px',
		render: text => text && <FormattedRelativeDate value={text}/>
	},
	{
		title: <FormattedMessage id="finishedCrawling" defaultMessage="Finished crawling"/>,
		dataIndex: 'finishedCrawling',
		width: '125px',
		render: text => text && <FormattedRelativeDate value={text}/>
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
					render={props => <DataTable {...props} noHeader={true} columns={this.getColumns()} rowKey="crawlJob.attempt"/>}
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
						<PresentationGroupHeader title={<FormattedMessage id="Crawling" defaultMessage="Crawling"/>} />
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

						<PresentationGroupHeader title={<FormattedMessage id="RecordNormalization" defaultMessage="Record normalization (e.g. parsing XML)"/>} />
						<dl>
							{getPresentationItem('verbatimOccurrencesPersistedSuccessful')}
							{getPresentationItem('verbatimOccurrencesPersistedError')}
						</dl>

						<PresentationGroupHeader title={<FormattedMessage id="RecordInterpretation" defaultMessage="Record interpretation (e.g. quality, and nub lookup)"/>} />
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
