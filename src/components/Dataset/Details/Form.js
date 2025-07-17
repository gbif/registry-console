import React, {useState, useEffect} from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Input, Select, Button, Checkbox, Row, Col, Form } from 'antd';
import PropTypes from 'prop-types';

// APIs
import { createDataset, updateDataset, getDatasetSuggestions } from '../../../api/dataset';
import { getSuggestedInstallations } from '../../../api/installation';
import { getDatasetSubtypes, getDatasetTypes, getMaintenanceUpdateFrequencies, getDatasetCategory } from '../../../api/enumeration';
import { getOrgSuggestions } from '../../../api/organization';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FilteredSelectControl, FormItem } from '../../common';
// Helpers
import { getPermittedOrganizations, prettifyLicense } from '../../util/helpers';
import { validateDOI, validateUrl } from '../../util/validators';

const Option = Select.Option;
const TextArea = Input.TextArea;

const DatasetForm = props => {
   
  const { dataset, licenses, languages, intl } = props;

  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([])
  const [frequencies, setFrequencies] = useState([])
  const [categories, setCategories] = useState([])
  const [fetchingOrg, setFetchingOrg] = useState(false)
  const [fetchingInst, setFetchingInst] = useState(false)
  const [fetchingDataset, setFetchingDataset] = useState(false)
  const [installations, setInstallations] = useState(dataset && dataset.installation ? [dataset.installation] : [])
  const [duplicates, setDuplicates] = useState(dataset && dataset.duplicateDataset ? [dataset.duplicateDataset] : [])
  const [parents, setParents] = useState(dataset && dataset.parentDataset ? [dataset.parentDataset] : [])
  const [organizations, setOrganizations] = useState(dataset && dataset.publishingOrganization ? [dataset.publishingOrganization] : [])
  const [form] = Form.useForm();

  useEffect(() => {
    const init = async () =>{
      const [typesRes, subtypesRes, frequenciesRes, categoriesRes] = await Promise.all([
        getDatasetTypes(),
        getDatasetSubtypes(),
        getMaintenanceUpdateFrequencies(),
        getDatasetCategory({ latestRelease: true })
      ]);
      setTypes(typesRes)
      setSubtypes(subtypesRes)
      setFrequencies(frequenciesRes)
      setCategories(categoriesRes)
    }
    init()
  
},[])



  const handleSubmit = (values) => {
    // Convert category array to Set format for backend
    const processedValues = {
      ...values,
      category: values.category && values.category.length > 0 ? values.category : null
    };

    if (!dataset) {
      createDataset(processedValues)
        .then(response => props.onSubmit(response.data))
        .catch(error => {
          props.addError({ status: error.response.status, statusText: error.response.data });
        });
    } else {
      updateDataset({ ...props.dataset, ...processedValues })
        .then(() => props.onSubmit())
        .catch(error => {
          props.addError({ status: error.response.status, statusText: error.response.data });
        });
    }
  };

  const handleOrganizationSearch = value => {
    if (!value) {
      setOrganizations([])
      return;
    }
    setOrganizations([])
    setFetchingOrg(true)

    getOrgSuggestions({ q: value }).then(response => {
      setOrganizations(getPermittedOrganizations(props.user, response.data))
      setFetchingOrg(false)
      
    }).catch(() => {
      setFetchingOrg(false)
    });
  };

  const handleInstSearch = value => {
    if (!value) {
      setInstallations([])
      return;
    }
    setInstallations([])
    setFetchingInst(true)

    getSuggestedInstallations({ q: value }).then(response => {
      setInstallations(response.data)
      setFetchingInst(false)

    }).catch(() => {
      setFetchingInst(false)
    });
  };

  const handleDatasetSearch = (value, type) => {
    if (!value) {
      return;
    }
    if(type === "parents"){
      setParents([])
    }
    if(type === "duplicates"){
      setDuplicates([])
    }
    setFetchingDataset(true)

    getDatasetSuggestions({ q: value }).then(response => {
      if(type === "parents"){
        setParents(response.data)
      }
      if(type === "duplicates"){
        setDuplicates(response.data)
      }
      setFetchingDataset(false)

      
    }).catch(() => {
      setFetchingDataset(false)

    });
  };

  let initialValues = {type:types[0], ...dataset}

    return (
      <React.Fragment>
        <Form onFinish={handleSubmit} initialValues={initialValues} form={form}>

          <FormItem name='title' rules= {[{
                required: true,
                message: <FormattedMessage id="provide.title" defaultMessage="Please provide a title"/>
              }]} label={<FormattedMessage id="title" defaultMessage="Title"/>}>
            <Input/>
          </FormItem>

          <FormItem name='type' label={<FormattedMessage id="type" defaultMessage="Type"/>}>
            <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}>
                {types.map(type => (
                  <Option value={type} key={type}>
                    <FormattedMessage id={`datasetType.${type}`}/>
                  </Option>
                ))}
              </Select>
          </FormItem>

          <FormItem name='subtype' label={<FormattedMessage id="subtype" defaultMessage="Subtype"/>}>
          <Select placeholder={<FormattedMessage id="select.subtype" defaultMessage="Select a subtype"/>}>
                {subtypes.map(subtype => (
                  <Option value={subtype} key={subtype}><FormattedMessage id={`dataset.subtype.${subtype}`}/></Option>
                ))}
              </Select>
          </FormItem>

          <FormItem 
            name='category' 
            label={<FormattedMessage id="category" defaultMessage="Category"/>}
            helpText={
              <FormattedMessage
                id="help.category"
                defaultMessage="Categories come from the vocabulary. You can view and manage them in the {vocabularyLink}."
                values={{
                  vocabularyLink: (
                    <a 
                      href={`${process.env.REACT_APP_GBIF_URL}/vocabulary/DatasetCategory/concepts`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FormattedMessage id="help.vocabulary.page" defaultMessage="vocabulary page"/>
                    </a>
                  )
                }}
              />
            }
          >
            <Select 
              mode="multiple"
              placeholder={<FormattedMessage id="select.category" defaultMessage="Select categories"/>}
              allowClear
            >
                {categories.map(category => (
                  <Option value={category} key={category}>
                    <FormattedMessage id={`dataset.category.${category}`} defaultMessage={category}/>
                  </Option>
                ))}
              </Select>
          </FormItem>

          <FormItem
            name='external'
            valuePropName='checked'
            label={<FormattedMessage id="external" defaultMessage="External"/>}
            helpText={
              <FormattedMessage
                id="help.externalTip"
                defaultMessage="Indicates that the dataset is found through integration with metadata networks, and not registered directly with GBIF"
              />
            }
          >
             <Checkbox/>
          </FormItem>

          <FormItem
            name='license'

            label={<FormattedMessage id="license" defaultMessage="License"/>}
            warning={
              <FormattedMessage
                id="warning.datasetLicense"
                defaultMessage="Changing this will update all occurrence records"
              />
            }
            isNew={!dataset}
          >
            <Select placeholder={<FormattedMessage id="select.license" defaultMessage="Select a license"/>}>
                {licenses.map(license => (
                  <Option value={license} key={license}>{prettifyLicense(license)}</Option>
                ))}
              </Select>
          </FormItem>

          <FormItem
          name='lockedForAutoUpdate'
          valuePropName='checked'
            label={<FormattedMessage id="lockAutoUpdates" defaultMessage="Lock auto updates"/>}
            helpText={
              <FormattedMessage
                id="help.lockedForAutoUpdateTip"
                defaultMessage="Controls permissions for crawlers updating metadata, contacts etc"
              />
            }
            warning={
              <FormattedMessage
                id="warning.datasetAutoUpdate"
                defaultMessage="Use with caution - disables automated updates"
              />
            }
            isNew={!dataset}
          >
            <Checkbox/>
          </FormItem>

          <FormItem
          name='doi'
          rules= {[{
            validator: validateDOI(<FormattedMessage id="invalid.doi"
                                                     defaultMessage="Digital Object Identifier is invalid"/>)
          }]}
            label={<FormattedMessage id="doi" defaultMessage="Digital Object Identifier"/>}
            warning={
              <FormattedMessage
                id="warning.datasetDOI"
                defaultMessage="Changes should be made understanding the consequences"
              />
            }
            isNew={!dataset}
          >
             <Input/>
          </FormItem>

          <FormItem name='description' label={<FormattedMessage id="description" defaultMessage="Description"/>}>
          <TextArea rows={4}/>
          </FormItem>

          <FormItem
          name='publishingOrganizationKey'
          rules= {[{
            required: true,
            message: <FormattedMessage id="provide.organization" defaultMessage="Please select an organization"/>
          }]}
            label={<FormattedMessage id="publishingOrganization" defaultMessage="Publishing organization"/>}
            helpText={
              <FormattedMessage
                id="help.publishingOrg"
                defaultMessage="It is expected that this may be changed occasionally, but be vigilant in changes as this has potential to spawn significant processing for occurrence records, metrics and maps"
              />
            }
            warning={
              <FormattedMessage
                id="warning.publishingOrganization"
                defaultMessage="Changing this will update hosting organization on all occurrence records."
              />
            }
            isNew={!dataset}
          >
            <FilteredSelectControl
                placeholder={<FormattedMessage id="select.organization" defaultMessage="Select an organization"/>}
                search={handleOrganizationSearch}
                fetching={fetchingOrg}
                items={organizations}
                delay={1000}
              />
          </FormItem>

          <FormItem
          name='installationKey'
          rules= {[{
            required: true,
            message: <FormattedMessage id="provide.installation" defaultMessage="Please provide an installation"/>
          }]}
            label={<FormattedMessage id="installation" defaultMessage="Installation"/>}
            helpText={
              <FormattedMessage
                id="help.installation"
                defaultMessage="It is expected that this may be changed occasionally, but be vigilant in changes as this has potential to spawn significant processing for occurrence records, metrics. Please verify the services are as expected on change"
              />
            }
            warning={
              <FormattedMessage
                id="warning.hostingOrganization"
                defaultMessage="Changing this will update hosting organization on all occurrence records."
              />
            }
            isNew={!dataset}
          >
            <FilteredSelectControl
                placeholder={<FormattedMessage id="select.installation" defaultMessage="Select an installation"/>}
                search={handleInstSearch}
                fetching={fetchingInst}
                items={installations}
                delay={1000}
              />
          </FormItem>

          <FormItem
          name='parentDatasetKey'
            label={<FormattedMessage id="parentDataset" defaultMessage="Parent dataset"/>}
            helpText={
              <FormattedMessage
                id="help.parentDataset"
                defaultMessage="For use in declaring dataset relationships, such as the constituent parts of the Catalogue of Life"
              />
            }
          >
            <FilteredSelectControl
                placeholder={<FormattedMessage id="select.parentDataset" defaultMessage="Select parent dataset"/>}
                search={value => handleDatasetSearch(value, 'parents')}
                fetching={fetchingDataset}
                items={parents}
                delay={1000}
              />
          </FormItem>

          <FormItem
          name='duplicateOfDatasetKey'
            label={<FormattedMessage id="duplicateDataset" defaultMessage="Duplicate of Dataset"/>}
            helpText={
              <FormattedMessage
                id="help.duplicateDataset"
                defaultMessage="When a dataset is found to be a duplicate of another, then it should be updated. This will effectively trigger a de-index which is the same as a deletion. It may be that you ALSO need to set the parent dataset if this has been aggregated."
              />
            }
            warning={
              <FormattedMessage
                id="warning.duplicateDataset"
                defaultMessage="Changing this will DELETE all occurrence records"
              />
            }
            isNew={!dataset}
          >
            <FilteredSelectControl
                placeholder={<FormattedMessage id="select.duplicateDataset" defaultMessage="Select duplicate of dataset"/>}
                search={value => handleDatasetSearch(value, 'duplicates')}
                fetching={fetchingDataset}
                items={duplicates}
                delay={1000}
              />
          </FormItem>

          <FormItem name='homepage' rules={[{
                validator: validateUrl(<FormattedMessage id="invalid.homepage" defaultMessage="Homepage is invalid"/>)
              }]} label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            <Input/>
          </FormItem>

          <FormItem name='logoUrl' rules={[{
                validator: validateUrl(
                  <FormattedMessage id="invalid.url.logo" defaultMessage="Logo url is invalid"/>
                )
              }]} label={<FormattedMessage id="logo" defaultMessage="Logo"/>}>
            <Input/>
          </FormItem>

          <FormItem
          name='language'
            label={<FormattedMessage id="language" defaultMessage="Language"/>}
            helpText={
              <FormattedMessage
                id="help.language"
                defaultMessage="The language used for the likes of description, citation etc"
              />
            }
          >
           <Select
                showSearch
                optionFilterProp="children"
                placeholder={<FormattedMessage id="select.language" defaultMessage="Select a language"/>}
                filterOption={
                  (input, option) => {
                    // We need to translate language code before we'll be able to compare it with input
                    const langTranslation = intl.formatMessage({ id: option.props.children.props.id, defaultMessage: '' });
                    // if there is a translation for language code and it contains user's input then return true
                    return langTranslation && langTranslation.toLowerCase().includes(input.toLowerCase());
                  }
                }
              >
                {languages.map(language => (
                  <Option value={language} key={language}>
                    <FormattedMessage id={`language.${language}`}/>
                  </Option>
                ))}
              </Select>
          </FormItem>

          <FormItem
          name='maintenanceUpdateFrequency'
            label={<FormattedMessage id="updateFrequency" defaultMessage="Update frequency"/>}
            helpText={
              <FormattedMessage
                id="help.updateFrequency"
                defaultMessage="The frequency with which changes and additions are made"
              />
            }
          >
            <Select placeholder={
                <FormattedMessage id="select.updateFrequency" defaultMessage="Select an update frequency"/>
              }>
                {frequencies.map(frequency => (
                  <Option value={frequency} key={frequency}>{frequency}</Option>
                ))}
              </Select>
          </FormItem>

          <FormItem name='alias' label={<FormattedMessage id="alias" defaultMessage="Alias"/>}>
          <Input disabled={true}/>
          </FormItem>

          <FormItem name='abbreviation' label={<FormattedMessage id="abbreviation" defaultMessage="Abbreviation"/>}>
          <Input disabled={true}/>
          </FormItem>

          <FormItem name={['citation', 'text']} label={<FormattedMessage id="citation" defaultMessage="Citation"/>}>
          <Input disabled={true}/>
          </FormItem>

          <FormItem  name={['citation', 'identifier']} label={<FormattedMessage id="citationIdentifier" defaultMessage="Citation identifier"/>}>
          <Input disabled={true}/>
          </FormItem>

          <FormItem name='rights' label={<FormattedMessage id="rights" defaultMessage="Rights"/>}>
          <Input disabled={true}/>
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit">
                {dataset ?
                  <FormattedMessage id="save" defaultMessage="Save"/> :
                  <FormattedMessage id="create" defaultMessage="Create"/>
                }
              </Button>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  
}

DatasetForm.propTypes = {
  dataset: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ licenses, languages, addError, user }) => ({ licenses, languages, addError, user });

export default withContext(mapContextToProps)(injectIntl(DatasetForm));
