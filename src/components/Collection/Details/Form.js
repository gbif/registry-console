import React, { useState, useEffect, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Checkbox, Col, Input, Row, Select, Alert, InputNumber, Form, Radio } from 'antd';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import injectSheet from 'react-jss';
import SimilarTag from '../../common/SimilarTag';
import _get from 'lodash/get';

// APIs
import { collectionSearch, createCollection, updateAndApplySuggestion, suggestNewCollection, suggestUpdateCollection, updateCollection } from '../../../api/collection';
import { getSuggestedInstitutions } from '../../../api/institution';
import { getPreservationType, getAccessionStatus, getCollectionContentType } from '../../../api/enumeration';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FilteredSelectControl, FormItem, FormGroupHeader, TagControl, AlternativeCodes, JsonFormField } from '../../common';
// Helpers
import { validateUrl, validateEmail, validatePhone } from '../../util/validators';
import { prettifyLicense } from '../../util/helpers';
import ConceptValue from '../../common/ConceptValue';
const Option = Select.Option;

const styles = {
  suggestMeta: {
    background: '#f7f7f7',
    border: '1px solid #ddd',
    padding: '12px',
    marginTop: '12px',
  }
}
const CollectionForm = props => {

  const { classes, mode, suggestion, masterSourceFields, collection, countries, licenseEnums, reviewChange, hasCreate, hasUpdate, onSubmit, onCancel, onDiscard, original, addSuccess, addError, history } = props;
  const [form] = Form.useForm();
  const [isTouched, setIsTouched] = useState(false)
  const [fetching, setFetching] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [accessionStatuses, setAccessionStatuses] = useState([]);
  const [preservationTypes, setPreservationTypes] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [diff, setDiff] = useState({ mailingAddress: {}, address: {} })
  const [initialValues, setInitialValues] = useState(null)

  const updateDiff = useCallback(() => {
    let diff_ = {};
    if (collection && original && JSON.stringify(original) !== JSON.stringify(collection)) {
      diff_ = getDiff(original, collection);
    }
    setDiff(diff_)
  }, [collection, original])

  useEffect(() => {
    const init = async () => {
      const [accessionStatusesRes, preservationTypesRes, contentTypesRes] = await Promise.all([
        getAccessionStatus({ latestRelease: true }),
        getPreservationType({ latestRelease: true }),
        getCollectionContentType({ latestRelease: true })
      ]);
      setAccessionStatuses(accessionStatusesRes);
      setPreservationTypes(preservationTypesRes);
      setContentTypes(contentTypesRes);
      if (collection?.institutionKey) {
        handleSearch(collection.institutionKey)
      }
      updateDiff();
    }
    init();
  }, [collection?.institutionKey, updateDiff]);

  useEffect(() => {
    updateDiff();

    const createInitialValues = () => {
      return { mailingAddress: {}, address: {}, ...collection }
    }

    if (collection && !initialValues) {
      const initialValues_ = createInitialValues();
      form.setFieldsValue(initialValues_)
      setInitialValues(initialValues_)
    }

  }, [collection, original, form, initialValues, updateDiff])


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

  // const discard = () => {
  //   discardSuggestion(suggestion?.key)
  //     .then(() => onSubmit())
  //     .catch(error => {
  //       addError({ status: error.response.status, statusText: error.response.data });
  //     });
  // }

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

  const isLockedByIH = (suggestion, name) => {
    const masterConfig = _get(masterSourceFields, `${name}.sourceMap.${'IH'}`);
    console.log('suggestion', masterConfig)
    if (masterConfig && !masterConfig.overridable && suggestion?.proposedBy === 'ih-sync') {
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

  let identifierChanges;
  if (suggestion && suggestion.changes.length > 0) {
    identifierChanges = suggestion.changes.find(c => c.field === 'identifiers');
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
        style={{ marginBottom: '10px' }}
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
      {collection && <div style={{ marginBottom: '10px' }}>
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

      <Form onFinish={handleSubmit} form={form} initialValues={initialValues || { mailingAddress: {}, address: {} }} onValuesChange={() => {
        setIsTouched(true)
      }}>
        debugger;
        {(!suggestion || hasChanges) && <>
          <FormItem originalValue={diff.name}
            name='name'
            rules={[{
              required: true, message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name" />
            }]}
            lockedByMasterSource={isLockedByMaster('name') || isLockedByIH(suggestion, 'name')}
            label={<FormattedMessage id="name"
              defaultMessage="Name" />}
            helpText={
              <FormattedMessage
                id="help.collection.name"
              />
            }
          >
            <Input disabled={isLockedByMaster('name') || isLockedByIH(suggestion, 'name')} />
          </FormItem>

          <FormItem originalValue={diff.description}
            name='description'
            lockedByMasterSource={isLockedByMaster('description') || isLockedByIH(suggestion, 'description')}
            label={<FormattedMessage id="description" defaultMessage="Description" />}
            helpText={
              <FormattedMessage
                id="help.collection.description"
              />}
          >
            <Input.TextArea rows={4} disabled={isLockedByMaster('description') || isLockedByIH(suggestion, 'description')} />
          </FormItem>

          <FormItem originalValue={diff.numberSpecimens}
            name='numberSpecimens'
            lockedByMasterSource={isLockedByMaster('numberSpecimens') || isLockedByIH(suggestion, 'numberSpecimens')}
            label={<FormattedMessage id="numberSpecimens" defaultMessage="Number specimens" />}
            helpText={
              <FormattedMessage
                id="help.collection.numberSpecimens"
              />}
          >
            <InputNumber min={0} max={100000000}
              disabled={isLockedByMaster('numberSpecimens') || isLockedByIH(suggestion, 'numberSpecimens')} />
          </FormItem>

          <FormItem originalValue={diff.contentTypes}
            name='contentTypes'
            lockedByMasterSource={isLockedByMaster('contentTypes') || isLockedByIH(suggestion, 'contentTypes')}
            label={<FormattedMessage id="contentTypes" defaultMessage="Content types" />}
            helpText={
              <FormattedMessage
                id="help.collection.contentTypes"
              />}
          >
            <Select
              disabled={isLockedByMaster('contentTypes') || isLockedByIH(suggestion, 'contentTypes')}
              mode="multiple"
              placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type" />}
            >
              {contentTypes.map(type => (
                <Select.Option value={type} key={type}>
                  <ConceptValue vocabulary="CollectionContentType" name={type} includeContext />
                </Select.Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            originalValue={diff.code}
            name='code'
            rules={[{
              required: true, message: <FormattedMessage id="provide.code" defaultMessage="Please provide a code" />
            }]}
            lockedByMasterSource={isLockedByMaster('code') || isLockedByIH(suggestion, 'code')}
            label={<FormattedMessage id="code" defaultMessage="Code" />}
            helpText={<FormattedMessage id="help.collection.code" />}
          >
            <Input disabled={isLockedByMaster('code') || isLockedByIH(suggestion, 'code')} />
          </FormItem>

          <FormItem
            name='alternativeCodes'
            initialValue={[]}
            originalValue={diff.alternativeCodes}
            lockedByMasterSource={isLockedByMaster('alternativeCodes') || isLockedByIH(suggestion, 'alternativeCodes')}
            label={<FormattedMessage id="alternativeCodes" defaultMessage="Alternative codes" />}
            helpText={<FormattedMessage id="help.collection.alternativeCodes" />}
          >
            <AlternativeCodes disabled={isLockedByMaster('alternativeCodes') || isLockedByIH(suggestion, 'alternativeCodes')} />
          </FormItem>

          <FormItem
            originalValue={diff.homepage}
            name='homepage'
            rules={[{
              validator: validateUrl(<FormattedMessage id="invalid.homepage" defaultMessage="Homepage is invalid" />)
            }]}
            lockedByMasterSource={isLockedByMaster('homepage') || isLockedByIH(suggestion, 'homepage')}
            label={<FormattedMessage id="homepage" defaultMessage="Homepage" />}
            helpText={<FormattedMessage id="help.collection.homepage" />}
          >
            <Input disabled={isLockedByMaster('homepage') || isLockedByIH(suggestion, 'homepage')} />
          </FormItem>

          <FormItem
            originalValue={diff.catalogUrls}
            name='catalogUrls'
            initialValue={[]}
            rules={[{
              validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid" />)
            }]}
            lockedByMasterSource={isLockedByMaster('catalogUrls') || isLockedByIH(suggestion, 'catalogUrls')}
            label={<FormattedMessage id="catalogUrls" defaultMessage="Catalog URL" />}
            helpText={<FormattedMessage id="help.collection.catalogUrls" />}
          >
            <TagControl disabled={isLockedByMaster('catalogUrls') || isLockedByIH(suggestion, 'catalogUrls')} label={<FormattedMessage id="newUrl" defaultMessage="New URL" />} removeAll={true} />
          </FormItem>

          <FormItem
            originalValue={diff.apiUrls}
            name='apiUrls'
            initialValue={[]}
            rules={[{
              validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid" />)
            }]}
            lockedByMasterSource={isLockedByMaster('apiUrls') || isLockedByIH(suggestion, 'apiUrls')}
            label={<FormattedMessage id="apiUrl" defaultMessage="API URL" />}
            helpText={<FormattedMessage id="help.collection.apiUrls" />}
          >
            <TagControl disabled={isLockedByMaster('apiUrls') || isLockedByIH(suggestion, 'apiUrls')} label={<FormattedMessage id="newUrl" defaultMessage="New URL" />} removeAll={true} />
          </FormItem>

          <FormItem
            originalValue={diff.institutionKey}
            name='institutionKey'
            rules={[{
              required: isSuggestion, message: <FormattedMessage id="provide.institution" defaultMessage="Please provide an institution" />
            }]}
            lockedByMasterSource={isLockedByMaster('institution') || isLockedByIH(suggestion, 'institution')}
            label={<FormattedMessage id="institution" defaultMessage="Institution" />}
            helpText={<FormattedMessage id="help.collection.institutionName" />}
          >
            <FilteredSelectControl
              disabled={isLockedByMaster('institution') || isLockedByIH(suggestion, 'institution')}
              placeholder={<FormattedMessage id="select.institution" defaultMessage="Select an institution" />}
              search={handleSearch}
              renderItem={item => <div>{item.name} <small>{item.code}</small></div>}
              fetching={fetching}
              items={institutions}
              titleField="name"
              delay={1000}
            />
          </FormItem>

          <FormItem
            originalValue={diff.phone}
            name='phone'
            initialValue={[]}
            rules={[{
              validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid" />)
            }]}
            lockedByMasterSource={isLockedByMaster('phone') || isLockedByIH(suggestion, 'phone')}
            label={<FormattedMessage id="phone" defaultMessage="Phone" />}
            helpText={<FormattedMessage id="help.collection.phone" />}
          >
            <TagControl disabled={isLockedByMaster('phone') || isLockedByIH(suggestion, 'phone')} label={<FormattedMessage id="newPhone" defaultMessage="New phone" />} removeAll={true} />
          </FormItem>

          <FormItem
            originalValue={diff.email}
            name="email"
            initialValue={[]}
            rules={[{
              validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid" />)
            }]}
            lockedByMasterSource={isLockedByMaster('email') || isLockedByIH(suggestion, 'email')}
            label={<FormattedMessage id="email" defaultMessage="Email" />}
            helpText={<FormattedMessage id="help.collection.email" />}
          >
            <TagControl disabled={isLockedByMaster('email') || isLockedByIH(suggestion, 'email')} label={<FormattedMessage id="newEmail" defaultMessage="New email" />} removeAll={true} />
          </FormItem>

          <FormItem
            originalValue={diff.preservationTypes}
            name='preservationTypes'
            lockedByMasterSource={isLockedByMaster('preservationTypes') || isLockedByIH(suggestion, 'preservationTypes')}
            label={<FormattedMessage id="preservationTypes" defaultMessage="Preservation types" />}
            helpText={<FormattedMessage id="help.collection.preservationTypes" />}
          >
            <Select
              disabled={isLockedByMaster('preservationTypes') || isLockedByIH(suggestion, 'preservationTypes')}
              mode="multiple"
              placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type" />}
            >
              {preservationTypes.map(type => (
                <Select.Option value={type} key={type}>
                  <ConceptValue vocabulary="PreservationType" name={type} includeContext />
                </Select.Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            originalValue={diff.taxonomicCoverage}
            name='taxonomicCoverage'
            lockedByMasterSource={isLockedByMaster('taxonomicCoverage') || isLockedByIH(suggestion, 'taxonomicCoverage')}
            label={<FormattedMessage id="taxonomicCoverage" defaultMessage="Taxonomic coverage" />}
            helpText={<FormattedMessage id="help.collection.taxonomicCoverage" />}
          >
            <Input disabled={isLockedByMaster('taxonomicCoverage') || isLockedByIH(suggestion, 'taxonomicCoverage')} />
          </FormItem>

          <FormItem
            originalValue={diff.geographicCoverage}
            name='geographicCoverage'
            lockedByMasterSource={isLockedByMaster('geographicCoverage') || isLockedByIH(suggestion, 'geographicCoverage')}
            label={<FormattedMessage id="geographicCoverage" defaultMessage="Geographic coverage" />}
            helpText={<FormattedMessage id="help.collection.geographicCoverage" />}
          >
            <Input disabled={isLockedByMaster('geographicCoverage') || isLockedByIH(suggestion, 'geographicCoverage')} />
          </FormItem>

          <FormItem
            originalValue={diff.temporalCoverage}
            name='temporalCoverage'
            lockedByMasterSource={isLockedByMaster('temporalCoverage') || isLockedByIH(suggestion, 'temporalCoverage')}
            label={<FormattedMessage id="temporalCoverage" defaultMessage="Temporal coverage" />}
            helpText={<FormattedMessage id="help.collection.temporalCoverage" />}
          >
            <Input disabled={isLockedByMaster('temporalCoverage') || isLockedByIH(suggestion, 'temporalCoverage')} />
          </FormItem>

          <FormItem
            originalValue={diff.notes}
            name='notes'
            lockedByMasterSource={isLockedByMaster('notes') || isLockedByIH(suggestion, 'notes')}
            label={<FormattedMessage id="notes" defaultMessage="Notes" />}
            helpText={<FormattedMessage id="help.collection.notes" />}
          >
            <Input disabled={isLockedByMaster('notes') || isLockedByIH(suggestion, 'notes')} />
          </FormItem>

          <FormItem originalValue={diff.notes}
            name='notes'
            lockedByMasterSource={isLockedByMaster('notes') || isLockedByIH(suggestion)}
            label={<FormattedMessage id="notes" defaultMessage="Notes" />}
            helpText={
              <FormattedMessage
                id="help.collection.notes"
              />}
          >
            <Input disabled={isLockedByMaster('notes') || isLockedByIH(suggestion, 'notes')} />
          </FormItem>

          <FormItem originalValue={diff.incorporatedCollections}
            name='incorporatedCollections'
            initialValue={[]}
            lockedByMasterSource={isLockedByMaster('incorporatedCollections') || isLockedByIH(suggestion, 'incorporatedCollections')}
            label={<FormattedMessage id="incorporatedCollections" defaultMessage="Incorporated collections" />}
            helpText={
              <FormattedMessage
                id="help.collection.incorporatedCollections"
              />}
          >
            <TagControl disabled={isLockedByMaster('incorporatedCollections') || isLockedByIH(suggestion, 'incorporatedCollections')} label={<FormattedMessage id="newCollection" defaultMessage="New collection" />} removeAll={true} />
          </FormItem>

          <FormItem originalValue={diff.accessionStatus}
            name='accessionStatus'
            lockedByMasterSource={isLockedByMaster('accessionStatus') || isLockedByIH(suggestion,'accessionStatus')}
            label={<FormattedMessage id="accessionStatus" defaultMessage="Accession status" />}
            helpText={
              <FormattedMessage
                id="help.collection.accessionStatus"
              />}
          >
            <Select disabled={isLockedByMaster('accessionStatus') || isLockedByIH(suggestion, 'accessionStatus')}
              placeholder={<FormattedMessage id="select.status" defaultMessage="Select a status" />}>
              {accessionStatuses.map(status => (
                <Select.Option value={status} key={status}>
                  <ConceptValue vocabulary="AccessionStatus" name={status} includeContext />
                </Select.Option>
              ))}
            </Select>
          </FormItem>

          <FormItem originalValue={diff.active}
            name='active'
            valuePropName='value'
            lockedByMasterSource={isLockedByMaster('active') || isLockedByIH(suggestion, 'active')}
            label={<FormattedMessage id="active" defaultMessage="Active" />}
            rules={[
              {
                required: true,
                message: <FormattedMessage id="select.status" defaultMessage="Select a status" />,
              },
            ]}
            helpText={
              <FormattedMessage
                id="help.collection.active"
              />}

          >
            <Radio.Group disabled={isLockedByMaster('active') || isLockedByIH(suggestion, 'active')}>
              <Radio value={true}><FormattedMessage id="grscicoll.active" /></Radio>
              <Radio value={false}><FormattedMessage id="grscicoll.inactive" /></Radio>
            </Radio.Group>
          </FormItem>

          <FormItem originalValue={diff.personalCollection}
            name='personalCollection'
            valuePropName='checked'
            lockedByMasterSource={isLockedByMaster('personalCollection') || isLockedByIH(suggestion, 'personalCollection')}
            label={<FormattedMessage id="personalCollection" defaultMessage="Personal collection" />}
            helpText={
              <FormattedMessage
                id="help.collection.personalCollection"
              />}
          >
            <Checkbox disabled={isLockedByMaster('personalCollection') || isLockedByIH(suggestion, 'personalCollection')} />
          </FormItem>

          <FormItem originalValue={diff.displayOnNHCPortal}
            name='displayOnNHCPortal'
            valuePropName='checked'
            lockedByMasterSource={isLockedByMaster('displayOnNHCPortal') || isLockedByIH(suggestion, 'displayOnNHCPortal')}
            label={<FormattedMessage id="displayOnNHCPortal" defaultMessage="Display on NHC portal" />}
            helpText={
              <FormattedMessage
                id="help.collection.displayOnNHCPortal"
              />}
          >
            <Checkbox disabled={isLockedByMaster('displayOnNHCPortal') || isLockedByIH(suggestion, 'displayOnNHCPortal')} />
          </FormItem>

          <FormItem originalValue={diff.featuredImageUrl}
            name='featuredImageUrl'
            lockedByMasterSource={isLockedByMaster('featuredImageUrl') || isLockedByIH(suggestion, 'featuredImageUrl')}
            label={<FormattedMessage id="featuredImageUrl" defaultMessage="Featured image URL" />}
            helpText={
              <FormattedMessage
                id="help.featuredImageUrl"
              />}
          >
            <Input disabled={isLockedByMaster('featuredImageUrl') || isLockedByIH(suggestion, 'featuredImageUrl')} />
          </FormItem>

          <FormItem originalValue={diff?.featuredImageLicense}
            name='featuredImageLicense'
            lockedByMasterSource={isLockedByMaster('featuredImageLicense') || isLockedByIH(suggestion, 'featuredImageLicense')}
            label={<FormattedMessage id="featuredImageLicense" defaultMessage="Featured image license" />}
            helpText={
              <FormattedMessage
                id="help.featuredImageLicense"
              />}
          >
            <Select showSearch={true} disabled={isLockedByMaster('featuredImageLicense') || isLockedByIH(suggestion, 'featuredImageLicense')}
              placeholder={<FormattedMessage id="select.license" defaultMessage="Select a license" />}>
              <Option value={null}></Option>
              {licenseEnums.map(license => (
                <Option value={license} key={license}>{prettifyLicense(license)}</Option>
              ))}
            </Select>
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
            lockedByMasterSource={isLockedByMaster('mailingAddress') || isLockedByIH(suggestion, 'mailingAddress')}
            label={<FormattedMessage id="address" defaultMessage="Address" />}
            helpText={
              <FormattedMessage
                id="help.collection.mailingAddress.address"
              />}
          >
            <Input disabled={isLockedByMaster('mailingAddress') || isLockedByIH(suggestion, 'mailingAddress')} />
          </FormItem>

          <FormItem originalValue={diff?.mailingAddress?.city}
            name={['mailingAddress', 'city']}
            lockedByMasterSource={isLockedByMaster('mailingAddress') || isLockedByIH(suggestion, 'mailingAddress')}
            label={<FormattedMessage id="city" defaultMessage="City" />}
            helpText={
              <FormattedMessage
                id="help.collection.mailingAddress.city"
              />}
          >
            <Input disabled={isLockedByMaster('mailingAddress') || isLockedByIH(suggestion, 'mailingAddress')} />
          </FormItem>

          <FormItem originalValue={diff?.mailingAddress?.province}
            name={['mailingAddress', 'province']}
            lockedByMasterSource={isLockedByMaster('mailingAddress') || isLockedByIH(suggestion, 'mailingAddress')}
            label={<FormattedMessage id="province" defaultMessage="Province" />}
            helpText={
              <FormattedMessage
                id="help.collection.mailingAddress.province"
              />}
          >
            <Input disabled={isLockedByMaster('mailingAddress') || isLockedByIH(suggestion, 'mailingAddress')} />
          </FormItem>

          <FormItem originalValue={diff?.mailingAddress?.country}
            name={['mailingAddress', 'country']}
            lockedByMasterSource={isLockedByMaster('mailingAddress') || isLockedByIH(suggestion)}
            label={<FormattedMessage id="country" defaultMessage="Country" />}
            helpText={
              <FormattedMessage
                id="help.collection.mailingAddress.country"
              />}
          >
            <Select showSearch={true} disabled={isLockedByMaster('mailingAddress') || isLockedByIH(suggestion, 'mailingAddress')}
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
            lockedByMasterSource={isLockedByMaster('mailingAddress') || isLockedByIH(suggestion, 'mailingAddress')}
            label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}
            helpText={
              <FormattedMessage
                id="help.collection.mailingAddress.postalCode"
              />}
          >
            <Input disabled={isLockedByMaster('mailingAddress') || isLockedByIH(suggestion, 'mailingAddress')} />
          </FormItem>

          <FormGroupHeader
            title={<FormattedMessage id="physicalAddress" defaultMessage="Physical address" />}
            helpText={<FormattedMessage id="help.physicalAddress" defaultMessage="An address of a building" />}
          />


          <FormItem name={['address', 'key']} style={{ display: 'none' }}>
            <Input style={{ display: 'none' }} />
          </FormItem>

          <FormItem originalValue={diff?.address?.address}
            name={['address', 'address']}
            lockedByMasterSource={isLockedByMaster('address') || isLockedByIH(suggestion, 'address')}
            label={<FormattedMessage id="address" defaultMessage="Address" />}
            helpText={
              <FormattedMessage
                id="help.collection.address.address"
              />}
          >
            <Input disabled={isLockedByMaster('address') || isLockedByIH(suggestion, 'address')} />
          </FormItem>

          <FormItem originalValue={diff?.address?.city}
            name={['address', 'city']}
            lockedByMasterSource={isLockedByMaster('address') || isLockedByIH(suggestion, 'address')}
            label={<FormattedMessage id="city" defaultMessage="City" />}
            helpText={
              <FormattedMessage
                id="help.collection.address.city"
              />}
          >
            <Input disabled={isLockedByMaster('address') || isLockedByIH(suggestion, 'address')} />
          </FormItem>

          <FormItem originalValue={diff?.address?.province}
            name={['address', 'province']}
            lockedByMasterSource={isLockedByMaster('address') || isLockedByIH(suggestion, 'address')}
            label={<FormattedMessage id="province" defaultMessage="Province" />}
            helpText={
              <FormattedMessage
                id="help.collection.address.province"
              />}
          >
            <Input disabled={isLockedByMaster('address') || isLockedByIH(suggestion, 'address')} />
          </FormItem>

          <FormItem originalValue={diff?.address?.country}
            name={['address', 'country',]}
            lockedByMasterSource={isLockedByMaster('address') || isLockedByIH(suggestion, 'address')}
            label={<FormattedMessage id="country" defaultMessage="Country" />}
            helpText={
              <FormattedMessage
                id="help.collection.address.country"
              />}
          >
            <Select showSearch={true} disabled={isLockedByMaster('address') || isLockedByIH(suggestion, 'address')}
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
            lockedByMasterSource={isLockedByMaster('address') || isLockedByIH(suggestion) || isLockedByIH(suggestion, 'address')}
            label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}
            helpText={
              <FormattedMessage
                id="help.collection.address.postalCode"
              />}
          >
            <Input disabled={isLockedByMaster('address') || isLockedByIH(suggestion, 'address')} />
          </FormItem>

          {reviewChange && hasChanges && (contactChanges || identifierChanges) && <div>
            <FormGroupHeader
              title={<FormattedMessage id="otherChanges" defaultMessage="Other changes" />}
            />

            {contactChanges && <FormItem originalValue={diff?.contactPersons}
              name='contactPersons'
              initialValue={collection?.contactPersons ?? []}
              label={<FormattedMessage id="contacts" defaultMessage="Contacts" />}
              helpText={
                <FormattedMessage
                  id="help.collection.contactPersons.suggestedChanges"
                />}
            >
              <JsonFormField disabled={isLockedByIH(suggestion, 'contactPersons')} />
            </FormItem>}

            {identifierChanges && <FormItem originalValue={diff?.identifiers}
              name='identifiers'
              initialValue={collection?.identifiers ?? []}
              label={<FormattedMessage id="identifiers" defaultMessage="Identifiers" />}
              helpText={
                <FormattedMessage
                  id="help.collection.identifiers.suggestedChanges"
                />}
            >
              <JsonFormField />
            </FormItem>}
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

const mapContextToProps = ({ user, countries, licenseEnums, addError, addSuccess }) => ({ user, countries, licenseEnums, addError, addSuccess });

export default withContext(mapContextToProps)(withRouter(injectSheet(styles)(CollectionForm)));

function isObj(o) {
  return typeof o === 'object' && o !== null;
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