import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Modal, Checkbox, Input, Button, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

// API
import { crawlDataset, crawlDataset_pipeline, deleteDataset, updateDataset, rerunSteps, canRerunSteps } from '../../api/dataset';
import { allowFailedIdentifiers_pipeline } from '../../api/monitoring';
import { canDelete, canCreate, canUpdate } from '../../api/permissions';

// Wrappers
import withContext from '../hoc/withContext';

const { TextArea } = Input;

const styles = {
  checkboxes: {
    '& label': {
      display: 'block'
    },
    '& textArea': {
      marginBottom: 10
    }
  }
};

/**
 * Dataset Actions component
 * @param dataset - active item object
 * @param onChange - callback to invoke any parent process
 * @param intl - react-intl injected object responsible for localization
 * @returns {*}
 * @constructor
 */
class DatasetActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      steps: [],
      reason: '',
      lastSuccessful: false,
      excludeEventSteps: false
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    this.getPermissions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.getPermissions();
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getPermissions = async () => {
    this.setState({ loadingPermissions: true });
    const hasDelete = await canDelete('dataset', this.props.dataset.key);
    const hasUpdate = await canUpdate('dataset', this.props.dataset.key);
    const hasCrawl = await canCreate('dataset', this.props.dataset.key, 'crawl');
    const hasCrawlPipeline = await canCreate('dataset', this.props.dataset.key, 'crawl', undefined, { platform: 'PIPELINES' });
    const hasRerun = await canRerunSteps({ datasetKey: this.props.dataset.key });
    if (this._isMount) {
      // update state
      this.setState({ hasDelete, hasUpdate, hasCrawl, hasCrawlPipeline, hasRerun });
    };
    //else the component is unmounted and no updates should be made
  }

  renderActionMenu = () => {
    const { dataset } = this.props;
    return <Menu onClick={event => this.callConfirmWindow(event.key)}>
      {dataset.deleted && (
        <Menu.Item key="restore" disabled={!this.state.hasUpdate}>
          <FormattedMessage id="restore.dataset" defaultMessage="Restore this dataset" />
        </Menu.Item>
      )}
      {!dataset.deleted && (
        <Menu.Item key="delete" disabled={!this.state.hasDelete}>
          <FormattedMessage id="delete.dataset" defaultMessage="Delete this dataset" />
        </Menu.Item>
      )}
      <Menu.Item key="pipelineCrawl" disabled={!this.state.hasCrawlPipeline}>
        <FormattedMessage id="pipeline.crawl" defaultMessage="Crawl with pipelines" />
      </Menu.Item>
      <Menu.Item key="rerun" disabled={!this.state.hasRerun}>
        <FormattedMessage id="pipeline.runSteps" defaultMessage="Run specific steps in pipeline" />
      </Menu.Item>
      <Menu.Item key="pipelineAllowIdentifiers" disabled={!this.state.hasRerun}>
        <FormattedMessage id="pipeline.allowIdentifiers" defaultMessage="Allow failed identifiers" />
      </Menu.Item>
    </Menu>;
  };

  callConfirmWindow = actionType => {
    const { dataset, intl } = this.props;
    let title;

    switch (actionType) {
      case 'crawl': {
        title = dataset.publishingOrganization.endorsementApproved ?
          intl.formatMessage({
            id: 'endorsed.crawl.message',
            defaultMessage: 'This will trigger a crawl of the dataset.'
          }) :
          intl.formatMessage({
            id: 'notEndorsed.crawl.message',
            defaultMessage: 'This dataset\'s publishing organization is not endorsed yet! This will trigger a crawl of the dataset, and should only be done in a 1_2_27 environment'
          });
        break;
      }
      case 'delete': {
        title = intl.formatMessage({
          id: 'delete.confirmation.dataset',
          defaultMessage: 'Are you sure to delete this dataset?'
        });
        break;
      }
      case 'restore': {
        title = intl.formatMessage({
          id: 'restore.confirmation',
          defaultMessage: 'Restoring a previously deleted entity will likely trigger significant processing'
        });
        break;
      }
      case 'pipelineCrawl': {
        title = intl.formatMessage({
          id: 'pipeline.confirmCrawl',
          defaultMessage: 'Recrawl the dataset with pipelines only.'
        });
        break;
      }
      case 'pipelineAllowIdentifiers': {
        title = intl.formatMessage({
          id: 'pipeline.confirmAllowIdentifiers',
          defaultMessage: 'Do you want to allow failed identifiers?'
        });
        break;
      }
      default:
        break;
    }

    if (title) {
      this.showConfirm(title, actionType);
    }

    if (actionType === 'rerun') {
      // open popup with options for which steps to rerun.
      let ms = intl.formatMessage({
        id: 'pipelie.confirmRerun',
        defaultMessage: 'Choose steps to rerun'
      });
      this.showRerunConfirm(ms);
    }
  };

  showConfirm = (title, actionType) => {
    Modal.confirm({
      title,
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk: () => this.callAction(actionType)
    });
  };

  onStepChange = steps => {
    this.setState({
      steps: steps
    });
  }

  onReasonChange = ({ target: { value } }) => {
    console.log(value);
    console.log(this.state);
    this.setState({ reason: value });
  };

  onUseLastSuccessful = event => {
   this.setState({
      lastSuccessful: event.target.checked
   });
 }

   onExcludeEventSteps = event => {
    this.setState({
       excludeEventSteps: event.target.checked
    });
  }

  getReason = () => this.state.reason;

  showRerunConfirm = title => {
    const { intl } = this.props;

    const reasonPlaceholder = intl.formatMessage({ id: 'pipeline.reasonPlaceholder', defaultMessage: 'Please provide a reason' });

    // step options - hardcoded for now as there is no API to get them from. But it should come.
    const options = [
      { label: intl.formatMessage({ id: 'pipeline.steps.TO_VERBATIM', defaultMessage: 'TO_VERBATIM' }), value: 'TO_VERBATIM' },
      { label: intl.formatMessage({ id: 'pipeline.steps.VERBATIM_TO_INTERPRETED', defaultMessage: 'VERBATIM_TO_INTERPRETED' }), value: 'VERBATIM_TO_INTERPRETED' },
      { label: intl.formatMessage({ id: 'pipeline.steps.INTERPRETED_TO_INDEX', defaultMessage: 'INTERPRETED_TO_INDEX' }), value: 'INTERPRETED_TO_INDEX' },
      { label: intl.formatMessage({ id: 'pipeline.steps.HDFS_VIEW', defaultMessage: 'HDFS_VIEW' }), value: 'HDFS_VIEW' },
      { label: intl.formatMessage({ id: 'pipeline.steps.FRAGMENTER', defaultMessage: 'FRAGMENTER' }), value: 'FRAGMENTER' },
      { label: intl.formatMessage({ id: 'pipeline.steps.EVENTS_VERBATIM_TO_INTERPRETED', defaultMessage: 'EVENTS_VERBATIM_TO_INTERPRETED' }), value: 'EVENTS_VERBATIM_TO_INTERPRETED' },
      { label: intl.formatMessage({ id: 'pipeline.steps.EVENTS_INTERPRETED_TO_INDEX', defaultMessage: 'EVENTS_INTERPRETED_TO_INDEX' }), value: 'EVENTS_INTERPRETED_TO_INDEX' },
      { label: intl.formatMessage({ id: 'pipeline.steps.EVENTS_HDFS_VIEW', defaultMessage: 'EVENTS_HDFS_VIEW' }), value: 'EVENTS_HDFS_VIEW' }
    ];

    const useLastSuccessful = { label: intl.formatMessage({ id: 'pipeline.useLastSuccessful', defaultMessage: 'Use the latest successful attempt' })};
    const excludeEventSteps = { label: intl.formatMessage({ id: 'pipeline.excludeEventSteps', defaultMessage: 'Exclude event steps' })};

    Modal.confirm({
      title,
      okText: 'Run',
      okType: 'primary',
      cancelText: 'Cancel',
      content: <div>
        <TextArea onChange={this.onReasonChange} placeholder={reasonPlaceholder} autosize />
        <Checkbox.Group style={{ marginTop: 15 }} defaultValue={[]} onChange={this.onStepChange} >
          <Row style={{width: "100%"}}>
            {options.map(o => <Col span={24} key={o.value}><Checkbox value={o.value}>{o.label}</Checkbox></Col>)}
          </Row>
        </Checkbox.Group>
        <Checkbox style={{ marginTop: 15 }} defaultChecked={false} onChange={this.onUseLastSuccessful}>{useLastSuccessful.label}</Checkbox>
        <Checkbox style={{ marginLeft: 0 }} defaultChecked={false} onChange={this.onExcludeEventSteps}>{excludeEventSteps.label}</Checkbox>
        <div style={{ marginTop: 15, color: 'tomato' }}>Choosing a reason and at least one step is required</div>
      </div>,
      onOk: this.rerun
    });
  };

  callAction = actionType => {
    switch (actionType) {
      case 'crawl':
        this.crawl();
        break;
      case 'delete':
        this.deleteItem();
        break;
      case 'restore':
        this.restoreItem();
        break;
      case 'pipelineCrawl':
        this.crawl_pipeline();
        break;
      case 'pipelineAllowIdentifiers':
        this.pipeline_allow_identifiers();
        break;
      default:
        break;
    }
  };

  crawl = () => {
    const { dataset, onChange } = this.props;
    crawlDataset(dataset.key).then(() => onChange(null, 'crawl')).catch(onChange);
  };

  crawl_pipeline = () => {
    const { dataset, onChange } = this.props;
    crawlDataset_pipeline(dataset.key).then(() => onChange(null, 'crawl')).catch(onChange);
  };

  rerun = () => {
    const { dataset, onChange } = this.props;
    const { steps, reason, lastSuccessful, excludeEventSteps } = this.state;
    // if (!steps || steps.length === 0) {
    //   addInfo({ status: 204, statusText: 'No steps selected' });
    //   return;
    // }
    // if (!reason || reason === '') {
    //   addError({ status: 500, statusText: 'No reason provided' });
    //   return;
    // }
    rerunSteps({ datasetKey: dataset.key, steps: steps, reason: reason, lastSuccessful: lastSuccessful, excludeEventSteps: excludeEventSteps }).then(() => onChange(null, 'crawl')).catch(onChange);

    this.setState({
        steps: [],
        reason: '',
        lastSuccessful: false,
        excludeEventSteps: false
     });
  };

  pipeline_allow_identifiers = () => {
    const { dataset, onChange } = this.props;
    allowFailedIdentifiers_pipeline(dataset.key).then(() => onChange(null, 'crawl')).catch(onChange);
  };

  restoreItem = () => {
    const { dataset, onChange } = this.props;
    delete dataset.deleted;
    updateDataset(dataset).then(() => onChange()).catch(onChange);
  };

  deleteItem = () => {
    const { dataset, onChange } = this.props;
    deleteDataset(dataset.key).then(() => onChange()).catch(onChange);
  };

  render = () => {
    // so far we assume that if a user cannot crawl, then they cannot do any of the other actions in the menu (delete, restore, rerun, pipelineCrawl)
    return <>
      {this.state.hasCrawl && <Dropdown.Button onClick={() => this.callConfirmWindow('crawl')} overlay={this.renderActionMenu()}>
        <FormattedMessage id="crawl" defaultMessage="Crawl" />
      </Dropdown.Button>}
      {!this.state.hasCrawl && <Dropdown overlay={this.renderActionMenu()} arrow>
        <Button><MoreOutlined /></Button>
      </Dropdown>}
    </>;
  }
}

DatasetActions.propTypes = {
  dataset: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

const mapContextToProps = ({ user }) => ({ user });

export default injectIntl(injectSheet(styles)(withContext(mapContextToProps)(DatasetActions)));
