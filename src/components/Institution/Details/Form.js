import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Alert, Checkbox, Col, DatePicker, Input, InputNumber, Row, Select, Form } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import injectSheet from 'react-jss';
import { withRouter } from 'react-router-dom';
import SimilarTag from '../../common/SimilarTag';
import _get from 'lodash/get';

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
import { FormItem, FormGroupHeader, TagControl, AlternativeCodes, JsonFormField, MapComponent } from '../../common';
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

const InstitutionForm = props => {
  const { classes, mode, suggestion, institution, original, countries, reviewChange, hasCreate, hasUpdate } = props;


  const [form] = Form.useForm();
  const [isTouched, setIsTouched] = useState(false)
  const [types, setTypes] = useState([])
  const [governance, setGovernance] = useState([])
  const [disciplines, setDisciplines] = useState([])
  const [citesAppendices, setCitesAppendices] = useState([])
  const [latLng, setLatLng] = useState({ latitude: institution?.latitude || 0, longitude: institution?.longitude || 0 })
  const [diff, setDiff] = useState({ mailingAddress: {}, address: {} })
  const [initialValues, setInitialValues] = useState(null);
  useEffect(() => {
    const init = async () => {
      const [typesRes, governanceRes, disciplinesRes, citesAppendicesRes] = await Promise.all([
        getInstitutionType(),
        getInstitutionGovernance(),
        getDiscipline(),
        getCitesAppendix()
      ]);
      setTypes(typesRes)
      setGovernance(governanceRes)
      setDisciplines(disciplinesRes)
      setCitesAppendices(citesAppendicesRes)
      updateDiff();
    }
    init()
  }, [])

  useEffect(() => {
    updateDiff();

    if (institution && !initialValues) {
      const initialValues_ = createInitialValues();
      form.setFieldsValue(initialValues_)
      setInitialValues(initialValues_)
      setLatLng({ latitude: institution?.latitude || 0, longitude: institution?.longitude || 0 })
    }

  }, [institution, original])

  const createInitialValues = () => {
    return { alternativeCodes: [], phone: [], email: [], additionalNames: [], mailingAddress: {}, address: {}, ...institution }
  }

  const updateDiff = () => {
    if (institution && original && JSON.stringify(original) !== JSON.stringify(institution)) {
      setDiff(getDiff(original, institution));
    }
  }

  const getDiff = (o = {}, s = {}) => {
    let _diff = {};
    Object.keys(s)
      .filter(x => x !== 'key' && JSON.stringify(o[x]) !== JSON.stringify(s[x]))
      .forEach(x => _diff[x] = typeof o[x] === 'undefined' ? null : o[x]);

    if (s.mailingAddress && isObj(s.mailingAddress)) {
      _diff.mailingAddress = getDiff(o.mailingAddress, s.mailingAddress);
    }
    if (s.address && isObj(s.address)) {
      _diff.address = getDiff(o.address, s.address);
    }
    return _diff;
  }

  const handleSubmit = (values) => {
    console.log('props.refresh');
    console.log(props.refresh);

    const { _proposerEmail: proposerEmail, _comment: comment, ...bodyStub } = values;
    const body = { ...props.institution, ...bodyStub };
    if (props.mode === 'create') {
      if (!props.hasCreate) {
        suggestNewInstitution({ body, proposerEmail, comments: [comment] })
          .then(response => {
            props.addSuccess({ statusText: <FormattedMessage id="suggestion.suggestionLogged" defaultMessage="Thank you. Your suggestion has been logged" /> });
            props.history.push('/institution/search');
          })
          .catch(error => {
            props.addError({ status: error.response.status, statusText: error.response.data });
          });
      } else {
        if (props.reviewChange) {
          //apply suggested creation
          updateAndApplySuggestion(props.suggestion.key, { ...props.suggestion, suggestedEntity: body, comments: [...props.suggestion.comments, comment] })
            .then(response => {
              props.addSuccess({ statusText: <FormattedMessage id="suggestion.appliedSuccess" defaultMessage="Suggestion was applied" /> });
              props.history.push('/institution/search');
            })
            .catch(error => {
              if (error.response) {
                props.addError({ status: error.response.status, statusText: error.response.data });
              } else {
                props.addError(error);
              }
            });
        } else {
          createInstitution(values)
            .then(response => props.onSubmit(response.data))
            .catch(error => {
              if (error.response) {
                props.addError({ status: error.response.status, statusText: error.response.data });
              } else {
                props.addError({ statusText: error.toString() });
              }
            });
        }
      }
    } else {
      if (!props.hasUpdate) {
        suggestUpdateInstitution({ body, proposerEmail, comments: [comment] })
          .then(response => {
            props.addSuccess({ statusText: <FormattedMessage id="suggestion.suggestionLogged" defaultMessage="Thank you. Your suggestion has been logged" /> });
            props.onSubmit();
          })
          .catch(error => {
            console.error(error);
            if (error.response) {
              props.addError({ status: error.response.status, statusText: error.response.data });
            } else {
              props.addError({ statusText: error.toString() });
            }
          });
      } else {
        if (props.reviewChange) {
          //apply suggested creation
          updateAndApplySuggestion(props.suggestion.key, { ...props.suggestion, suggestedEntity: body, comments: [...props.suggestion.comments, comment] })
            .then(response => {
              props.addSuccess({ statusText: <FormattedMessage id="suggestion.appliedSuccess" defaultMessage="Suggestion was applied" /> });
              props.onSubmit();
            })
            .catch(error => {
              console.error(error);
              props.addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          // regular update
          updateInstitution(body)
            .then(() => props.onSubmit())
            .catch(error => {
              console.error(error);
              props.addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      }
    }


  };

  const getCoordinates = (latitude, longitude) => {
    setLatLng({ latitude, longitude })
    setIsTouched(true)
    form.setFieldsValue({ latitude, longitude });
  };

  const discard = () => {
    discardSuggestion(props.suggestion.key)
      .then(() => props.onSubmit())
      .catch(error => {
        props.addError({ status: error.response.status, statusText: error.response.data });
      });
  }

  const isLockedByMaster = (name) => {
    const { masterSourceFields, institution } = props;
    if (!institution) return false;
    const masterConfig = _get(masterSourceFields, `${name}.sourceMap.${institution.masterSource}`);
    if (masterConfig && !masterConfig.overridable) {
      return true;
    }
    return false;
  }

  const mailingAddress = initialValues && initialValues.mailingAddress ? initialValues.mailingAddress : {};
  const address = initialValues && initialValues.address ? initialValues.address : {};
  // let difference  = diff;
  let { user } = props;
  //  const diff = { ...{ mailingAddress: {}, address: {} }, ...difference };

  const isSuggestion = mode === 'create' ? !hasCreate : !hasUpdate;
  // const hasChanges = (suggestion && suggestion.changes.length > 0) || mode === 'create';
  const isCreate = mode === 'create';

  const city = address.city || mailingAddress.city;

  const similarThreshold = isCreate ? 0 : 1;

  let contactChanges;
  if (suggestion && suggestion.changes.length > 0) {
    contactChanges = suggestion.changes.find(c => c.field === 'contactPersons');
  }

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
        style={{ marginBottom: '10px' }}
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
        style={{ marginBottom: '10px' }}
      />}
      {!hasUpdate && !isCreate && !reviewChange && <Alert
        message={<FormattedMessage id="suggestion.noEditAccess" defaultMessage="You do not have edit access, but you can suggest a change if you provide your email." />}
        type="warning"
      />}
      {!hasCreate && isCreate && !reviewChange && <Alert
        message={<FormattedMessage id="suggestion.noEditAccess" defaultMessage="You do not have edit access, but you can suggest a change if you provide your email." />}
        type="warning"
        style={{ marginBottom: '10px' }}
      />}
      {institution && <div style={{ marginBottom: '10px' }}>
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
      </div>}
      <Form initialValues={initialValues || { alternativeCodes: [], phone: [], email: [], additionalNames: [], mailingAddress: {}, address: {} }} onFinish={handleSubmit} form={form} onFieldsChange={(info) => {
        setIsTouched(true)
      }}>

        <FormItem originalValue={diff.name}
          name='name'
          rules={[{
            required: true, message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name" />
          }]}
          lockedByMasterSource={isLockedByMaster('name')}
          label={<FormattedMessage id="name" defaultMessage="Name" />}
          helpText={
            <FormattedMessage
              id="help.institution.name"
            />}
        >
          <Input disabled={isLockedByMaster('name')} />
        </FormItem>

        <FormItem originalValue={diff.description}
          name='description'
          lockedByMasterSource={isLockedByMaster('description')}
          label={<FormattedMessage id="description" defaultMessage="Description" />}
          helpText={
            <FormattedMessage
              id="help.institution.description"
            />}
        >
          <Input.TextArea rows={4} disabled={isLockedByMaster('description')} />
        </FormItem>

        <FormItem originalValue={diff.code}
          name='code'
          rules={[{
            required: true, message: <FormattedMessage id="provide.code" defaultMessage="Please provide a code" />
          }]}
          lockedByMasterSource={isLockedByMaster('code')}
          label={<FormattedMessage id="code" defaultMessage="Code" />}
          helpText={
            <FormattedMessage
              id="help.institution.code"
            />}
        >
          <Input disabled={isLockedByMaster('code')} />
        </FormItem>

        <FormItem originalValue={diff.alternativeCodes}
          name='alternativeCodes'

          lockedByMasterSource={isLockedByMaster('alternativeCodes')}
          label={<FormattedMessage id="alternativeCodes" defaultMessage="Alternative codes" />}
          helpText={
            <FormattedMessage
              id="help.institution.alternativeCodes"
            />}
        >
          <AlternativeCodes disabled={isLockedByMaster('alternativeCodes')} />
        </FormItem>

        <FormItem originalValue={diff.type}
          name='type'
          lockedByMasterSource={isLockedByMaster('type')}
          label={<FormattedMessage id="type" defaultMessage="Type" />}
          helpText={
            <FormattedMessage
              id="help.institution.type"
            />}
        >
          <Select
            placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type" />}
            disabled={isLockedByMaster('type')} >
            {types.map(type => (
              <Select.Option value={type} key={type}>
                <FormattedMessage id={`institutionType.${type}`} />
              </Select.Option>
            ))}
          </Select>
        </FormItem>

        <FormItem originalValue={diff.active}
          name='active'
          valuePropName='checked'
          lockedByMasterSource={isLockedByMaster('active')}
          label={<FormattedMessage id="active" defaultMessage="Active" />}
          helpText={
            <FormattedMessage
              id="help.institution.active"
            />}
        >
          <Checkbox disabled={isLockedByMaster('active')} />
        </FormItem>

        <FormItem originalValue={diff.homepage}
          name='homepage'
          rules={[{
            validator: validateUrl(<FormattedMessage id="invalid.homepage" defaultMessage="Homepage is invalid" />)
          }]}
          lockedByMasterSource={isLockedByMaster('homepage')}
          label={<FormattedMessage id="homepage" defaultMessage="Homepage" />}
          helpText={
            <FormattedMessage
              id="help.institution.homepage"
            />}
        >
          <Input disabled={isLockedByMaster('homepage')} />
        </FormItem>

        <FormItem originalValue={diff.phone}
          name='phone'
          rules={[{
            validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid" />)
          }]}
          lockedByMasterSource={isLockedByMaster('phone')}
          label={<FormattedMessage id="phone" defaultMessage="Phone" />}
          helpText={
            <FormattedMessage
              id="help.institution.phone"
            />}
        >
          <TagControl disabled={isLockedByMaster('phone')} label={<FormattedMessage id="newPhone" defaultMessage="New phone" />} removeAll={true} />
        </FormItem>

        <FormItem originalValue={diff.email}
          name='email'
          rules={[{
            validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid" />)
          }]}
          lockedByMasterSource={isLockedByMaster('email')}
          label={<FormattedMessage id="email" defaultMessage="Email" />}
          helpText={
            <FormattedMessage
              id="help.institution.email"
            />}
        >
          <TagControl disabled={isLockedByMaster('email')} label={<FormattedMessage id="newEmail" defaultMessage="New email" />} removeAll={true} />
        </FormItem>

        <FormItem originalValue={diff.catalogUrl}
          name='catalogUrl'
          rules={[{
            validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid" />)
          }]}
          lockedByMasterSource={isLockedByMaster('catalogUrl')}
          label={<FormattedMessage id="catalogUrl" defaultMessage="Catalog URL" />}
          helpText={
            <FormattedMessage
              id="help.institution.catalogUrl"
            />}
        >
          <Input disabled={isLockedByMaster('catalogUrl')} />
        </FormItem>

        <FormItem originalValue={diff.apiUrl}
          name='apiUrl'
          rules={[{
            validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid" />)
          }]}
          lockedByMasterSource={isLockedByMaster('apiUrl')}
          label={<FormattedMessage id="apiUrl" defaultMessage="API URL" />}
          helpText={
            <FormattedMessage
              id="help.institution.apiUrl"
            />}
        >
          <Input disabled={isLockedByMaster('apiUrl')} />
        </FormItem>

        <FormItem originalValue={diff.institutionalGovernance}
          name='institutionalGovernance'
          lockedByMasterSource={isLockedByMaster('institutionalGovernance')}
          label={<FormattedMessage id="institutionalGovernance" defaultMessage="Institutional governance" />}
          helpText={
            <FormattedMessage
              id="help.institution.institutionalGovernance"
            />}
        >
          <Select
            placeholder={<FormattedMessage id="select.governance" defaultMessage="Select a governance" />}
            disabled={isLockedByMaster('governance')}>
            {governance.map(item => (
              <Select.Option value={item} key={item}>
                <FormattedMessage id={`institutionGovernance.${item}`} />
              </Select.Option>
            ))}
          </Select>
        </FormItem>

        <FormItem originalValue={diff.disciplines}
          name='disciplines'
          lockedByMasterSource={isLockedByMaster('disciplines')}
          label={<FormattedMessage id="disciplines" defaultMessage="Disciplines" />}
          helpText={
            <FormattedMessage
              id="help.institution.disciplines"
            />}
        >
          <Select
            mode="multiple"
            disabled={isLockedByMaster('disciplines')}
            placeholder={<FormattedMessage id="select.discipline" defaultMessage="Select a discipline" />}
          >
            {disciplines.map(discipline => (
              <Select.Option value={discipline} key={discipline}>
                <FormattedMessage id={`discipline.${discipline}`} />
              </Select.Option>
            ))}
          </Select>
        </FormItem>

        <FormItem originalValue={diff.latitude}
          name='latitude'
          lockedByMasterSource={isLockedByMaster('latitude')}
          label={<FormattedMessage id="latitude" defaultMessage="Latitude" />}
          helpText={
            <FormattedMessage
              id="help.institution.latitude"
            />}
        >
          <Input disabled={isLockedByMaster('latitude')} />
        </FormItem>

        <FormItem originalValue={diff.longitude}
          name='longitude'
          lockedByMasterSource={isLockedByMaster('longitude')}
          label={<FormattedMessage id="longitude" defaultMessage="Longitude" />}
          helpText={
            <FormattedMessage
              id="help.institution.longitude"
            />}
        >
          <Input disabled={isLockedByMaster('longitude')} />
        </FormItem>

        {!isLockedByMaster('longitude') && <MapComponent
          lat={latLng.latitude}
          lng={latLng.longitude}
          getCoordinates={getCoordinates}
          helpText={<FormattedMessage
            id="help.coordinates"
            defaultMessage="Use map to select your coordinates manually"
          />}
          address={getAddressString(institution)}
        />}

        <FormItem originalValue={diff.additionalNames}
          name='additionalNames'
          lockedByMasterSource={isLockedByMaster('additionalNames')}
          label={<FormattedMessage id="additionalNames" defaultMessage="Additional names" />}
          helpText={
            <FormattedMessage
              id="help.institution.additionalNames"
            />}
        >
          <TagControl disabled={isLockedByMaster('additionalNames')} label={<FormattedMessage id="name" defaultMessage="Name" />} removeAll={true} />
        </FormItem>

        <FormItem originalValue={diff.foundingDate}
          name='foundingDate'
          lockedByMasterSource={isLockedByMaster('foundingDate')}
          label={<FormattedMessage id="foundingDate" defaultMessage="Founding date" />}
          helpText={
            <FormattedMessage
              id="help.institution.foundingDate"
            />}
        >
          <InputNumber min={0} max={2100}
            disabled={isLockedByMaster('foundingDate')} />
        </FormItem>

        <FormItem originalValue={diff.geographicDescription}
          name='geographicDescription'
          lockedByMasterSource={isLockedByMaster('geographicDescription')}
          label={<FormattedMessage id="geographicDescription" defaultMessage="Geographic description" />}
          helpText={
            <FormattedMessage
              id="help.institution.geographicDescription"
            />}
        >
          <Input.TextArea rows={4} disabled={isLockedByMaster('geographicDescription')} />
        </FormItem>

        <FormItem originalValue={diff.taxonomicDescription}
          name='taxonomicDescription'
          lockedByMasterSource={isLockedByMaster('taxonomicDescription')}
          label={<FormattedMessage id="taxonomicDescription" defaultMessage="Taxonomic description" />}
          helpText={
            <FormattedMessage
              id="help.institution.taxonomicdescription"
            />}
        >
          <Input.TextArea rows={4} disabled={isLockedByMaster('taxonomicDescription')} />
        </FormItem>

        <FormItem originalValue={diff.numberSpecimens}
          name='numberSpecimens'
          lockedByMasterSource={isLockedByMaster('numberSpecimens')}
          label={<FormattedMessage id="numberSpecimens" defaultMessage="Number specimens" />}
          helpText={
            <FormattedMessage
              id="help.institution.numberSpecimens"
            />}
        >
          <InputNumber min={0} max={100000000}
            disabled={isLockedByMaster('numberSpecimens')} />
        </FormItem>

        <FormItem originalValue={diff.indexHerbariorumRecord}
          name='indexHerbariorumRecord'
          valuePropName='checked'
          lockedByMasterSource={isLockedByMaster('indexHerbariorumRecord')}
          label={<FormattedMessage id="indexHerbariorumRecord" defaultMessage="Herbariorum record" />}
          helpText={
            <FormattedMessage
              id="help.institution.indexHerbariorumRecord"
            />}
        >
          <Checkbox disabled={isLockedByMaster('indexHerbariorumRecord')} />
        </FormItem>

        <FormItem originalValue={diff.logoUrl}
          name='logoUrl'
          rules={[{
            validator: validateUrl(
              <FormattedMessage id="invalid.url.logo" defaultMessage="Logo url is invalid" />
            )
          }]}
          lockedByMasterSource={isLockedByMaster('logoUrl')}
          label={<FormattedMessage id="logoUrl" defaultMessage="Logo URL" />}
          helpText={
            <FormattedMessage
              id="help.institution.logoUrl"
            />}
        >
          <Input disabled={isLockedByMaster('logoUrl')} />
        </FormItem>

        <FormItem originalValue={diff.citesPermitNumber}
          name='citesPermitNumber'
          lockedByMasterSource={isLockedByMaster('citesPermitNumber')}
          label={<FormattedMessage id="citesPermitNumber" defaultMessage="Cites permit number" />}
          helpText={
            <FormattedMessage
              id="help.institution.citesPermitNumber"
            />}
        >
          <Input disabled={isLockedByMaster('citesPermitNumber')} />
        </FormItem>

        <FormItem originalValue={diff.displayOnNHCPortal}
          name='displayOnNHCPortal'
          valuePropName='checked'
          lockedByMasterSource={isLockedByMaster('displayOnNHCPortal')}
          label={<FormattedMessage id="displayOnNHCPortal" defaultMessage="Display on NHC portal" />}
          helpText={
            <FormattedMessage
              id="help.institution.displayOnNHCPortal"
            />}
        >
          <Checkbox disabled={isLockedByMaster('displayOnNHCPortal')} />
        </FormItem>

        <FormGroupHeader
          title={<FormattedMessage id="mailingAddress" defaultMessage="Mailing address" />}
          helpText={<FormattedMessage id="help.mailingAddress" defaultMessage="An address to send emails" />}
        />
        <FormItem name={['mailingAddress', 'key']} style={{ display: 'none' }}>
          <Input style={{ display: 'none' }} />
        </FormItem>


        <FormItem originalValue={diff.mailingAddress.address}
          name={['mailingAddress', 'address']}
          lockedByMasterSource={isLockedByMaster('mailingAddress')}
          label={<FormattedMessage id="address" defaultMessage="Address" />}
          helpText={
            <FormattedMessage
              id="help.institution.mailingAddress.address"
            />}
        >
          <Input disabled={isLockedByMaster('mailingAddress')} />
        </FormItem>

        <FormItem name={['mailingAddress', 'city']} originalValue={diff.mailingAddress.city}
          lockedByMasterSource={isLockedByMaster('mailingAddress')}
          label={<FormattedMessage id="city" defaultMessage="City" />}
          helpText={
            <FormattedMessage
              id="help.institution.mailingAddress.city"
            />}
        >
          <Input disabled={isLockedByMaster('mailingAddress')} />
        </FormItem>

        <FormItem name={['mailingAddress', 'province']} originalValue={diff.mailingAddress.province}
          label={<FormattedMessage id="province" defaultMessage="Province" />}
          lockedByMasterSource={isLockedByMaster('mailingAddress')}
          helpText={
            <FormattedMessage
              id="help.institution.mailingAddress.province"
            />}
        >
          <Input disabled={isLockedByMaster('mailingAddress')} />
        </FormItem>

        <FormItem name={['mailingAddress', 'country']} na originalValue={diff.mailingAddress.country}
          label={<FormattedMessage id="country" defaultMessage="Country" />}
          lockedByMasterSource={isLockedByMaster('mailingAddress')}
          helpText={
            <FormattedMessage
              id="help.institution.mailingAddress.country"
            />}
        >
          <Select
            placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country" />}
            disabled={isLockedByMaster('mailingAddress')}>
            {countries.map(country => (
              <Select.Option value={country} key={country}>
                <FormattedMessage id={`country.${country}`} />
              </Select.Option>
            ))}
          </Select>
        </FormItem>

        <FormItem name={['mailingAddress', 'postalCode']} originalValue={diff.mailingAddress.postalCode}
          label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}
          lockedByMasterSource={isLockedByMaster('mailingAddress')}
          helpText={
            <FormattedMessage
              id="help.institution.mailingAddress.postalCode"
            />}
        >
          <Input disabled={isLockedByMaster('mailingAddress')} />
        </FormItem>

        <FormGroupHeader
          title={<FormattedMessage id="physicalAddress" defaultMessage="Physical address" />}
          helpText={<FormattedMessage id="help.physicalAddress" defaultMessage="An address of a building" />}
        />
        <FormItem name={['address', 'key']} initialValue={address.key} style={{ display: 'none' }}>
          <Input style={{ display: 'none' }} />
        </FormItem>



        <FormItem name={['address', 'address']} originalValue={diff.address.address}
          label={<FormattedMessage id="address" defaultMessage="Address" />}
          lockedByMasterSource={isLockedByMaster('address')}
          helpText={
            <FormattedMessage
              id="help.institution.address.address"
            />}
        >
          <Input disabled={isLockedByMaster('address')} />
        </FormItem>

        <FormItem name={['address', 'city']} originalValue={diff.address.city}
          label={<FormattedMessage id="city" defaultMessage="City" />}
          lockedByMasterSource={isLockedByMaster('address')}
          helpText={
            <FormattedMessage
              id="help.institution.address.city"
            />}
        >
          <Input disabled={isLockedByMaster('address')} />
        </FormItem>

        <FormItem name={['address', 'province']} originalValue={diff.address.province}
          label={<FormattedMessage id="province" defaultMessage="Province" />}
          lockedByMasterSource={isLockedByMaster('address')}
          helpText={
            <FormattedMessage
              id="help.institution.address.province"
            />}
        >
          <Input disabled={isLockedByMaster('address')} />
        </FormItem>

        <FormItem name={['address', 'country']} originalValue={diff.address.country}
          label={<FormattedMessage id="country" defaultMessage="Country" />}
          lockedByMasterSource={isLockedByMaster('address')}
          helpText={
            <FormattedMessage
              id="help.institution.address.country"
            />}
        >
          <Select
            data-id="address.country"
            placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country" />}
            disabled={isLockedByMaster('address')}>
            {countries.map(country => (
              <Select.Option value={country} key={country}>
                <FormattedMessage id={`country.${country}`} />
              </Select.Option>
            ))}
          </Select>
        </FormItem>

        <FormItem originalValue={diff.address.postalCode}
          name={['address', 'postalCode']}
          label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}
          lockedByMasterSource={isLockedByMaster('address')}
          helpText={
            <FormattedMessage
              id="help.institution.address.postalCode"
            />}
        >
          <Input disabled={isLockedByMaster('address')} />
        </FormItem>




        {reviewChange && contactChanges && <div>
          <FormGroupHeader
            title={<FormattedMessage id="otherChanges" defaultMessage="Other changes" />}
          />
          <FormItem name='contactPersons' initialValue={[]} originalValue={diff.contactPersons}
            label={<FormattedMessage id="contacts" defaultMessage="Contacts" />}
            helpText={
              <FormattedMessage
                id="help.institution.contactPersons.suggestedChanges"
              />}
          >
            <JsonFormField />
          </FormItem>
        </div>}


        {isSuggestion && <div className={classes.suggestMeta}>
          <FormGroupHeader
            title={<FormattedMessage id="suggestion.aboutSuggester" defaultMessage="About you" />}
          />
          <FormItem
            name='_comment'
            rules={[{
              required: !reviewChange, message: <FormattedMessage id="provide.comment" defaultMessage="Please provide a comment" />
            }]}
            label={<FormattedMessage id="commentAndAffiliation" defaultMessage="Comment" />}>
            <Input disabled={reviewChange} />
          </FormItem>
          <FormItem name='_proposerEmail' initialValue={user?.email} rules={[{
            required: !reviewChange, message: <FormattedMessage id="provide.email" defaultMessage="Please provide an email" />
          }]}
            label={<FormattedMessage id="email" defaultMessage="Email" />}>
            <Input disabled={reviewChange} />
          </FormItem>
        </div>}
        {!isSuggestion && reviewChange && <div className={classes.suggestMeta}>
          <FormGroupHeader
            title={<FormattedMessage id="suggestion.reviewerComment" defaultMessage="Reviewers comment" />}
          />
          <FormItem name='_comment' rules={[{
            required: reviewChange, message: <FormattedMessage id="suggestion.provideComment" defaultMessage="Please provide a comment" />
          }]} label={<FormattedMessage id="_comment" defaultMessage="Comment" />}>
            <Input />
          </FormItem>
        </div>}
        {!reviewChange &&
          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
              <Button type="primary" htmlType="submit" id={institution ? 'update' : 'createNew'} disabled={institution && !isTouched && !reviewChange}>
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
              <Button htmlType="button" onClick={props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
              <Button htmlType="button" onClick={props.onDiscard}>
                <FormattedMessage id="discard" defaultMessage="Discard" />
              </Button>
              <Button type="primary" htmlType="submit" id="applySuggestion" disabled={institution && !isTouched && !reviewChange}>
                <FormattedMessage id="suggestion.apply" defaultMessage="Apply suggestion" />
              </Button>
            </Col>
          </Row>
        }
      </Form>
    </React.Fragment>
  );
}

InstitutionForm.propTypes = {
  institution: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onDiscard: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ countries, addError, addSuccess }) => ({ countries, addError, addSuccess });

export default withContext(mapContextToProps)(withRouter(injectSheet(styles)(InstitutionForm)));

function isObj(o) {
  return typeof o === 'object' && o !== null;
}

function getAddressString(institution) {
  const address = institution?.address?.address ? institution.address : institution.mailingAddress;
  const type = institution?.address?.address ? 'Physical address: ' : 'Mailing address: ';
  const city = address.city;
  const country = address.country;
  const street = address.address;
  const postalCode = address.postalCode;
  const province = address.province;

  const parts = [];
  if (street) parts.push(street);
  if (city) parts.push(city);
  if (postalCode) parts.push(postalCode);
  if (province) parts.push(province);
  if (country) parts.push(country);

  let addressString = parts.join(', ');
  if (addressString.length === 0) return null;
  addressString = type + addressString;
  return addressString;
}