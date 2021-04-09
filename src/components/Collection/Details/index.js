import React from 'react';
import { Alert, Col, Row, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { CollectionLink } from '../index';
import qs from 'qs';
import merge from 'lodash/merge';

// Wrappers
import withContext from '../../hoc/withContext';
import ItemFormWrapper from '../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';
import { FormattedRelativeDate } from '../../common';
// APIs
import { canUpdate } from '../../../api/permissions';

/**
 * Displays collection details and edit form
 * @param collection - collection object or null
 * @param refresh - a callback after save/edit
 */
class CollectionDetails extends React.Component {
  constructor(props) {
    super(props);

    const urlSuggestion = this.getSuggestion();
    if (urlSuggestion) {
      delete urlSuggestion.deleted;
      delete urlSuggestion.contacts;
      delete urlSuggestion.key;
    }
    this.state = {
      edit: !props.collection,
      isModalVisible: !!urlSuggestion || this.isEditMode(),
      urlSuggestion: urlSuggestion
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

  getSuggestion() {
    const query = this.getSearchParams();
    try {
      const suggestion = JSON.parse(query.suggestion);
      return suggestion;
    } catch (err) {
      return null;
    }
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
    const hasUpdate = await canUpdate('grscicoll/collection', this.props.collection.key);
    if (this._isMount) {
      // update state
      this.setState({ hasUpdate });
    };
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
        this.setState({urlSuggestion: undefined});
      }
    } else {
      this.props.history.push('/collection/search');
    }
  };

  onSubmit = key => {
    this.setState({ edit: false, isModalVisible: false });
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
            <Form reviewChange={!!this.state.urlSuggestion}
              collection={merge({}, collection, this.state.urlSuggestion)}
              original={collection}
              onSubmit={this.onSubmit} onCancel={this.onCancel}
              hasUpdate={this.state.hasUpdate}
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

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(withRouter(CollectionDetails));