import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Checkbox, Col, Input, Row, Select, Alert, Form } from 'antd';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import injectSheet from 'react-jss';
import SimilarTag from '../../common/SimilarTag';
import _get from 'lodash/get';

// APIs
import { collectionSearch, createCollection, updateAndApplySuggestion, discardSuggestion, suggestNewCollection, suggestUpdateCollection, updateCollection } from '../../../api/collection';
import { getSuggestedInstitutions } from '../../../api/institution';
import { getPreservationType, getAccessionStatus, getCollectionContentType } from '../../../api/enumeration';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FilteredSelectControl, FormItem, FormGroupHeader, TagControl, AlternativeCodes, JsonFormField } from '../../common';
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
const CollectionForm = props => {
  
    const {classes, mode, suggestion, masterSourceFields, collection, countries, reviewChange, hasCreate, hasUpdate, onSubmit, onCancel, onDiscard, original, addSuccess, addError, history} = props;
    const [form] = Form.useForm();
    const [isTouched, setIsTouched] = useState(false)
    const [fetching, setFetching] = useState(false);
    const [institutions, setInstitutions] = useState([]);
    const [accessionStatuses, setAccessionStatuses] = useState([]);
    const [preservationTypes, setPreservationTypes] = useState([]);
    const [contentTypes, setContentTypes] = useState([]);
    const [diff, setDiff] = useState({ mailingAddress: {}, address: {} })
    const [initialValues, setInitialValues] = useState(null)
   
    useEffect(() => {
      const init = async () =>{
        const [accessionStatusesRes, preservationTypesRes, contentTypesRes] = await Promise.all([
          getAccessionStatus(),
          getPreservationType(),
          getCollectionContentType()
        ]);
        setAccessionStatuses(accessionStatusesRes);
        setPreservationTypes(preservationTypesRes);
        setContentTypes(contentTypesRes);
        if(collection?.institutionKey){
          handleSearch(collection.institutionKey)
        }
        updateDiff();
      }
      init();
    }, [])
 
    useEffect(() => {
      updateDiff();

      if(collection && !initialValues){
        const initialValues_ = createInitialValues();
        form.setFieldsValue(initialValues_)
        setInitialValues(initialValues_)
      }

    }, [collection, original])
    
  const createInitialValues = () => {
    return {mailingAddress: {}, address: {}, ...collection}
  }


  const updateDiff = () => {
    let diff_ = {};
    if (collection && original && JSON.stringify(original) !== JSON.stringify(collection)) {
      diff_ = getDiff(original, collection);
    }
    setDiff(diff_)
  }

  const getDiff = (o = {}, s = {}) => {
    let diff_ = {};
    Object.keys(s)
      .filter(x => x !== 'key' && JSON.stringify(o[x]) !== JSON.stringify(s[x]))
      .forEach(x => diff_[x] = typeof o[x] === 'undefined' ? null : o[x]);

    if (s.mailingAddress && isObj(s.mailingAddress)) {
      diff_.mailingAddress = getDiff(o.mailingAddress, s.mailingAddress);
    }
    if (s.address && isObj(s.address)) {
      diff_.address = getDiff(o.address, s.address);
    }
    return diff_;
  }

  const handleSubmit = (values) => {

        const { _proposerEmail: proposerEmail, _comment: comment, ...bodyStub } = values;
        const body = { ...collection, ...bodyStub };
        if (mode === 'create') {
          if (!hasCreate) {
            suggestNewCollection({ body, proposerEmail, comments: [comment] })
              .then(response => {
                addSuccess({ statusText: <FormattedMessage id="suggestion.suggestionLogged" defaultMessage="Thank you. Your suggestion has been logged" /> });
                history.push('/collection/search');
              })
              .catch(error => {
                addError({ status: error.response.status, statusText: error.response.data });
              });
          } else {
            if (reviewChange) {
              //apply suggested creation
              updateAndApplySuggestion(suggestion.key, { ...suggestion, suggestedEntity: body, comments: [...suggestion.comments, comment] })
                .then(response => {
                  addSuccess({ statusText: <FormattedMessage id="suggestion.appliedSuccess" defaultMessage="Suggestion was applied" /> });
                  history.push('/collection/search');
                })
                .catch(error => {
                  addError({ status: error.response.status, statusText: error.response.data });
                });
            } else {
              createCollection(values)
                .then(response => onSubmit(response.data))
                .catch(error => {
                  addError({ status: error.response.status, statusText: error.response.data });
                });
            }
          }
        } else {
          if (!hasUpdate) {
            suggestUpdateCollection({ body, proposerEmail, comments: [comment] })
              .then(response => {
                addSuccess({ statusText: <FormattedMessage id="suggestion.suggestionLogged" defaultMessage="Thank you. Your suggestion has been logged" /> });
                onSubmit();
              })
              .catch(error => {
                console.error(error);
                if (error.response) {
                  addError({ status: error.response.status, statusText: error.response.data });
                } else {
                  addError({ statusText: error.toString() });
                }
              });
          } else {
            if (reviewChange) {
              //apply suggested creation
              updateAndApplySuggestion(suggestion.key, { ...suggestion, suggestedEntity: body, comments: [...suggestion.comments, comment] })
                .then(response => {
                  addSuccess({ statusText: <FormattedMessage id="suggestion.appliedSuccess" defaultMessage="Suggestion was applied" /> });
                  onSubmit();
                })
                .catch(error => {
                  addError({ status: error.response.status, statusText: error.response.data });
                });
            } else {
              // regular update
              updateCollection(body)
                .then(() => onSubmit())
                .catch(error => {
                  addError({ status: error.response.status, statusText: error.response.data });
                });
            }
          }
        }    
  };

  const discard = () => {
    discardSuggestion(suggestion?.key)
      .then(() => onSubmit())
      .catch(error => {
        addError({ status: error.response.status, statusText: error.response.data });
      });
  }

  const handleSearch = value => {
    if (!value) {
      setInstitutions([])
      return;
    }
    setFetching(true)

    getSuggestedInstitutions({ q: value }).then(response => {
      setInstitutions(response?.data || [])
      setFetching(false)
    });
  };

  const isLockedByMaster = (name) => {
    if (!collection) return false;
    const masterConfig = _get(masterSourceFields, `${name}.sourceMap.${collection.masterSource}`);
    if (masterConfig && !masterConfig.overridable) {
      return true;
    }
    return false;
  }

    // const isNew = collection === null;
    const mailingAddress = initialValues && initialValues.mailingAddress ? initialValues.mailingAddress : {};
    const address = initialValues && initialValues.address ? initialValues.address : {};   

    const isSuggestion = mode === 'create' ? !hasCreate : !hasUpdate;
    const hasChanges = (suggestion && suggestion.changes.length > 0) || mode === 'create';
    const isCreate = mode === 'create';

    const country = address.country || mailingAddress.country;
    const city = address.city || mailingAddress.city;

    const similarThreshold = isCreate ? 0 : 1;

    let contactChanges;
    if (suggestion && suggestion.changes.length > 0) {
      contactChanges = suggestion.changes.find(c => c.field === 'contactPersons');
    }

   // let initialValues = collection ? {mailingAddress: {}, address: {}, ...collection} : null
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
          style={{marginBottom: '10px'}}
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
          style={{marginBottom: '10px'}}
        />}
        {!hasUpdate && !isCreate && !reviewChange && <Alert
          message={<FormattedMessage id="suggestion.noEditAccess" defaultMessage="You do not have edit access, but you can suggest a change if you provide your email." />}
          type="warning"
        />}
        {!hasCreate && isCreate && !reviewChange && <Alert
          message={<FormattedMessage id="suggestion.noEditAccess" defaultMessage="You do not have edit access, but you can suggest a change if you provide your email." />}
          type="warning"
          style={{marginBottom: '10px'}}
        />}
        {collection && <div  style={{marginBottom: '10px'}}>
          {collection.code && country && <SimilarTag fn={collectionSearch}
            query={{ code: collection.code, country }}
            color="red"
            to={`/collection/search`}
            threshold={similarThreshold}
          >Same code + same country</SimilarTag>}
          {collection.code && <SimilarTag fn={collectionSearch}
            query={{ code: collection.code }}
            color="orange"
            to={`/collection/search`}
            threshold={similarThreshold}
          >Same code</SimilarTag>}
          {collection.name && <SimilarTag fn={collectionSearch}
            query={{ name: collection.name }}
            color="orange"
            to={`/collection/search`}
            threshold={similarThreshold}
          >Same name</SimilarTag>}
          {city && <SimilarTag fn={collectionSearch}
            query={{ fuzzyName: collection.name, city }}
            color="orange"
            to={`/collection/search`}
            threshold={similarThreshold}
          >Similar name + same city</SimilarTag>}
        </div>}

        <Form onFinish={handleSubmit} form={form} initialValues={initialValues || {mailingAddress: {}, address: {}}} onValuesChange={() =>{
          setIsTouched(true)
        }}>
          {(!suggestion || hasChanges) && <>
            <FormItem originalValue={diff.name}
              name='name'
              rules={[{
                required: true, message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name" />
              }]}
              lockedByMasterSource={isLockedByMaster('name')}
              label={<FormattedMessage id="name"
                defaultMessage="Name" />}
              helpText={
                <FormattedMessage
                  id="help.collection.name"
                />
              }
            >
              <Input disabled={isLockedByMaster('name')} />
            </FormItem>

            <FormItem originalValue={diff.description}
              name='description'
              lockedByMasterSource={isLockedByMaster('description')}
              label={<FormattedMessage id="description" defaultMessage="Description" />}
              helpText={
                <FormattedMessage
                  id="help.collection.description"
                />}
            >
              <Input.TextArea rows={4} disabled={isLockedByMaster('description')}/>
            </FormItem>

            <FormItem originalValue={diff.contentTypes}
              name='contentTypes'
              lockedByMasterSource={isLockedByMaster('contentTypes')}
              label={<FormattedMessage id="contentTypes" defaultMessage="Content types" />}
              helpText={
                <FormattedMessage
                  id="help.collection.contentTypes"
                />}
            >
              <Select
                disabled={isLockedByMaster('contentTypes')}
                  mode="multiple"
                  placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type" />}
                >
                  {contentTypes.map(type => (
                    <Select.Option value={type} key={type}>
                      <FormattedMessage id={`collectionContentType.${type}`} />
                    </Select.Option>
                  ))}
                </Select>
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
                  id="help.collection.code"
                />}
            >
              <Input disabled={isLockedByMaster('code')}/>
            </FormItem>

            <FormItem name='alternativeCodes' initialValue={[]} originalValue={diff.alternativeCodes}
              lockedByMasterSource={isLockedByMaster('alternativeCodes')}
              label={<FormattedMessage id="alternativeCodes" defaultMessage="Alternative codes" />}
              helpText={
                <FormattedMessage
                  id="help.collection.alternativeCodes"
                />}
            >
              <AlternativeCodes disabled={isLockedByMaster('alternativeCodes')}/>
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
                  id="help.collection.homepage"
                />}
            >
              <Input disabled={isLockedByMaster('homepage')}/>
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
                  id="help.collection.catalogUrl"
                />}
            >
              <Input disabled={isLockedByMaster('catalogUrl')}/>
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
                  id="help.collection.apiUrl"
                />}
            >
              <Input disabled={isLockedByMaster('apiUrl')}/>
            </FormItem>

            <FormItem originalValue={diff.institutionKey}
              name='institutionKey'
              rules={[{
                required: isSuggestion, message: <FormattedMessage id="provide.institution" defaultMessage="Please provide an institution" />
              }]}
              lockedByMasterSource={isLockedByMaster('institution')}
              label={<FormattedMessage id="institution" defaultMessage="Institution" />}
              helpText={
                <FormattedMessage
                  id="help.collection.institutionName"
                />}
            >
              <FilteredSelectControl
                  disabled={isLockedByMaster('institution')}
                  placeholder={<FormattedMessage
                    id="select.institution"
                    defaultMessage="Select an institution"
                  />}
                  search={handleSearch}
                  fetching={fetching}
                  items={institutions}
                  titleField="name"
                  delay={1000}
                />
            </FormItem>

            <FormItem originalValue={diff.phone}
              name='phone'
              initialValue={[]}
              rules={[{
                validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid" />)
              }]}
              lockedByMasterSource={isLockedByMaster('phone')}
              label={<FormattedMessage id="phone" defaultMessage="Phone" />}
              helpText={
                <FormattedMessage
                  id="help.collection.phone"
                />}
            >
              <TagControl disabled={isLockedByMaster('phone')} label={<FormattedMessage id="newPhone" defaultMessage="New phone" />} removeAll={true} />
            </FormItem>

            <FormItem originalValue={diff.email}
              name="email"
              initialValue={[]}
              rules={[{
                validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid" />)
              }]}
              lockedByMasterSource={isLockedByMaster('email')}
              label={<FormattedMessage id="email" defaultMessage="Email" />}
              helpText={
                <FormattedMessage
                  id="help.collection.email"
                />}
            >
              <TagControl disabled={isLockedByMaster('email')} label={<FormattedMessage id="newEmail" defaultMessage="New email" />} removeAll={true} />

            </FormItem>

            <FormItem originalValue={diff.preservationTypes}
              name='preservationTypes'
              lockedByMasterSource={isLockedByMaster('preservationTypes')}
              label={<FormattedMessage id="preservationTypes" defaultMessage="Preservation types" />}
              helpText={
                <FormattedMessage
                  id="help.collection.preservationTypes"
                />}
            >
              <Select
                  disabled={isLockedByMaster('preservationTypes')}
                  mode="multiple"
                  placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type" />}
                >
                  {preservationTypes.map(type => (
                    <Select.Option value={type} key={type}>
                      <FormattedMessage id={`preservationType.${type}`} />
                    </Select.Option>
                  ))}
                </Select>
            </FormItem>

            <FormItem originalValue={diff.taxonomicCoverage}
              name='taxonomicCoverage'
              lockedByMasterSource={isLockedByMaster('taxonomicCoverage')}
              label={<FormattedMessage id="taxonomicCoverage" defaultMessage="Taxonomic coverage" />}
              helpText={
                <FormattedMessage
                  id="help.collection.taxonomicCoverage"
                />}
            >
              <Input disabled={isLockedByMaster('taxonomicCoverage')}/>
            </FormItem>

            <FormItem originalValue={diff.geography}
              name='geography'
              lockedByMasterSource={isLockedByMaster('geography')}
              label={<FormattedMessage id="geography" defaultMessage="Geography" />}
              helpText={
                <FormattedMessage
                  id="help.collection.geography"
                />}
            >
              <Input disabled={isLockedByMaster('geography')}/>
            </FormItem>

            <FormItem originalValue={diff.notes}
              name='notes'
              lockedByMasterSource={isLockedByMaster('notes')}
              label={<FormattedMessage id="notes" defaultMessage="Notes" />}
              helpText={
                <FormattedMessage
                  id="help.collection.notes"
                />}
            >
              <Input disabled={isLockedByMaster('notes')}/>
            </FormItem>

            <FormItem originalValue={diff.incorporatedCollections}
              name='incorporatedCollections'
              initialValue={[]}
              lockedByMasterSource={isLockedByMaster('incorporatedCollections')}
              label={<FormattedMessage id="incorporatedCollections" defaultMessage="Incorporated collections" />}
              helpText={
                <FormattedMessage
                  id="help.collection.incorporatedCollections"
                />}
            >
                <TagControl disabled={isLockedByMaster('incorporatedCollections')} label={<FormattedMessage id="newCollection" defaultMessage="New collection" />} removeAll={true} />
            </FormItem>

            <FormItem originalValue={diff.importantCollectors}
              name='importantCollectors'
              initialValue={[]}
              lockedByMasterSource={isLockedByMaster('importantCollectors')}
              label={<FormattedMessage id="importantCollectors" defaultMessage="Important collectors" />}
              helpText={
                <FormattedMessage
                  id="help.collection.importantCollectors"
                />}
            >
                <TagControl disabled={isLockedByMaster('importantCollectors')} label={<FormattedMessage id="newCollector" defaultMessage="New collector" />} removeAll={true} />
            </FormItem>

            <FormItem originalValue={diff.accessionStatus}
              name='accessionStatus'
              lockedByMasterSource={isLockedByMaster('accessionStatus')}
              label={<FormattedMessage id="accessionStatus" defaultMessage="Accession status" />}
              helpText={
                <FormattedMessage
                  id="help.collection.accessionStatus"
                />}
            >
              <Select disabled={isLockedByMaster('accessionStatus')}
                        placeholder={<FormattedMessage id="select.status" defaultMessage="Select a status" />}>
                  {accessionStatuses.map(status => (
                    <Select.Option value={status} key={status}>
                      <FormattedMessage id={`accessionStatus.${status}`} />
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
                  id="help.collection.active"
                />}
            >
              <Checkbox disabled={isLockedByMaster('active')}/>
            </FormItem>

            <FormItem originalValue={diff.personalCollection}
              name='personalCollection'
              valuePropName='checked'
              lockedByMasterSource={isLockedByMaster('personalCollection')}
              label={<FormattedMessage id="personalCollection" defaultMessage="Personal collection" />}
              helpText={
                <FormattedMessage
                  id="help.collection.personalCollection"
                />}
            >
              <Checkbox disabled={isLockedByMaster('personalCollection')}/>
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

            <FormItem name={['mailingAddress', 'key']} style={{ display: 'none' }}>
              <Input style={{ display: 'none' }} />
            </FormItem>
           

            <FormItem originalValue={diff?.mailingAddress?.address}
              name={['mailingAddress', 'address']}
              lockedByMasterSource={isLockedByMaster('mailingAddress')}
              label={<FormattedMessage id="address" defaultMessage="Address" />}
              helpText={
                <FormattedMessage
                  id="help.collection.mailingAddress.address"
                />}
            >
              <Input disabled={isLockedByMaster('mailingAddress')} />
            </FormItem>

            <FormItem originalValue={diff?.mailingAddress?.city}
              name={['mailingAddress', 'city']}
              lockedByMasterSource={isLockedByMaster('mailingAddress')}
              label={<FormattedMessage id="city" defaultMessage="City" />}
              helpText={
                <FormattedMessage
                  id="help.collection.mailingAddress.city"
                />}
            >
              <Input disabled={isLockedByMaster('mailingAddress')} />
            </FormItem>

            <FormItem originalValue={diff?.mailingAddress?.province}
              name={['mailingAddress', 'province']}
              lockedByMasterSource={isLockedByMaster('mailingAddress')}
              label={<FormattedMessage id="province" defaultMessage="Province" />}
              helpText={
                <FormattedMessage
                  id="help.collection.mailingAddress.province"
                />}
            >
              <Input disabled={isLockedByMaster('mailingAddress')} />
            </FormItem>

            <FormItem originalValue={diff?.mailingAddress?.country}
              name={['mailingAddress', 'country']}
              lockedByMasterSource={isLockedByMaster('mailingAddress')}
              label={<FormattedMessage id="country" defaultMessage="Country" />}
              helpText={
                <FormattedMessage
                  id="help.collection.mailingAddress.country"
                />}
            >
              <Select disabled={isLockedByMaster('mailingAddress')} 
                        placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country" />}>
                  {countries.map(country => (
                    <Select.Option value={country} key={country}>
                      <FormattedMessage id={`country.${country}`} />
                    </Select.Option>
                  ))}
                </Select>
            </FormItem>

            <FormItem originalValue={diff?.mailingAddress?.postalCode}
              name={['mailingAddress', 'postalCode']}
              lockedByMasterSource={isLockedByMaster('mailingAddress')}
              label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}
              helpText={
                <FormattedMessage
                  id="help.collection.mailingAddress.postalCode"
                />}
            >
              <Input disabled={isLockedByMaster('mailingAddress')} />
            </FormItem>

            <FormGroupHeader
              title={<FormattedMessage id="physicalAddress" defaultMessage="Physical address" />}
              helpText={<FormattedMessage id="help.physicalAddress" defaultMessage="An address of a building" />}
            />

            
            <FormItem name={['address','key']} style={{ display: 'none' }}>
              <Input style={{ display: 'none' }} />
            </FormItem>

            <FormItem originalValue={diff?.address?.address}
              name={['address', 'address']}
              lockedByMasterSource={isLockedByMaster('address')}
              label={<FormattedMessage id="address" defaultMessage="Address" />}
              helpText={
                <FormattedMessage
                  id="help.collection.address.address"
                />}
            >
              <Input disabled={isLockedByMaster('address')} />
            </FormItem>

            <FormItem originalValue={diff?.address?.city}
              name={['address', 'city']}
              lockedByMasterSource={isLockedByMaster('address')}
              label={<FormattedMessage id="city" defaultMessage="City" />}
              helpText={
                <FormattedMessage
                  id="help.collection.address.city"
                />}
            >
              <Input disabled={isLockedByMaster('address')} />
            </FormItem>

            <FormItem originalValue={diff?.address?.province}
              name={['address', 'province']}
              lockedByMasterSource={isLockedByMaster('address')}
              label={<FormattedMessage id="province" defaultMessage="Province" />}
              helpText={
                <FormattedMessage
                  id="help.collection.address.province"
                />}
            >
              <Input disabled={isLockedByMaster('address')} />
            </FormItem>

            <FormItem originalValue={diff?.address?.country}
              name={['address', 'country',]}
              lockedByMasterSource={isLockedByMaster('address')}
              label={<FormattedMessage id="country" defaultMessage="Country" />}
              helpText={
                <FormattedMessage
                  id="help.collection.address.country"
                />}
            >
              <Select disabled={isLockedByMaster('address')} 
                        placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country" />}>
                  {countries.map(country => (
                    <Select.Option value={country} key={country}>
                      <FormattedMessage id={`country.${country}`} />
                    </Select.Option>
                  ))}
                </Select>
            </FormItem>

            <FormItem originalValue={diff?.address?.postalCode}
              name={['address', 'postalCode']}
              lockedByMasterSource={isLockedByMaster('address')}
              label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}
              helpText={
                <FormattedMessage
                  id="help.collection.address.postalCode"
                />}
            >
              <Input disabled={isLockedByMaster('address')} />
            </FormItem>




            {reviewChange && hasChanges && contactChanges && <div>
              <FormGroupHeader
                title={<FormattedMessage id="otherChanges" defaultMessage="Other changes" />}
              />
              <FormItem originalValue={diff.contactPersons}
                name='contactPersons'
                initialValue={[]}
                label={<FormattedMessage id="contacts" defaultMessage="Contacts" />}
                helpText={
                  <FormattedMessage
                    id="help.collection.contactPersons.suggestedChanges"
                  />}
              >
                <JsonFormField />
              </FormItem>
            </div>}




            {isSuggestion && <div className={classes.suggestMeta}>
              <FormGroupHeader
                title={<FormattedMessage id="suggestion.aboutSuggester" defaultMessage="About you" />}
              />
              <FormItem name='_comment' rules={[{
                    required: !reviewChange, message: <FormattedMessage id="provide.comment" defaultMessage="Please provide a comment" />
                  }]} label={<FormattedMessage id="commentAndAffiliation" defaultMessage="Comment" />}>
                  <Input disabled={reviewChange} />
              </FormItem>
              <FormItem name='_proposerEmail' rules={[{
                    required: !reviewChange, message: <FormattedMessage id="provide.email" defaultMessage="Please provide an email" />
                  }]} label={<FormattedMessage id="email" defaultMessage="Email" />}>
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
          </>}
          {!reviewChange &&
            <Row>
              <Col className="btn-container text-right">
                <Button htmlType="button" onClick={onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                <Button type="primary" htmlType="submit" disabled={collection && !isTouched && !reviewChange}>
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
                <Button htmlType="button" onClick={onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                <Button htmlType="button" onClick={onDiscard}>
                  <FormattedMessage id="discard" defaultMessage="Discard" />
                </Button>
                <Button type="primary" htmlType="submit" disabled={collection && !isTouched && !reviewChange}>
                  <FormattedMessage id="suggestion.apply" defaultMessage="Apply suggestion" />
                </Button>
              </Col>
            </Row>
          }
        </Form>
      </React.Fragment>
    );
}

CollectionForm.propTypes = {
  collection: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onDiscard: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ user, countries, addError, addSuccess }) => ({ user, countries, addError, addSuccess });

export default withContext(mapContextToProps)(withRouter(injectSheet(styles)(CollectionForm)));

function isObj(o) {
  return typeof o === 'object' && o !== null;
}
