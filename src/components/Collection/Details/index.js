import React from 'react';
import { Alert, Col, Row, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { SuggestionSummary, CollectionLink } from '../../common';
import qs from 'qs';

// Wrappers
import withContext from '../../hoc/withContext';
import ItemFormWrapper from '../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';
import { FormattedRelativeDate } from '../../common';
// APIs
import { canUpdate, canCreate } from '../../../api/permissions';
import { getSuggestion, applySuggestion, discardSuggestion } from '../../../api/collection';

/**
 * Displays collection details and edit form
 * @param collection - collection object or null
 * @param refresh - a callback after save/edit
 */
class CollectionDetails extends React.Component {
  constructor(props) {
    super(props);

    const suggestionId = this.getSuggestionId();
    this.state = {
      edit: !props.collection,
      isModalVisible: this.isEditMode(),
      suggestionId: suggestionId
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    this.getPermissions();
    this.getSuggestion();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.getPermissions();
      this.getSuggestion();
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
        this.props.refresh();
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

  render() {
    const { collection } = this.props;
    const { suggestion, hasUpdate } = this.state;
    const isPending = suggestion && suggestion.status === 'PENDING';
    const hasChangesToReview = isPending && suggestion && (suggestion.changes.length > 0 || suggestion.type === 'CREATE');

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="details.collection" defaultMessage="Collection details" /></h2>
            </Col>
            <Col span={4} className="text-right">
              {collection && !collection.deleted && (
                <Row className="item-btn-panel">
                  <Col>
                    <Switch
                      checkedChildren={<FormattedMessage id={hasUpdate ? 'edit' : 'suggest'} defaultMessage="Edit" />}
                      unCheckedChildren={<FormattedMessage id={hasUpdate ? 'edit' : 'suggest'} defaultMessage="Edit" />}
                      onChange={this.toggleEditState}
                      checked={this.state.edit || this.state.isModalVisible}
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
                    relativeTime: <FormattedRelativeDate value={collection.modified} />
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

          {collection && suggestion && <SuggestionSummary 
            suggestion={suggestion}
            entity={collection}
            entityType="COLLECTION"
            discardSuggestion={discardSuggestion} 
            applySuggestion={applySuggestion} 
            showInForm={() => this.setState({ isModalVisible: true })}
            refresh={this.props.refresh} 
            hasUpdate={this.state.hasUpdate}
            />}

          {collection && !this.state.hasUpdate && <Alert
            style={{ marginBottom: 12 }}
            message={<>
              <FormattedMessage id="suggestion.suggestChange" defaultMessage="You do not have access to edit this entity, but you can leave a suggestion. Click 'Edit' to edit individual fields. Or 'More' for additional options." />
              <div>
                <a href={`mailto:scientific-collections@gbif.org?subject=GrSciColl%20suggestions&body=Regarding%20%0D%0A${encodeURIComponent(collection.name) }%20%0D%0Ahttps://gbif.org/grscicoll/collection/${ collection.key }%0D%0A%0D%0AThank you for your help. Please describe the changes you would like to see.`}>
                  <FormattedMessage id="suggestion.suggestPerEmail" defaultMessage="Suggest per email" />
                </a>
              </div>
            </>}
            type="info"
          />}

          {!this.state.edit && <Presentation collection={collection} />}
          <ItemFormWrapper
            title={<FormattedMessage id="collection" defaultMessage="Collection" />}
            visible={this.state.edit || !!this.state.isModalVisible}
            mode={collection ? 'edit' : 'create'}
          >
            <Form
              reviewChange={hasChangesToReview}
              collection={hasChangesToReview ? suggestion.suggestedEntity : collection}
              suggestion={hasChangesToReview ? suggestion : null}
              original={collection}
              onSubmit={this.onSubmit} onCancel={this.onCancel}
              hasUpdate={this.state.hasUpdate}
              hasCreate={this.state.hasCreate}
              mode={collection ? 'edit' : 'create'}
              refresh={this.props.refresh}
            />
          </ItemFormWrapper>
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

export default withContext(mapContextToProps)(withRouter(CollectionDetails));