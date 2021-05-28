import React from 'react';
import { Alert, Col, Row, Switch } from 'antd';
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
import { getSuggestion } from '../../../api/collection';

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
    this.getSuggestion({ showModalIfPending: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.getPermissions();
      this.getSuggestion({ showModalIfPending: true });
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

  getSuggestion({ showModalIfPending }) {
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
    const { suggestion } = this.state;
    const isPending = suggestion && suggestion.status === 'PENDING';

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

          {!this.state.edit && <Presentation collection={collection} />}
          <ItemFormWrapper
            title={<FormattedMessage id="collection" defaultMessage="Collection" />}
            visible={this.state.edit || !!this.state.isModalVisible}
            mode={collection ? 'edit' : 'create'}
          >
            <Form
              reviewChange={isPending}
              collection={isPending ? suggestion.suggestedEntity : collection}
              suggestion={isPending ? suggestion : null}
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

const mapContextToProps = ({ user, addError }) => ({ user, addError });

export default withContext(mapContextToProps)(withRouter(CollectionDetails));