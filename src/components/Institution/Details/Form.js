import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Alert, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import injectSheet from 'react-jss';
import { withRouter } from 'react-router-dom';
import SimilarTag from '../../common/SimilarTag';

// APIs
import { institutionSearch, createInstitution, updateAndApplySuggestion, discardSuggestion, suggestNewInstitution, suggestUpdateInstitution, updateInstitution } from '../../../api/institution';
import {
  getInstitutionType,
  getInstitutionGovernance,
  getDiscipline,
  getCitesAppendix
} from '../../../api/enumeration';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FormItem, FormGroupHeader, TagControl, AlternativeCodes, MapComponent } from '../../common';
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

class InstitutionForm extends Component {
  state = {
    types: [],
    governance: [],
    disciplines: [],
    citesAppendices: []
  };

  async componentDidMount() {
    const [types, governance, disciplines, citesAppendices] = await Promise.all([
      getInstitutionType(),
      getInstitutionGovernance(),
      getDiscipline(),
      getCitesAppendix()
    ]);

    this.updateDiff();
    this.setState({ types, governance, disciplines, citesAppendices });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.collection !== this.props.collection || prevProps.original !== this.props.original) {
      this.updateDiff();
    }
  }

  updateDiff = () => {
    const { institution, original } = this.props;
    let diff = {};
    if (institution && original && JSON.stringify(original) !== JSON.stringify(institution)) {
      diff = this.getDiff(original, institution);
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
    console.log('this.props.refresh');
    console.log(this.props.refresh);

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { _proposerEmail: proposerEmail, _comment: comment, ...bodyStub } = values;
        const body = { ...this.props.institution, ...bodyStub };
        if (this.props.mode === 'create') {
          if (!this.props.hasCreate) {
            suggestNewInstitution({ body, proposerEmail, comments: [comment] })
              .then(response => {
                this.props.addSuccess({ statusText: <FormattedMessage id="suggestion.suggestionLogged" defaultMessage="Thank you. Your suggestion has been logged" /> });
                this.props.history.push('/institution/search');
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
                  this.props.history.push('/institution/search');
                })
                .catch(error => {
                  if (error.response) {
                    this.props.addError({ status: error.response.status, statusText: error.response.data });
                  } else {
                    this.props.addError(error);
                  }
                });
            } else {
              createInstitution(values)
                .then(response => this.props.onSubmit(response.data))
                .catch(error => {
                  if (error.response) {
                    this.props.addError({ status: error.response.status, statusText: error.response.data });
                  } else {
                    this.props.addError({statusText: error.toString()});
                  }
                });
            }
          }
        } else {
          if (!this.props.hasUpdate) {
            suggestUpdateInstitution({ body, proposerEmail, comments: [comment] })
              .then(response => {
                this.props.addSuccess({ statusText: <FormattedMessage id="suggestion.suggestionLogged" defaultMessage="Thank you. Your suggestion has been logged" /> });
                this.props.onSubmit();
              })
              .catch(error => {
                console.error(error);
                if (error.response) {
                  this.props.addError({ status: error.response.status, statusText: error.response.data });
                } else {
                  this.props.addError({statusText: error.toString()});
                }
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
                  console.error(error);
                  this.props.addError({ status: error.response.status, statusText: error.response.data });
                });
            } else {
              // regular update
              updateInstitution(body)
                .then(() => this.props.onSubmit())
                .catch(error => {
                  console.error(error);
                  this.props.addError({ status: error.response.status, statusText: error.response.data });
                });
            }
          }
        }
      }
    });
  };

  getCoordinates = (latitude, longitude) => {
    const { form } = this.props;

    form.setFieldsValue({ latitude, longitude });
  };

  discard = () => {
    discardSuggestion(this.props.suggestion.key)
      .then(() => this.props.onSubmit())
      .catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
  }

  render() {
    const { classes, mode, suggestion, institution, form, countries, reviewChange, hasCreate, hasUpdate } = this.props;
    const mailingAddress = institution && institution.mailingAddress ? institution.mailingAddress : {};
    const address = institution && institution.address ? institution.address : {};
    const { getFieldDecorator } = form;
    const { types, governance, disciplines, citesAppendices } = this.state;
    let { diff: difference } = this.state;
    let { user } = this.props;
    const diff = { ...{ mailingAddress: {}, address: {} }, ...difference };
    console.log(diff);

    const isSuggestion = mode === 'create' ? !hasCreate : !hasUpdate;
    // const hasChanges = (suggestion && suggestion.changes.length > 0) || mode === 'create';
    const isCreate = mode === 'create';

    const city = address.city || mailingAddress.city;

    const similarThreshold = isCreate ? 0 : 1;
    return (
      <React.Fragment>
        {hasUpdate && suggestion && !isCreate && <Alert
          message={<div>
            <p>
              <FormattedMessage id="suggestion.updateAndOVerwrite" defaultMessage="You are viewing a suggestion to update a institution. You can overwrite and add additional details." />
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
              <FormattedMessage id="suggestion.createSuggestion" defaultMessage="You are viewing a suggestion to create a institution." />
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
        {institution && <>
          <SimilarTag fn={institutionSearch}
            query={{ name: institution.name }}
            color="red"
            to={`/institution/search`}
            threshold={similarThreshold}
          >Same name</SimilarTag>
          {institution.code && <SimilarTag fn={institutionSearch}
            query={{ code: institution.code }}
            color="red"
            to={`/institution/search`}
            threshold={similarThreshold}
          >Same code</SimilarTag>}
          {city && <SimilarTag fn={institutionSearch}
            query={{ fuzzyName: institution.name, city: address.city || mailingAddress.city }}
            color="orange"
            to={`/institution/search`}
            threshold={similarThreshold}
          >Similar name + same city</SimilarTag>}
        </>}
        <Form onSubmit={this.handleSubmit}>

          <FormItem originalValue={diff.name} 
                    label={<FormattedMessage id="name" defaultMessage="Name" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.name"
                      />}
                    >
            {getFieldDecorator('name', {
              initialValue: institution && institution.name,
              rules: [{
                required: true, message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name" />
              }]
            })(
              <Input />
            )}
          </FormItem>

          <FormItem originalValue={diff.description} 
                    label={<FormattedMessage id="description" defaultMessage="Description" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.description"
                      />}
                    >
            {getFieldDecorator('description', { initialValue: institution && institution.description })(
              <Input.TextArea rows={4} />
            )}
          </FormItem>

          <FormItem originalValue={diff.code} 
                    label={<FormattedMessage id="code" defaultMessage="Code" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.code"
                      />}
                    >
            {getFieldDecorator('code', {
              initialValue: institution && institution.code,
              rules: [{
                required: true, message: <FormattedMessage id="provide.code" defaultMessage="Please provide a code" />
              }]
            })(
              <Input />
            )}
          </FormItem>

          <FormItem originalValue={diff.alternativeCodes} 
                    label={<FormattedMessage id="alternativeCodes" defaultMessage="Alternative codes" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.alternativeCodes"
                      />}
                    >
            {getFieldDecorator('alternativeCodes', {
              initialValue: institution ? institution.alternativeCodes : [],
            })(
              <AlternativeCodes />
            )}
          </FormItem>

          <FormItem originalValue={diff.type} 
                    label={<FormattedMessage id="type" defaultMessage="Type" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.type"
                      />}
                    >
            {getFieldDecorator('type', {
              initialValue: institution ? institution.type : undefined
            })(
              <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type" />}>
                {types.map(type => (
                  <Select.Option value={type} key={type}>
                    <FormattedMessage id={`institutionType.${type}`} />
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem originalValue={diff.active} 
                    label={<FormattedMessage id="active" defaultMessage="Active" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.active"
                      />}
                    >
            {getFieldDecorator('active', {
              valuePropName: 'checked',
              initialValue: institution && institution.active
            })(
              <Checkbox />
            )}
          </FormItem>

          <FormItem originalValue={diff.homepage} 
                    label={<FormattedMessage id="homepage" defaultMessage="Homepage" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.homepage"
                      />}
                    >
            {getFieldDecorator('homepage', {
              initialValue: institution && institution.homepage,
              rules: [{
                validator: validateUrl(<FormattedMessage id="invalid.homepage" defaultMessage="Homepage is invalid" />)
              }]
            })(
              <Input />
            )}
          </FormItem>

          <FormItem originalValue={diff.phone} 
                    label={<FormattedMessage id="phone" defaultMessage="Phone" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.phone"
                      />}
                    >
            {getFieldDecorator('phone', {
              initialValue: institution ? institution.phone : [],
              rules: [{
                validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid" />)
              }]
            })(
              <TagControl label={<FormattedMessage id="newPhone" defaultMessage="New phone" />} removeAll={true} />
            )}
          </FormItem>

          <FormItem originalValue={diff.email} 
                    label={<FormattedMessage id="email" defaultMessage="Email" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.email"
                      />}
                    >
            {getFieldDecorator('email', {
              initialValue: institution ? institution.email : [],
              rules: [{
                validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid" />)
              }]
            })(
              <TagControl label={<FormattedMessage id="newEmail" defaultMessage="New email" />} removeAll={true} />
            )}
          </FormItem>

          <FormItem originalValue={diff.catalogUrl} 
                    label={<FormattedMessage id="catalogUrl" defaultMessage="Catalog URL" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.catalogUrl"
                      />}
                    >
            {getFieldDecorator('catalogUrl', {
              initialValue: institution && institution.catalogUrl,
              rules: [{
                validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid" />)
              }]
            })(
              <Input />
            )}
          </FormItem>

          <FormItem originalValue={diff.apiUrl} 
                    label={<FormattedMessage id="apiUrl" defaultMessage="API URL" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.apiUrl"
                      />}
                    >
            {getFieldDecorator('apiUrl', {
              initialValue: institution && institution.apiUrl,
              rules: [{
                validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid" />)
              }]
            })(
              <Input />
            )}
          </FormItem>

          <FormItem originalValue={diff.institutionalGovernance} 
                    label={<FormattedMessage id="institutionalGovernance" defaultMessage="Institutional governance" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.institutionalGovernance"
                      />}
                    >
            {getFieldDecorator('institutionalGovernance', {
              initialValue: institution ? institution.institutionalGovernance : undefined
            })(
              <Select placeholder={<FormattedMessage id="select.governance" defaultMessage="Select a governance" />}>
                {governance.map(item => (
                  <Select.Option value={item} key={item}>
                    <FormattedMessage id={`institutionGovernance.${item}`} />
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem originalValue={diff.disciplines} 
                    label={<FormattedMessage id="disciplines" defaultMessage="Disciplines" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.disciplines"
                      />}
                    >
            {getFieldDecorator('disciplines', {
              initialValue: institution ? institution.disciplines : undefined
            })(
              <Select
                mode="multiple"
                placeholder={<FormattedMessage id="select.discipline" defaultMessage="Select a discipline" />}
              >
                {disciplines.map(discipline => (
                  <Select.Option value={discipline} key={discipline}>
                    <FormattedMessage id={`discipline.${discipline}`} />
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem originalValue={diff.latitude} 
                    label={<FormattedMessage id="latitude" defaultMessage="Latitude" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.latitude"
                      />}
                    >
            {getFieldDecorator('latitude', { initialValue: institution && institution.latitude })(
              <Input />
            )}
          </FormItem>

          <FormItem originalValue={diff.longitude} 
                    label={<FormattedMessage id="longitude" defaultMessage="Longitude" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.longitude"
                      />}
                    >
            {getFieldDecorator('longitude', { initialValue: institution && institution.longitude })(
              <Input />
            )}
          </FormItem>

          <MapComponent
            lat={form.getFieldValue('latitude')}
            lng={form.getFieldValue('longitude')}
            getCoordinates={this.getCoordinates}
            helpText={<FormattedMessage
              id="help.coordinates"
              defaultMessage="Use map to select your coordinates manually"
            />}
          />

          <FormItem originalValue={diff.additionalNames} 
                    label={<FormattedMessage id="additionalNames" defaultMessage="Additional names" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.additionalNames"
                      />}
                    >
            {getFieldDecorator('additionalNames', {
              initialValue: institution && institution.additionalNames,
              defaultValue: []
            })(
              <TagControl label={<FormattedMessage id="name" defaultMessage="Name" />} removeAll={true} />
            )}
          </FormItem>

          <FormItem originalValue={diff.foundingDate} 
                    label={<FormattedMessage id="foundingDate" defaultMessage="Founding date" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.foundingDate"
                      />}
                    >
            {getFieldDecorator('foundingDate', {
              initialValue: institution && institution.foundingDate && moment(institution.foundingDate)
            })(
              <DatePicker allowClear={true} format={'L'} />
            )}
          </FormItem>

          <FormItem originalValue={diff.geographicDescription} 
                    label={<FormattedMessage id="geographicDescription" defaultMessage="Geographic description" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.geographicDescription"
                      />}
                    >
            {getFieldDecorator('geographicDescription', {
              initialValue: institution && institution.geographicDescription
            })(
              <Input.TextArea rows={4} />
            )}
          </FormItem>

          <FormItem originalValue={diff.taxonomicDescription} 
                    label={<FormattedMessage id="taxonomicDescription" defaultMessage="Taxonomic description" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.taxonomicdescription"
                      />}
                    >
            {getFieldDecorator('taxonomicDescription', {
              initialValue: institution && institution.taxonomicDescription
            })(
              <Input.TextArea rows={4} />
            )}
          </FormItem>

          <FormItem originalValue={diff.numberSpecimens} 
                    label={<FormattedMessage id="numberSpecimens" defaultMessage="Number specimens" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.numberSpecimens"
                      />}
                    >
            {getFieldDecorator('numberSpecimens', { initialValue: institution && institution.numberSpecimens })(
              <InputNumber min={0} max={100000000} />
            )}
          </FormItem>

          <FormItem originalValue={diff.indexHerbariorumRecord} 
                    label={<FormattedMessage id="indexHerbariorumRecord" defaultMessage="Herbariorum record" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.indexHerbariorumRecord"
                      />}
                    >
            {getFieldDecorator('indexHerbariorumRecord', {
              valuePropName: 'checked',
              initialValue: institution && institution.indexHerbariorumRecord
            })(
              <Checkbox />
            )}
          </FormItem>

          <FormItem originalValue={diff.logoUrl} 
                    label={<FormattedMessage id="logoUrl" defaultMessage="Logo URL" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.logoUrl"
                      />}
                    >
            {getFieldDecorator('logoUrl', {
              initialValue: institution && institution.logoUrl,
              rules: [{
                validator: validateUrl(
                  <FormattedMessage id="invalid.url.logo" defaultMessage="Logo url is invalid" />
                )
              }]
            })(
              <Input />
            )}
          </FormItem>

          <FormItem originalValue={diff.citesPermitNumber} 
                    label={<FormattedMessage id="citesPermitNumber" defaultMessage="Cites permit number" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.citesPermitNumber"
                      />}
                    >
            {getFieldDecorator('citesPermitNumber', {
              initialValue: institution ? institution.citesPermitNumber : undefined
            })(
              <Select placeholder={<FormattedMessage id="select.number" defaultMessage="Select a number" />}>
                {citesAppendices.map(citesAppendix => (
                  <Select.Option value={citesAppendix} key={citesAppendix}>
                    {citesAppendix}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormGroupHeader
            title={<FormattedMessage id="mailingAddress" defaultMessage="Mailing address" />}
            helpText={<FormattedMessage id="help.mailingAddress" defaultMessage="An address to send emails" />}
          />

          {getFieldDecorator('mailingAddress.key', { initialValue: mailingAddress.key })(
            <Input style={{ display: 'none' }} />
          )}

          <FormItem originalValue={diff.mailingAddress.address} 
                    label={<FormattedMessage id="address" defaultMessage="Address" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.mailingAddress.address"
                      />}
                    >
            {getFieldDecorator('mailingAddress.address', {
              initialValue: mailingAddress.address,
              defaultValue: []
            })(
              <Input />
            )}
          </FormItem>

          <FormItem originalValue={diff.mailingAddress.city} 
                    label={<FormattedMessage id="city" defaultMessage="City" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.mailingAddress.city"
                      />}
                    >
            {getFieldDecorator('mailingAddress.city', { initialValue: mailingAddress.city })(
              <Input />
            )}
          </FormItem>

          <FormItem originalValue={diff.mailingAddress.province} 
                    label={<FormattedMessage id="province" defaultMessage="Province" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.mailingAddress.province"
                      />}
                    >
            {getFieldDecorator('mailingAddress.province', { initialValue: mailingAddress.province })(
              <Input />
            )}
          </FormItem>

          <FormItem originalValue={diff.mailingAddress.country} 
                    label={<FormattedMessage id="country" defaultMessage="Country" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.mailingAddress.country"
                      />}
                    >
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

          <FormItem originalValue={diff.mailingAddress.postalCode} 
                    label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.mailingAddress.postalCode"
                      />}
                    >
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

          <FormItem originalValue={diff.address.address} 
                    label={<FormattedMessage id="address" defaultMessage="Address" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.address.address"
                      />}
                    >
            {getFieldDecorator('address.address', {
              initialValue: address.address,
              defaultValue: []
            })(
              <Input />
            )}
          </FormItem>

          <FormItem originalValue={diff.address.city} 
                    label={<FormattedMessage id="city" defaultMessage="City" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.address.city"
                      />}
                    >
            {getFieldDecorator('address.city', { initialValue: address.city })(
              <Input />
            )}
          </FormItem>

          <FormItem originalValue={diff.address.province} 
                    label={<FormattedMessage id="province" defaultMessage="Province" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.address.province"
                      />}
                    >
            {getFieldDecorator('address.province', { initialValue: address.province })(
              <Input />
            )}
          </FormItem>

          <FormItem originalValue={diff.address.country} 
                    label={<FormattedMessage id="country" defaultMessage="Country" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.address.country"
                      />}
                    >
            {getFieldDecorator('address.country', {
              initialValue: address ? address.country : undefined
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

          <FormItem originalValue={diff.address.postalCode} 
                    label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}
                    helpText={
                      <FormattedMessage
                        id="help.institution.address.postalCode"
                      />}
                    >
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
                  required: !reviewChange, message: <FormattedMessage id="provide.comment" defaultMessage="Please provide a comment" />
                }]
              })(
                <Input disabled={reviewChange} />
              )}
            </FormItem>
            <FormItem label={<FormattedMessage id="_email" defaultMessage="Email" />}>
              {getFieldDecorator('_proposerEmail', {
                initialValue: user ? user.email : null,
                rules: [{
                  required: !reviewChange, message: <FormattedMessage id="provide.email" defaultMessage="Please provide an email" />
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
          {!reviewChange &&
            <Row>
              <Col className="btn-container text-right">
                <Button htmlType="button" onClick={this.props.onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                <Button type="primary" htmlType="submit" disabled={institution && !form.isFieldsTouched() && !reviewChange}>
                  {institution ?
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
                <Button type="primary" htmlType="submit" disabled={institution && !form.isFieldsTouched() && !reviewChange}>
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

InstitutionForm.propTypes = {
  institution: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ countries, addError, addSuccess }) => ({ countries, addError, addSuccess });

const WrappedInstitutionForm = Form.create()(withContext(mapContextToProps)(withRouter(injectSheet(styles)(InstitutionForm))));
export default WrappedInstitutionForm;

function isObj(o) {
  return typeof o === 'object' && o !== null;
}
