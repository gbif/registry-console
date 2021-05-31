import React from 'react';
import { Alert, Col, Row, Switch, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { CollectionLink } from '../index';
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
import { getSuggestion, applySuggestion, discardSugggestion } from '../../../api/collection';

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
    if (!this.state.suggestionId || !this.props.user) return;

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
    discardSugggestion(this.state.suggestionId, this.state.suggestion)
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

  getSuggestionSummary = () => {
    const { suggestion } = this.state;
    if (!suggestion) return null;
    return <>
      <p>
        <h4>Propsed by</h4>
        {suggestion.proposerEmail}
      </p>
      <div>
        <h4>Comments</h4>
        {suggestion.comments.map((x, i) => <p key={i}>{x}</p>)}
      </div>
      {suggestion.changes.length > 0 && <div>
        <h4>Changes</h4>
        <ul>
          {suggestion.changes.map((x, i) => <li key={i}>{x.field} : <del>{JSON.stringify(x.previous)}</del> {JSON.stringify(x.suggested)}</li>)}
        </ul>
      </div>}
    </>
  }

  render() {
    const { collection } = this.props;
    const { suggestion } = this.state;
    const isPending = suggestion && suggestion.status === 'PENDING';
    const hasChangesToReview = isPending && suggestion && suggestion.changes.length > 0;

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="details.collection" defaultMessage="Collection details" /></h2>
            </Col>
            <Col span={4} className="text-right">
              {collection && !collection.deleted && (
                // <HasAccess fn={() => canUpdate('grscicoll/collection', collection.key)}>
                <Row className="item-btn-panel">
                  <Col>
                    <Switch
                      checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit" />}
                      unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit" />}
                      onChange={this.toggleEditState}
                      checked={this.state.edit || this.state.isModalVisible}
                    />
                  </Col>
                </Row>
                // </HasAccess>
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

          {suggestion && suggestion.status === 'DISCARDED' &&
            <Alert
              style={{ marginBottom: 12 }}
              message={<p>
                This suggestion was discarded {suggestion.discarded} by {suggestion.discardedBy}
              </p>}
              type="info"
            />
          }

          {suggestion && suggestion.status === 'APPLIED' &&
            <Alert
              style={{ marginBottom: 12 }}
              message={<p>
                This suggestion was applied {suggestion.applied} by {suggestion.appliedBy}
              </p>}
              type="info"
            />
          }

          {isPending && suggestion.proposed < collection.modified &&
            <Alert
              style={{ marginBottom: 12 }}
              message="This entity has been updated since the suggestion was created."
              type="warning"
            />
          }

          {suggestion && suggestion.type === 'DELETE' &&
            <Alert
              style={{ marginBottom: 12 }}
              message={<div>
                <p>You are reviewing a suggestion to delete a collection.</p>
                {this.getSuggestionSummary()}
                {isPending && <>
                  <Button onClick={this.discard} style={{ marginRight: 8 }}>Discard</Button>
                  <Button type="danger" onClick={this.apply} style={{ marginRight: 8 }}>Delete</Button>
                </>}
              </div>}
              type="warning"
            />
          }

          {!this.state.hasUpdate && <Alert
            style={{ marginBottom: 12 }}
            message={<div>
              You do not have access to edit this entity, but you can leave a suggestion. Click 'Edit' to edit individual fields. Or click the [...] button for additional options.
            </div>}
            type="info"
          />}

          {suggestion && suggestion.type === 'MERGE' &&
            <Alert
              style={{ marginBottom: 12 }}
              message={<div>
                <p>Suggestion to merge this entity with <CollectionLink uuid={suggestion.mergeTargetKey} /></p>
                {this.getSuggestionSummary()}
                {isPending && <>
                  <Button onClick={this.discard} style={{ marginRight: 8 }}>Discard</Button>
                  <Button onClick={this.apply} style={{ marginRight: 8 }}>Merge</Button>
                </>}
              </div>}
              type="info"
            />
          }

          {suggestion && suggestion.type === 'UPDATE' &&
            <Alert
              style={{ marginBottom: 12 }}
              message={<div>
                {this.getSuggestionSummary({into: <p>You are reviewing a suggestion to update a collection.</p>})}
                {isPending && <>
                  <Button onClick={this.discard} style={{ marginRight: 8 }}>Discard</Button>
                  {!hasChangesToReview && <Button onClick={this.apply} style={{ marginRight: 8 }}>Close as done</Button>}
                  {hasChangesToReview > 0 && <>
                    <Button onClick={this.apply} style={{ marginRight: 8 }}>Apply</Button>
                    <Button onClick={() => this.setState({ isModalVisible: true })} style={{ marginRight: 8 }}>Show in form</Button>
                  </>}
                </>}
              </div>}
              type="info"
            />
          }

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