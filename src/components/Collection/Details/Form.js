import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Checkbox, Col, Form, Input, Row, Select, Alert } from 'antd';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import injectSheet from 'react-jss';

// APIs
import { createCollection, updateAndApplySuggestion, discardSuggestion, suggestNewCollection, suggestUpdateCollection, updateCollection } from '../../../api/collection';
import { getSuggestedInstitutions } from '../../../api/institution';
import { getPreservationType, getAccessionStatus, getCollectionContentType } from '../../../api/enumeration';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FilteredSelectControl, FormItem, FormGroupHeader, TagControl, AlternativeCodes } from '../../common';
// Helpers
import { validateUrl, validateEmail, validatePhone } from '../../util/validators';

const styles = {
  suggestMeta: {
    background: '#f7f7f7',
    border: '1px solid #ddd',
    padding: '12px',
    marginTop: '12px',
  }
}
class CollectionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      institutions: [],
      accessionStatuses: [],
      preservationTypes: [],
      contentTypes: []
    };
  }

  async componentDidMount() {
    this._isMount = true;
    const [accessionStatuses, preservationTypes, contentTypes] = await Promise.all([
      getAccessionStatus(),
      getPreservationType(),
      getCollectionContentType()
    ]);
    if (this.props.collection && this.props.collection.institutionKey) {
      this.handleSearch(this.props.collection.institutionKey);
    }
    this.updateDiff();
    this.setState({ accessionStatuses, preservationTypes, contentTypes });
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.collection !== this.props.collection || prevProps.original !== this.props.original) {
      this.updateDiff();
    }
  }

  updateDiff = () => {
    const { collection, original } = this.props;
    let diff = {};
    if (collection && original && JSON.stringify(original) !== JSON.stringify(collection)) {
      diff = this.getDiff(original, collection);
    }
    this.setState({ diff });
  }

  getDiff = (o = {}, s = {}) => {
    let diff = {};
    Object.keys(s)
      .filter(x => x !== 'key' && JSON.stringify(o[x]) !== JSON.stringify(s[x]))
      .forEach(x => diff[x] = typeof o[x] === 'undefined' ? null : o[x]);

    if (s.mailingAddress && isObj(s.mailingAddress)) {
      diff.mailingAddress = this.getDiff(o.mailingAddress, s.mailingAddress);
    }
    if (s.address && isObj(s.address)) {
      diff.address = this.getDiff(o.address, s.address);
    }
    return diff;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { _proposerEmail: proposerEmail, _comment: comment, ...bodyStub } = values;
        const body = { ...this.props.collection, ...bodyStub };
        if (this.props.mode === 'create') {
          if (!this.props.hasCreate) {
            suggestNewCollection({ body, proposerEmail, comments: [comment] })
              .then(response => {
                this.props.addSuccess({ statusText: <FormattedMessage id="suggestion.suggestionLogged" defaultMessage="Thank you. Your suggestion has been logged" /> });
                this.props.history.push('/collection/search');
              })
              .catch(error => {
                this.props.addError({ status: error.response.status, statusText: error.response.data });
              });
          } else {
            if (this.props.reviewChange) {
              //apply suggested creation
              updateAndApplySuggestion(this.props.suggestion.key, { ...this.props.suggestion, suggestedEntity: body, comments: [...this.props.suggestion.comments, comment] })
                .then(response => {
                  this.props.addSuccess({ statusText: <FormattedMessage id="suggestion.appliedSuccess" defaultMessage="Suggestion was applied" /> });
                  this.props.history.push('/collection/search');
                })
                .catch(error => {
                  this.props.addError({ status: error.response.status, statusText: error.response.data });
                });
            } else {
              createCollection(values)
                .then(response => this.props.onSubmit(response.data))
                .catch(error => {
                  this.props.addError({ status: error.response.status, statusText: error.response.data });
                });
            }
          }
        } else {
          if (!this.props.hasUpdate) {
            suggestUpdateCollection({ body, proposerEmail, comments: [comment] })
              .then(response => {
                this.props.addSuccess({ statusText: <FormattedMessage id="suggestion.suggestionLogged" defaultMessage="Thank you. Your suggestion has been logged" /> });
                this.props.onSubmit();
              })
              .catch(error => {
                this.props.addError({ status: error.response.status, statusText: error.response.data });
              });
          } else {
            if (this.props.reviewChange) {
              //apply suggested creation
              updateAndApplySuggestion(this.props.suggestion.key, { ...this.props.suggestion, suggestedEntity: body, comments: [...this.props.suggestion.comments, comment] })
                .then(response => {
                  this.props.addSuccess({ statusText: <FormattedMessage id="suggestion.appliedSuccess" defaultMessage="Suggestion was applied" /> });
                  this.props.onSubmit();
                })
                .catch(error => {
                  this.props.addError({ status: error.response.status, statusText: error.response.data });
                });
            } else {
              // regular update
              updateCollection(body)
                .then(() => this.props.onSubmit())
                .catch(error => {
                  this.props.addError({ status: error.response.status, statusText: error.response.data });
                });
            }
          }
        }
      }
    });
  };

  discard = () => {
    discardSuggestion(this.props.suggestion.key)
      .then(() => this.props.onSubmit())
      .catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
  }

  handleSearch = value => {
    if (!value) {
      this.setState({ institutions: [] });
      return;
    }

    this.setState({ fetching: true });

    getSuggestedInstitutions({ q: value }).then(response => {
      this.setState({
        institutions: response.data || [],
        fetching: false
      });
    });
  };

  render() {
    const { classes, mode, suggestion, collection, form, countries, reviewChange, hasCreate, hasUpdate } = this.props;
    // const isNew = collection === null;
    const mailingAddress = collection && collection.mailingAddress ? collection.mailingAddress : {};
    const address = collection && collection.address ? collection.address : {};
    const { getFieldDecorator } = form;
    const { institutions, fetching, accessionStatuses, preservationTypes, contentTypes } = this.state;
    let { diff: difference } = this.state;
    let { user } = this.props;
    const diff = { ...{ mailingAddress: {}, address: {} }, ...difference };

    const isSuggestion = mode === 'create' ? !hasCreate : !hasUpdate;
    const hasChanges = (suggestion && suggestion.changes.length > 0) || mode === 'create';
    const isCreate = mode === 'create';

    return (
      <React.Fragment>
        {hasUpdate && suggestion && !isCreate && <Alert
          message={<div>
            <p>
              <FormattedMessage id="suggestion.updateAndOVerwrite" defaultMessage="You are viewing a suggestion to update a collection. You can overwrite and add additional details." />
            </p>
            <div>
              <h4><FormattedMessage id="suggestion.proposedBy" defaultMessage="Proposed by" /></h4>
              <p>
                {suggestion.proposerEmail}
              </p>
            </div>
            <div>
              <h4>
                <FormattedMessage id="suggestion.comments" defaultMessage="Comments" />
              </h4>
              {suggestion.comments.map((x, i) => <p key={i}>{x}</p>)}
            </div>
            {suggestion.changes.length === 0 && <div>
              <FormattedMessage id="suggestion.noChanges" defaultMessage="No fields was changed" />
            </div>}
          </div>}
          type="info"
        />}
        {hasCreate && suggestion && isCreate && <Alert
          message={<div>
            <p>
              <FormattedMessage id="suggestion.createSuggestion" defaultMessage="You are viewing a suggestion to create a collection." />
            </p>
            <div>
              <h4><FormattedMessage id="suggestion.proposedBy" defaultMessage="Proposed by" /></h4>
              <p>
                {suggestion.proposerEmail}
              </p>
            </div>
            <div>
              <h4>
                <FormattedMessage id="suggestion.comments" defaultMessage="Comments" />
              </h4>
              {suggestion.comments.map((x, i) => <p key={i}>{x}</p>)}
            </div>
          </div>}
          type="info"
        />}
        {!hasUpdate && !isCreate && !reviewChange && <Alert
          message={<FormattedMessage id="suggestion.noEditAccess" defaultMessage="You do not have edit access, but you can suggest a change if you provide your email." />}
          type="warning"
        />}
        {!hasCreate && isCreate && !reviewChange && <Alert
          message={<FormattedMessage id="suggestion.noEditAccess" defaultMessage="You do not have edit access, but you can suggest a change if you provide your email." />}
          type="warning"
        />}
        <Form onSubmit={this.handleSubmit}>
          {(!suggestion || hasChanges) && <>
            <FormItem originalValue={diff.name} label={<FormattedMessage id="name" defaultMessage="Name" />}>
              {getFieldDecorator('name', {
                initialValue: collection && collection.name,
                rules: [{
                  required: true, message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name" />
                }]
              })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.description} label={<FormattedMessage id="description" defaultMessage="Description" />}>
              {getFieldDecorator('description', { initialValue: collection && collection.description })(
                <Input.TextArea rows={4} />
              )}
            </FormItem>

            <FormItem originalValue={diff.contentTypes} label={<FormattedMessage id="contentTypes" defaultMessage="Content types" />}>
              {getFieldDecorator('contentTypes', { initialValue: collection ? collection.contentTypes : undefined })(
                <Select
                  mode="multiple"
                  placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type" />}
                >
                  {contentTypes.map(type => (
                    <Select.Option value={type} key={type}>
                      <FormattedMessage id={`collectionContentType.${type}`} />
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem originalValue={diff.code} label={<FormattedMessage id="code" defaultMessage="Code" />}>
              {getFieldDecorator('code', {
                initialValue: collection && collection.code,
                rules: [{
                  required: true, message: <FormattedMessage id="provide.code" defaultMessage="Please provide a code" />
                }]
              })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.alternativeCodes} label={<FormattedMessage id="alternativeCodes" defaultMessage="Alternative codes" />}>
              {getFieldDecorator('alternativeCodes', {
                initialValue: collection ? collection.alternativeCodes : [],
              })(
                <AlternativeCodes />
              )}
            </FormItem>

            <FormItem originalValue={diff.homepage} label={<FormattedMessage id="homepage" defaultMessage="Homepage" />}>
              {getFieldDecorator('homepage', {
                initialValue: collection && collection.homepage,
                rules: [{
                  validator: validateUrl(<FormattedMessage id="invalid.homepage" defaultMessage="Homepage is invalid" />)
                }]
              })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.catalogUrl} label={<FormattedMessage id="catalogUrl" defaultMessage="Catalog URL" />}>
              {getFieldDecorator('catalogUrl', {
                initialValue: collection && collection.catalogUrl,
                rules: [{
                  validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid" />)
                }]
              })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.apiUrl} label={<FormattedMessage id="apiUrl" defaultMessage="API URL" />}>
              {getFieldDecorator('apiUrl', {
                initialValue: collection && collection.apiUrl,
                rules: [{
                  validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid" />)
                }]
              })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.institutionKey} label={<FormattedMessage id="institution" defaultMessage="Institution" />}>
              {getFieldDecorator('institutionKey', { initialValue: collection ? collection.institutionKey : undefined })(
                <FilteredSelectControl
                  placeholder={<FormattedMessage
                    id="select.institution"
                    defaultMessage="Select an institution"
                  />}
                  search={this.handleSearch}
                  fetching={fetching}
                  items={institutions}
                  titleField="name"
                  delay={1000}
                />
              )}
            </FormItem>

            <FormItem originalValue={diff.phone} label={<FormattedMessage id="phone" defaultMessage="Phone" />}>
              {getFieldDecorator('phone', {
                initialValue: collection ? collection.phone : [],
                rules: [{
                  validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid" />)
                }]
              })(
                <TagControl label={<FormattedMessage id="newPhone" defaultMessage="New phone" />} removeAll={true} />
              )}
            </FormItem>

            <FormItem originalValue={diff.email} label={<FormattedMessage id="email" defaultMessage="Email" />}>
              {getFieldDecorator('email', {
                initialValue: collection ? collection.email : [],
                rules: [{
                  validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid" />)
                }]
              })(
                <TagControl label={<FormattedMessage id="newEmail" defaultMessage="New email" />} removeAll={true} />
              )}
            </FormItem>

            <FormItem originalValue={diff.preservationTypes} label={<FormattedMessage id="preservationTypes" defaultMessage="Preservation types" />}>
              {getFieldDecorator('preservationTypes', { initialValue: collection ? collection.preservationTypes : undefined })(
                <Select
                  mode="multiple"
                  placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type" />}
                >
                  {preservationTypes.map(type => (
                    <Select.Option value={type} key={type}>
                      <FormattedMessage id={`preservationType.${type}`} />
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem originalValue={diff.taxonomicCoverage} label={<FormattedMessage id="taxonomicCoverage" defaultMessage="Taxonomic coverage" />}>
              {getFieldDecorator('taxonomicCoverage', {
                initialValue: collection && collection.taxonomicCoverage,
              })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.geography} label={<FormattedMessage id="geography" defaultMessage="Geography" />}>
              {getFieldDecorator('geography', {
                initialValue: collection && collection.geography,
              })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.notes} label={<FormattedMessage id="notes" defaultMessage="Notes" />}>
              {getFieldDecorator('notes', {
                initialValue: collection && collection.notes,
              })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.incorporatedCollections} label={<FormattedMessage id="incorporatedCollections" defaultMessage="Incorporated collections" />}>
              {getFieldDecorator('incorporatedCollections', {
                initialValue: collection ? collection.incorporatedCollections : [],
              })(
                <TagControl label={<FormattedMessage id="newCollection" defaultMessage="New collection" />} removeAll={true} />
              )}
            </FormItem>

            <FormItem originalValue={diff.importantCollectors} label={<FormattedMessage id="importantCollectors" defaultMessage="Important collectors" />}>
              {getFieldDecorator('importantCollectors', {
                initialValue: collection ? collection.importantCollectors : [],
              })(
                <TagControl label={<FormattedMessage id="newCollector" defaultMessage="New collector" />} removeAll={true} />
              )}
            </FormItem>

            <FormItem originalValue={diff.accessionStatus} label={<FormattedMessage id="accessionStatus" defaultMessage="Accession status" />}>
              {getFieldDecorator('accessionStatus', {
                initialValue: collection ? collection.accessionStatus : undefined
              })(
                <Select placeholder={<FormattedMessage id="select.status" defaultMessage="Select a status" />}>
                  {accessionStatuses.map(status => (
                    <Select.Option value={status} key={status}>
                      <FormattedMessage id={`accessionStatus.${status}`} />
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem originalValue={diff.active} label={<FormattedMessage id="active" defaultMessage="Active" />}>
              {getFieldDecorator('active', {
                valuePropName: 'checked',
                initialValue: collection && collection.active
              })(
                <Checkbox />
              )}
            </FormItem>

            <FormItem originalValue={diff.personalCollection} label={<FormattedMessage id="personalCollection" defaultMessage="Personal collection" />}>
              {getFieldDecorator('personalCollection', {
                valuePropName: 'checked',
                initialValue: collection && collection.personalCollection
              })(
                <Checkbox />
              )}
            </FormItem>

            {/* <FormItem
              label={<FormattedMessage id="doi" defaultMessage="Digital Object Identifier"/>}
              warning={
                <FormattedMessage
                  id="warning.datasetDOI"
                  defaultMessage="Changes should be made understanding the consequences"
                />
              }
              isNew={isNew}
            >
              {getFieldDecorator('doi', {
                initialValue: collection && collection.doi,
                rules: [{
                  validator: validateDOI(<FormattedMessage id="invalid.doi" defaultMessage="Digital Object Identifier is invalid"/>)
                }]
              })(
                <Input/>
              )}
            </FormItem> */}

            <FormGroupHeader
              title={<FormattedMessage id="mailingAddress" defaultMessage="Mailing address" />}
              helpText={<FormattedMessage id="help.mailingAddress" defaultMessage="An address to send emails" />}
            />

            {getFieldDecorator('mailingAddress.key', { initialValue: mailingAddress.key })(
              <Input style={{ display: 'none' }} />
            )}

            <FormItem originalValue={diff.mailingAddress.address} label={<FormattedMessage id="address" defaultMessage="Address" />}>
              {getFieldDecorator('mailingAddress.address', { initialValue: mailingAddress.address })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.mailingAddress.city} label={<FormattedMessage id="city" defaultMessage="City" />}>
              {getFieldDecorator('mailingAddress.city', { initialValue: mailingAddress.city })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.mailingAddress.province} label={<FormattedMessage id="province" defaultMessage="Province" />}>
              {getFieldDecorator('mailingAddress.province', { initialValue: mailingAddress.province })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.mailingAddress.country} label={<FormattedMessage id="country" defaultMessage="Country" />}>
              {getFieldDecorator('mailingAddress.country', {
                initialValue: mailingAddress ? mailingAddress.country : undefined
              })(
                <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country" />}>
                  {countries.map(country => (
                    <Select.Option value={country} key={country}>
                      <FormattedMessage id={`country.${country}`} />
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem originalValue={diff.mailingAddress.postalCode} label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}>
              {getFieldDecorator('mailingAddress.postalCode', { initialValue: mailingAddress.postalCode })(
                <Input />
              )}
            </FormItem>

            <FormGroupHeader
              title={<FormattedMessage id="physicalAddress" defaultMessage="Physical address" />}
              helpText={<FormattedMessage id="help.physicalAddress" defaultMessage="An address of a building" />}
            />

            {getFieldDecorator('address.key', { initialValue: address.key })(
              <Input style={{ display: 'none' }} />
            )}

            <FormItem originalValue={diff.address.address} label={<FormattedMessage id="address" defaultMessage="Address" />}>
              {getFieldDecorator('address.address', { initialValue: address.address })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.address.city} label={<FormattedMessage id="city" defaultMessage="City" />}>
              {getFieldDecorator('address.city', { initialValue: address.city })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.address.province} label={<FormattedMessage id="province" defaultMessage="Province" />}>
              {getFieldDecorator('address.province', { initialValue: address.province })(
                <Input />
              )}
            </FormItem>

            <FormItem originalValue={diff.address.country} label={<FormattedMessage id="country" defaultMessage="Country" />}>
              {getFieldDecorator('address.country', { initialValue: address ? address.country : undefined })(
                <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country" />}>
                  {countries.map(country => (
                    <Select.Option value={country} key={country}>
                      <FormattedMessage id={`country.${country}`} />
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem originalValue={diff.address.postalCode} label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}>
              {getFieldDecorator('address.postalCode', { initialValue: address.postalCode })(
                <Input />
              )}
            </FormItem>

            {isSuggestion && <div className={classes.suggestMeta}>
              <FormGroupHeader
                title={<FormattedMessage id="suggestion.aboutSuggester" defaultMessage="About you" />}
              />
              <FormItem label={<FormattedMessage id="_comment" defaultMessage="Comment" />}>
                {getFieldDecorator('_comment', {
                  rules: [{
                    required: !reviewChange, message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name" />
                  }]
                })(
                  <Input disabled={reviewChange} />
                )}
              </FormItem>
              <FormItem label={<FormattedMessage id="_email" defaultMessage="Email" />}>
                {getFieldDecorator('_proposerEmail', {
                  initialValue: user ? user.email : null,
                  rules: [{
                    required: !reviewChange, message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name" />
                  }]
                })(
                  <Input disabled={reviewChange} />
                )}
              </FormItem>
            </div>}
            {!isSuggestion && reviewChange && <div className={classes.suggestMeta}>
              <FormGroupHeader
                title={<FormattedMessage id="suggestion.reviewerComment" defaultMessage="Reviewers comment" />}
              />
              <FormItem label={<FormattedMessage id="_comment" defaultMessage="Comment" />}>
                {getFieldDecorator('_comment', {
                  rules: [{
                    required: reviewChange, message: <FormattedMessage id="suggestion.provideComment" defaultMessage="Please provide a comment" />
                  }]
                })(
                  <Input />
                )}
              </FormItem>
            </div>}
          </>}
          {!reviewChange &&
            <Row>
              <Col className="btn-container text-right">
                <Button htmlType="button" onClick={this.props.onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                <Button type="primary" htmlType="submit" disabled={collection && !form.isFieldsTouched() && !reviewChange}>
                  {collection ?
                    <FormattedMessage id="save" defaultMessage="Save" /> :
                    <FormattedMessage id="create" defaultMessage="Create" />
                  }
                </Button>
              </Col>
            </Row>
          }
          {reviewChange &&
            <Row>
              <Col className="btn-container text-right">
                <Button htmlType="button" onClick={this.props.onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                <Button type="primary" htmlType="submit" disabled={collection && !form.isFieldsTouched() && !reviewChange}>
                  <FormattedMessage id="suggestion.apply" defaultMessage="Apply suggestion" />
                </Button>
              </Col>
            </Row>
          }
        </Form>
      </React.Fragment>
    );
  }
}

CollectionForm.propTypes = {
  collection: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ user, countries, addError, addSuccess }) => ({ user, countries, addError, addSuccess });

const WrappedCollectionForm = Form.create()(withContext(mapContextToProps)(withRouter(injectSheet(styles)(CollectionForm))));
export default WrappedCollectionForm;

function isObj(o) {
  return typeof o === 'object' && o !== null;
}
