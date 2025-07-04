import React from 'react';
import { Alert, Col, Row, Input, Modal, Switch, Button } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { SuggestionSummary, DescriptorSuggestionSummary, CollectionLink } from '../../common';
import qs from 'qs';

// Wrappers
import withContext from '../../hoc/withContext';
import ItemFormWrapper from '../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';
import SuggestForm from '../subtypes/DescriptorGroup/SuggestForm';
import { FormattedRelativeDate, DatasetSuggestWithoutContext as DatasetSuggest } from '../../common';
// APIs
import { canUpdate, canCreate } from '../../../api/permissions';
import { 
  getSuggestion, 
  applySuggestion, 
  discardSuggestion, 
  createFromMasterSource,
  getDescriptorSuggestion,
  applyDescriptorSuggestion,
  discardDescriptorSuggestion,
  getDescriptorGroupTags
} from '../../../api/collection';

/**
 * Displays collection details and edit form
 * @param collection - collection object or null
 * @param refresh - a callback after save/edit
 */
class CollectionDetails extends React.Component {
  constructor(props) {
    super(props);

    const suggestionId = this.getSuggestionId();
    const descriptorSuggestionId = this.getDescriptorSuggestionId();
    this.state = {
      edit: !props.collection,
      isModalVisible: this.isEditMode(),
      isDescriptorSuggestionModalVisible: false,
      suggestionId: suggestionId,
      descriptorSuggestionId: descriptorSuggestionId,
      hasUpdate: false,
      hasCreate: false,
      descriptorTags: []
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    this.getPermissions();
    this.getSuggestion();
    this.getDescriptorSuggestion();
    this.getDescriptorTags();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.getPermissions();
      this.getSuggestion();
      this.getDescriptorSuggestion();
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getSuggestionId() {
    const query = this.getSearchParams();
    return query.suggestionId;
  }

  getDescriptorSuggestionId() {
    const query = this.getSearchParams();
    return query.descriptorSuggestionId;
  }

  getSuggestion({ showModalIfPending } = {}) {
    if (!this.state.suggestionId) return;

    getSuggestion(this.state.suggestionId)
      .then(res => {
        let d = { suggestion: res.data };
        if (showModalIfPending) d.isModalVisible = res.data.status === 'PENDING';
        this.setState(d);
      })
      .catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      })
  }

  getDescriptorSuggestion = ({ showModalIfPending } = {}) => {
    if (!this.state.descriptorSuggestionId) return;

    getDescriptorSuggestion(this.props.collection.key, this.state.descriptorSuggestionId)
      .then(response => {
        if (this._isMount) {
          let d = { descriptorSuggestion: response.data };
          if (showModalIfPending) d.isModalVisible = response.data.status === 'PENDING';
          this.setState(d);
        }
      })
      .catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
  }

  isEditMode() {
    const query = this.getSearchParams();
    return query.editMode;
  }

  getSearchParams() {
    return qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
  }

  apply = () => {
    applySuggestion(this.state.suggestionId, this.state.suggestion)
      .then(response => {
        this.props.addSuccess({ statusText: 'The suggestion was applied.' });
        this.props.refresh();
      })
      .catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
  }

  discard = () => {
    discardSuggestion(this.state.suggestionId)
      .then(response => {
        this.props.addSuccess({ statusText: 'The suggestion was discarded.' });
        this.props.history.push('/suggestions/collections?status=DISCARDED');
      })
      .catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
  }

  getPermissions = async () => {
    this.setState({ loadingPermissions: true });
    const hasUpdate = this.props.collection && this.props.collection.key ? await canUpdate('grscicoll/collection', this.props.collection.key) : false;
    const hasCreate = await canCreate('grscicoll/collection');
    if (this._isMount) {
      // update state
      this.setState({ hasUpdate, hasCreate });
    };
    return { hasUpdate, hasCreate }
    //else the component is unmounted and no updates should be made
  }

  onCancel = () => {
    if (this.props.collection) {
      this.setState({ isModalVisible: false });
      if (this.state.urlSuggestion) {
        this.props.history.push({
          pathname: this.props.collection.key,
          search: ''
        });
        this.setState({ urlSuggestion: undefined });
      }
    } else {
      this.props.history.push('/collection/search');
    }
  };

  onSubmit = key => {
    this.setState({ edit: false, isModalVisible: false, suggestion: undefined, suggestionId: undefined });
    this.props.refresh(key);
  };

  toggleEditState = val => {
    if (this.props.collection) {
      this.setState({ isModalVisible: val });
    } else {
      this.setState({ edit: false });
    }
  };

  showCreateFromSource = () => {
    const { intl, user } = this.props;

    const title = intl.formatMessage({ id: 'collection.create.fromSource', defaultMessage: 'Create collection from master source' });
    const description = intl.formatMessage({ id: 'collection.create.fromSource.description', defaultMessage: 'Select a master source to create a collection based on the information in the source. The collection will continously be updated when changes are made to the master copy.' });
    const mergeLabel = intl.formatMessage({ id: 'create', defaultMessage: 'Create' });
    const cancelLabel = intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' });
    const codeLabel = intl.formatMessage({ id: 'code', defaultMessage: 'Code' });

    Modal.confirm({
      title: title,
      okText: mergeLabel,
      okType: 'primary',
      cancelText: cancelLabel,
      content: <div>
        <DatasetSuggest user={user} intl={intl} value={this.state.masterSourceUUID} onChange={dataset => this.setState({ masterSourceUUID: dataset })} style={{ width: '100%' }} />
        <Input style={{marginTop: 10}} placeholder={codeLabel} onChange={e => this.setState({masterSourceCode: e.target.value})} />
        <div style={{ marginTop: 10, color: '#888' }}>
          {description}
        </div>
      </div>,
      onOk: () => {
        return createFromMasterSource({
          datasetKey: this.state.masterSourceUUID,
          collectionCode: this.state.masterSourceCode
        }).then((response) => {
          this.props.addSuccess({ statusText: 'Created from source.' });
          this.props.refresh(response.data);
        }).catch(error => {
          this.props.addError({ status: error.response.status, statusText: error.response.data });
        });
      }
    });
  };

  getDescriptorTags = async () => {
    try {
      const response = await getDescriptorGroupTags();
      const tags = response.data.results.map(concept => ({
        label: concept.name,
        value: concept.name
      }));
      this.setState({ descriptorTags: tags });
    } catch (error) {
      console.error('Failed to fetch descriptor tags:', error);
    }
  };

  render() {
    const { collection, masterSourceFields, masterSourceLink } = this.props;
    const { suggestion, descriptorSuggestion, hasUpdate, hasCreate, isModalVisible } = this.state;
    const isPending = suggestion && suggestion.status === 'PENDING';
    const hasChangesToReview = isPending && suggestion && (suggestion.changes.length > 0 || suggestion.type === 'CREATE');
    const mode = collection ? 'edit' : 'create';

    // it isn't clear to me where the masterSource ought to set on the suggestion, so checking multiple places
    let masterSource = collection?.masterSource ?? suggestion?.masterSource ?? suggestion?.suggestedEntity?.masterSource;
    // fallback check as the API hasn't added the master source yet
    if (!masterSource) {
      const sourceLookup = {
        'IH_IRN': 'IH'
      }
      masterSource = sourceLookup?.[suggestion?.suggestedEntity?.masterSourceMetadata?.source];
    }

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="details.collection" defaultMessage="Collection details" /></h2>
            </Col>
            <Col span={4} className="text-right">

              {mode === 'create' && hasCreate && suggestion?.status !== 'APPLIED' && <Row className="item-btn-panel">
                <Col>
                  <Button onClick={this.showCreateFromSource}>Create from source</Button>
                </Col>
              </Row>}

              {collection && !collection.deleted && (
                <Row className="item-btn-panel">
                  <Col>
                    <Switch
                      checkedChildren={<FormattedMessage id={hasUpdate ? 'edit' : 'suggest'} defaultMessage="Edit" />}
                      unCheckedChildren={<FormattedMessage id={hasUpdate ? 'edit' : 'suggest'} defaultMessage="Edit" />}
                      onChange={this.toggleEditState}
                      checked={this.state.edit || isModalVisible}
                    />
                  </Col>
                </Row>
              )}
            </Col>
          </Row>

          {/* If collection was deleted, we should show a message about that */}
          {collection && collection.deleted && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.deleted.collection"
                  defaultMessage="This collection was deleted {relativeTime} by {name}."
                  values={{
                    name: collection.modifiedBy,
                    relativeTime: <FormattedRelativeDate value={collection.deleted} />
                  }}
                />
              }
              type="error"
            />
          )}

          {collection && collection.replacedBy && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.replacedBy.collection"
                  defaultMessage="This collection was replaced by {name}."
                  values={{ name: <CollectionLink uuid={collection.replacedBy} /> }}
                />
              }
              type="error"
            />
          )}

          {suggestion && <SuggestionSummary
            suggestion={suggestion}
            entity={collection}
            entityType="COLLECTION"
            discardSuggestion={discardSuggestion}
            applySuggestion={applySuggestion}
            showInForm={() => this.setState({ isModalVisible: true })}
            refresh={this.props.refresh}
            hasUpdate={this.state.hasUpdate}
          />}

          {descriptorSuggestion && <DescriptorSuggestionSummary
            suggestions={[descriptorSuggestion]}
            discardSuggestion={discardDescriptorSuggestion}
            applySuggestion={applyDescriptorSuggestion}
            refresh={this.props.refresh}
            hasUpdate={this.state.hasUpdate}
            collectionKey={collection?.key}
            showInForm={() => this.setState({ isDescriptorSuggestionModalVisible: true })}
            addSuccess={this.props.addSuccess}
            addError={this.props.addError}
          />}

          {collection && !this.state.hasUpdate && <Alert
            style={{ marginBottom: 12 }}
            message={<>
              <FormattedMessage id="suggestion.suggestChange" defaultMessage="You do not have access to edit this entity, but you can leave a suggestion. Click 'Edit' to edit individual fields. Or 'More' for additional options." />
              <div>
                <a href={`mailto:scientific-collections@gbif.org?subject=GRSciColl%20suggestions&body=Regarding%20%0D%0A${encodeURIComponent(collection.name)}%20%0D%0Ahttps://gbif.org/grscicoll/collection/${collection.key}%0D%0A%0D%0AThank you for your help. Please describe the changes you would like to see.`}>
                  <FormattedMessage id="suggestion.suggestPerEmail" defaultMessage="Suggest per email" />
                </a>
              </div>
            </>}
            type="info"
          />}


          {!this.state.edit && <Presentation collection={collection} />}
          {suggestion?.status !== 'APPLIED' && <ItemFormWrapper
            title={<>
            <FormattedMessage id="collection" defaultMessage="Collection" />
              <Button type="primary" style={{marginLeft: 12}} href={masterSourceLink}>
                <FormattedMessage id="masterSource.gotoMaster" defaultMessage="See master source" />
              </Button>
            </>}
            visible={this.state.edit || !!this.state.isModalVisible}
            mode={mode}
          >
            <Form
              reviewChange={hasChangesToReview}
              masterSourceFields={masterSourceFields}
              masterSource={masterSource}
              masterSourceLink={masterSourceLink}
              collection={hasChangesToReview ? suggestion.suggestedEntity : collection}
              suggestion={hasChangesToReview ? suggestion : null}
              original={collection}
              onSubmit={this.onSubmit}
              onCancel={this.onCancel}
              onDiscard={this.discard}
              hasUpdate={this.state.hasUpdate}
              hasCreate={this.state.hasCreate}
              mode={mode}
              refresh={this.props.refresh}
            />
          </ItemFormWrapper>}

          {this.state.isDescriptorSuggestionModalVisible && (
            <Modal
              title={<FormattedMessage id="editDescriptorSuggestion" defaultMessage="Edit Descriptor Suggestion" />}
              visible={this.state.isDescriptorSuggestionModalVisible}
              onCancel={() => this.setState({ isDescriptorSuggestionModalVisible: false })}
              footer={null}
            >
              <SuggestForm 
                collectionKey={collection?.key}
                onSuggestion={async (formData) => {
                  try {
                    await this.props.suggestDescriptorGroup(formData);
                    this.setState({ isDescriptorSuggestionModalVisible: false });
                  } catch (error) {
                    console.error('Error in onSuggestion:', error);
                    this.props.addError({ status: error.response.status, statusText: error.response.data });
                  }
                }}
                initialValues={descriptorSuggestion}
                hasUpdate={this.state.hasUpdate}
                descriptorTags={this.state.descriptorTags}
                onDiscard={async () => {
                  try {
                    await discardDescriptorSuggestion(collection.key, descriptorSuggestion.key);
                    this.props.addSuccess({ 
                      statusText: this.props.intl.formatMessage({ 
                        id: 'suggestion.discarded', 
                        defaultMessage: 'Suggestion was discarded' 
                      }) 
                    });
                    this.setState({ isDescriptorSuggestionModalVisible: false });
                    this.props.refresh(collection.key);
                  } catch (error) {
                    this.props.addError({ status: error.response.status, statusText: error.response.data });
                  }
                }}
              />
            </Modal>
          )}
        </div>
      </React.Fragment>
    );
  }
}

CollectionDetails.propTypes = {
  collection: PropTypes.object,
  refresh: PropTypes.func.isRequired
};

const mapContextToProps = ({ user, addError, addSuccess }) => ({ user, addError, addSuccess });

export default withContext(mapContextToProps)(withRouter(injectIntl(CollectionDetails)));
