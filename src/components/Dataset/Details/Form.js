import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Input, Select, Button, Checkbox, Row, Col } from 'antd';
import PropTypes from 'prop-types';

// APIs
import { createDataset, updateDataset, getDatasetSuggestions } from '../../../api/dataset';
import { getOrgSuggestions } from '../../../api/organization';
import { search as searchInstallations } from '../../../api/installation';
import { getDatasetSubtypes, getDatasetTypes, getMaintenanceUpdateFrequencies } from '../../../api/enumeration';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FilteredSelectControl, FormItem } from '../../common';
// Helpers
import { getPermittedOrganizations, prettifyLicense, validateDOI, validateUrl } from '../../helpers';

const Option = Select.Option;
const TextArea = Input.TextArea;

class DatasetForm extends React.Component {
  constructor(props) {
    super(props);

    const dataset = this.props.dataset;
    this.state = {
      types: [],
      subtypes: [],
      frequencies: [],
      fetchingOrg: false,
      fetchingInst: false,
      fetchingDataset: false,
      installations: dataset && dataset.installation ? [dataset.installation] : [],
      duplicates: dataset && dataset.duplicateDataset ? [dataset.duplicateDataset] : [],
      parents: dataset && dataset.parentDataset ? [dataset.parentDataset] : [],
      organizations: dataset && dataset.publishingOrganization ? [dataset.publishingOrganization] : []
    };
  }

  async componentDidMount() {
    const types = await getDatasetTypes();
    const subtypes = await getDatasetSubtypes();
    const frequencies = await getMaintenanceUpdateFrequencies();

    this.setState({
      types,
      subtypes,
      frequencies
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.props.dataset) {
          createDataset(values)
            .then(response => this.props.onSubmit(response.data))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updateDataset({ ...this.props.dataset, ...values })
            .then(() => this.props.onSubmit())
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      }
    });
  };

  handleOrgSearch = value => {
    if (!value) {
      return;
    }

    this.setState({
      organizations: [],
      fetchingOrg: true
    });

    getOrgSuggestions({ q: value }).then(response => {
      this.setState({
        organizations: getPermittedOrganizations(this.props.user, response.data),
        fetchingOrg: false
      });
    }).catch(() => {
      this.setState({ fetchingOrg: false });
    });
  };

  handleInstSearch = value => {
    if (!value || value.length < 4) {
      return;
    }

    this.setState({
      installations: [],
      fetchingInst: true
    });

    searchInstallations({ q: value }).then(response => {
      this.setState({
        installations: response.data.results,
        fetchingInst: false
      });
    }).catch(() => {
      this.setState({ fetchingInst: false });
    });
  };

  handleDatasetSearch = (value, type) => {
    if (!value || value.length < 4) {
      return;
    }

    this.setState({
      [type]: [],
      fetchingDataset: true
    });

    getDatasetSuggestions({ q: value }).then(response => {
      this.setState({
        [type]: response.data,
        fetchingDataset: false
      });
    }).catch(() => {
      this.setState({ fetchingDataset: false });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataset, licenses, languages } = this.props;
    const isNew = dataset === null;
    const { types, subtypes, frequencies, organizations, installations, duplicates, parents } = this.state;
    const { fetchingOrg, fetchingInst, fetchingDataset } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>

          <FormItem label={<FormattedMessage id="title" defaultMessage="Title"/>}>
            {getFieldDecorator('title', {
              initialValue: dataset && dataset.title,
              rules: [{
                required: true,
                message: <FormattedMessage id="provide.title" defaultMessage="Please provide a title"/>
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
            {getFieldDecorator('type', { initialValue: (dataset && dataset.type) || types[0] })(
              <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}>
                {types.map(type => (
                  <Option value={type} key={type}>
                    <FormattedMessage id={`datasetType.${type}`}/>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="subtype" defaultMessage="Subtype"/>}>
            {getFieldDecorator('subtype', { initialValue: dataset ? dataset.subtype : undefined })(
              <Select placeholder={<FormattedMessage id="select.subtype" defaultMessage="Select a subtype"/>}>
                {subtypes.map(subtype => (
                  <Option value={subtype} key={subtype}>{subtype}</Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="external" defaultMessage="External"/>}
            helpText={
              <FormattedMessage
                id="help.externalTip"
                defaultMessage="Indicates that the dataset is found through integration with metadata networks, and not registered directly with GBIF"
              />
            }
          >
            {getFieldDecorator('disabled', {
              valuePropName: 'checked',
              initialValue: dataset && dataset.external
            })(
              <Checkbox/>
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="license" defaultMessage="License"/>}
            warning={
              <FormattedMessage
                id="warning.datasetLicense"
                defaultMessage="Changing this will update all occurrence records"
              />
            }
            isNew={isNew}
          >
            {getFieldDecorator('license', { initialValue: dataset ? dataset.license : undefined })(
              <Select placeholder={<FormattedMessage id="select.license" defaultMessage="Select a license"/>}>
                {licenses.map(license => (
                  <Option value={license} key={license}>{prettifyLicense(license)}</Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
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
            isNew={isNew}
          >
            {getFieldDecorator('disabled', {
              valuePropName: 'checked',
              initialValue: dataset && dataset.lockedForAutoUpdate
            })(
              <Checkbox/>
            )}
          </FormItem>

          <FormItem
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
              initialValue: dataset && dataset.doi,
              rules: [{
                validator: validateDOI(<FormattedMessage id="invalid.doi" defaultMessage="Digital Object Identifier is invalid"/>)
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            {getFieldDecorator('description', { initialValue: dataset && dataset.description })(
              <TextArea rows={4}/>
            )}
          </FormItem>

          <FormItem
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
            isNew={isNew}
          >
            {getFieldDecorator('publishingOrganizationKey', {
              initialValue: dataset ? dataset.publishingOrganizationKey : undefined,
              rules: [{
                required: true,
                message: <FormattedMessage id="provide.organization" defaultMessage="Please select an organization"/>
              }]
            })(
              <FilteredSelectControl
                placeholder={<FormattedMessage id="select.organization" defaultMessage="Select an organization"/>}
                search={this.handleOrgSearch}
                fetching={fetchingOrg}
                items={organizations}
                delay={1000}
              />
            )}
          </FormItem>

          <FormItem
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
            isNew={isNew}
          >
            {getFieldDecorator('installationKey', {
              initialValue: dataset ? dataset.installationKey : undefined,
              rules: [{
                required: true,
                message: <FormattedMessage id="provide.installation" defaultMessage="Please provide an installation"/>
              }]
            })(
              <FilteredSelectControl
                placeholder={<FormattedMessage id="select.installation" defaultMessage="Select an installation"/>}
                search={this.handleInstSearch}
                fetching={fetchingInst}
                items={installations}
                delay={1000}
              />
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="parentDataset" defaultMessage="Parent dataset"/>}
            helpText={
              <FormattedMessage
                id="help.parentDataset"
                defaultMessage="For use in declaring dataset relationships, such as the constituent parts of the Catalogue of Life"
              />
            }
          >
            {getFieldDecorator('parentDatasetKey', { initialValue: dataset ? dataset.parentDatasetKey : undefined })(
              <FilteredSelectControl
                placeholder={<FormattedMessage id="select.parentDataset" defaultMessage="Select parent dataset"/>}
                search={value => this.handleDatasetSearch(value, 'parents')}
                fetching={fetchingDataset}
                items={parents}
                delay={1000}
              />
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="duplicateDataset" defaultMessage="Duplicate Dataset"/>}
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
            isNew={isNew}
          >
            {getFieldDecorator('duplicateDatasetKey', { initialValue: dataset ? dataset.duplicateDatasetKey : undefined })(
              <FilteredSelectControl
                placeholder={<FormattedMessage id="select.duplicateDataset" defaultMessage="Select duplicate dataset"/>}
                search={value => this.handleDatasetSearch(value, 'duplicates')}
                fetching={fetchingDataset}
                items={duplicates}
                delay={1000}
              />
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            {getFieldDecorator('homepage', {
              initialValue: dataset && dataset.homepage,
              rules: [{
                validator: validateUrl(<FormattedMessage id="invalid.homepage" defaultMessage="Homepage is invalid"/>)
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>}>
            {getFieldDecorator('logoUrl', { initialValue: dataset && dataset.logoUrl })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="language" defaultMessage="Language"/>}>
            {getFieldDecorator('language', { initialValue: dataset ? dataset.language : undefined })(
              <Select placeholder={<FormattedMessage id="select.language" defaultMessage="Select a language"/>}>
                {languages.map(language => (
                  <Option value={language} key={language}>
                    <FormattedMessage id={`language.${language}`}/>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="updateFrequency" defaultMessage="Update frequency"/>}
            helpText={
              <FormattedMessage
                id="help.updateFrequency"
                defaultMessage="The frequency with which changes and additions are made"
              />
            }
          >
            {getFieldDecorator('maintenanceUpdateFrequency', { initialValue: dataset ? dataset.maintenanceUpdateFrequency : undefined })(
              <Select placeholder={
                <FormattedMessage id="select.updateFrequency" defaultMessage="Select an update frequency"/>
              }>
                {frequencies.map(frequency => (
                  <Option value={frequency} key={frequency}>{frequency}</Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="alias" defaultMessage="Alias"/>}>
            {getFieldDecorator('alias', { initialValue: dataset && dataset.alias })(
              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="abbreviation" defaultMessage="Abbreviation"/>}>
            {getFieldDecorator('abbreviation', { initialValue: dataset && dataset.abbreviation })(
              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="citation" defaultMessage="Citation"/>}>
            {getFieldDecorator('citation.text', { initialValue: dataset && dataset.citation.text })(
              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="citationIdentifier" defaultMessage="Citation identifier"/>}>
            {getFieldDecorator('citation.identifier', { initialValue: dataset && dataset.citation.identifier })(
              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="rights" defaultMessage="Rights"/>}>
            {getFieldDecorator('rights', { initialValue: dataset && dataset.rights })(
              <Input disabled={true}/>
            )}
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={this.props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit">
                {dataset ?
                  <FormattedMessage id="edit" defaultMessage="Edit"/> :
                  <FormattedMessage id="create" defaultMessage="Create"/>
                }
              </Button>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

DatasetForm.propTypes = {
  dataset: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ licenses, languages, addError, user }) => ({ licenses, languages, addError, user });

const WrappedDatasetForm = Form.create()(withContext(mapContextToProps)(DatasetForm));
export default WrappedDatasetForm;
