import React from 'react';
import { Alert, Col, Row, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SuggestionSummary, CollectionLink, InstitutionLink } from '../../common';
import qs from 'qs';

// Wrappers
import ItemFormWrapper from '../../hoc/ItemFormWrapper';
import withContext from '../../hoc/withContext';
// Components
import Presentation from './Presentation';
import Form from './Form';
import FormattedRelativeDate from '../../common/FormattedRelativeDate';
// APIs
import { canUpdate, canCreate } from '../../../api/permissions';
import { getSuggestion, applySuggestion, discardSuggestion } from '../../../api/institution';

class InstitutionDetails extends React.Component {
  constructor(props) {
    super(props);

    const suggestionId = this.getSuggestionId();
    this.state = {
      edit: !props.institution,
      isModalVisible: false,
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

  getSearchParams() {
    return qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
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

  getPermissions = async () => {
    this.setState({ loadingPermissions: true });
    const hasUpdate = this.props.institution && this.props.institution.key ? await canUpdate('grscicoll/institution', this.props.institution.key) : false;
    const hasCreate = await canCreate('grscicoll/institution');
    if (this._isMount) {
      // update state
      this.setState({ hasUpdate, hasCreate });
    };
    return { hasUpdate, hasCreate }
    //else the component is unmounted and no updates should be made
  }

  onCancel = () => {
    if (this.props.institution) {
      this.setState({ isModalVisible: false });
    } else {
      this.props.history.push('/institution/search');
    }
  };

  onSubmit = key => {
    this.setState({ edit: false, isModalVisible: false });
    this.props.refresh(key);
  };

  toggleEditState = val => {
    if (this.props.institution) {
      this.setState({ isModalVisible: val });
    } else {
      this.setState({ edit: false });
    }
  };

  render() {
    const { institution } = this.props;
    const { suggestion } = this.state;
    const isPending = suggestion && suggestion.status === 'PENDING';
    const hasChangesToReview = isPending && suggestion && (suggestion.changes.length > 0 || suggestion.type === 'CREATE');

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="details.institution" defaultMessage="Institution details" /></h2>
            </Col>
            <Col span={4} className="text-right">
              {institution && !institution.deleted && (
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
              )}
            </Col>
          </Row>

          {/* If institution was deleted, we should show a message about that */}
          {institution && institution.deleted && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.deleted.institution"
                  defaultMessage="This institution was deleted {relativeTime} by {name}."
                  values={{
                    name: institution.modifiedBy,
                    relativeTime: <FormattedRelativeDate value={institution.deleted} />
                  }}
                />
              }
              type="error"
            />
          )}
          {institution && institution.replacedBy && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.replacedBy.institution"
                  defaultMessage="This institution was replaced by {name}."
                  values={{ name: <InstitutionLink uuid={institution.replacedBy} /> }}
                />
              }
              type="error"
            />
          )}
          {institution && institution.convertedToCollection && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.convertedToCollection.institution"
                  defaultMessage="This institution was converted to a collection: {collection}."
                  values={{ collection: <CollectionLink uuid={institution.convertedToCollection} /> }}
                />
              }
              type="error"
            />
          )}

          {institution && suggestion && <SuggestionSummary
            suggestion={suggestion}
            entity={institution}
            entityType="INSTITUTION"
            discardSuggestion={discardSuggestion}
            applySuggestion={applySuggestion}
            showInForm={() => this.setState({ isModalVisible: true })}
            refresh={this.props.refresh}
            hasUpdate={this.state.hasUpdate}
          />}

          {institution && !this.state.hasUpdate && <Alert
            style={{ marginBottom: 12 }}
            message={<>
              <FormattedMessage id="suggestion.suggestChange" defaultMessage="You do not have access to edit this entity, but you can leave a suggestion. Click 'Edit' to edit individual fields. Or 'More' for additional options." />
              <div>
                <a href={`mailto:scientific-collections@gbif.org?subject=GrSciColl%20suggestions&body=Regarding%20%0D%0A${encodeURIComponent(institution.name) }%20%0D%0Ahttps://gbif.org/grscicoll/institution/${ institution.key }%0D%0A%0D%0AThank you for your help. Please describe the changes you would like to see.`}>
                  <FormattedMessage id="suggestion.suggestPerEmail" defaultMessage="Suggest per email" />
                </a>
              </div>
            </>}
            type="info"
          />}

          {!this.state.edit && <Presentation institution={institution} />}
          <ItemFormWrapper
            title={<FormattedMessage id="institution" defaultMessage="Institution" />}
            visible={this.state.edit || this.state.isModalVisible}
            mode={institution ? 'edit' : 'create'}
          >
            <Form
              reviewChange={hasChangesToReview}
              institution={hasChangesToReview ? suggestion.suggestedEntity : institution}
              suggestion={hasChangesToReview ? suggestion : null}
              original={institution}
              onSubmit={this.onSubmit}
              onCancel={this.onCancel}
              hasUpdate={this.state.hasUpdate}
              hasCreate={this.state.hasCreate}
              mode={institution ? 'edit' : 'create'}
              refresh={this.props.refresh}
            />
          </ItemFormWrapper>
        </div>
      </React.Fragment>
    );
  }
}

InstitutionDetails.propTypes = {
  institution: PropTypes.object,
  refresh: PropTypes.func.isRequired
};

const mapContextToProps = ({ user, addError, addSuccess }) => ({ user, addError, addSuccess });

export default withContext(mapContextToProps)(withRouter(InstitutionDetails));