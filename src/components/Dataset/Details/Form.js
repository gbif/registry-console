import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Input, Select, Button, Checkbox, Badge } from 'antd';
import injectSheet from 'react-jss';

import { createDataset, updateDataset } from '../../../api/dataset';
import { search as searchOrganizations } from '../../../api/organization';
import { search as searchInstallations } from '../../../api/installation';
import { searchDatasets } from '../../../api/dataset';
import { getDatasetSubtypes, getDatasetTypes, getMaintenanceUpdateFrequencies } from '../../../api/enumeration';
import { prettifyLicense } from '../../../api/util/helpers';
import { FilteredSelectControl } from '../../widgets';
import formValidationWrapper from '../../hoc/formValidationWrapper';
import withContext from '../../hoc/withContext';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 8 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 16 }
  }
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};
const styles = {
  important: {
    marginRight: '10px',
    '& sup': {
      backgroundColor: '#b94a48'
    }
  }
};

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

  // TODO probably, should be refactored or removed
  // First of all, method implemented for demonstration purposes
  // One of the cases to refactor - request all nodes initially on login and store  them within application
  // If it's rational and possible
  handleOrgSearch = value => {
    if (!value || value.length < 4) {
      return;
    }

    this.setState({
      organizations: [],
      fetchingOrg: true
    });

    searchOrganizations({ q: value }).then(response => {
      this.setState({
        organizations: response.data.results,
        fetchingOrg: false
      });
    }).catch(() => {
      this.setState({ fetchingOrg: false });
    });
  };

  // TODO probably, should be refactored or removed
  // First of all, method implemented for demonstration purposes
  // One of the cases to refactor - request all nodes initially on login and store  them within application
  // If it's rational and possible
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

  // TODO probably, should be refactored or removed
  // First of all, method implemented for demonstration purposes
  // One of the cases to refactor - request all nodes initially on login and store  them within application
  // If it's rational and possible
  handleDatasetSearch = (value, type) => {
    if (!value || value.length < 4) {
      return;
    }

    this.setState({
      [type]: [],
      fetchingDataset: true
    });

    searchDatasets({ q: value }).then(response => {
      this.setState({
        [type]: response.data.results,
        fetchingDataset: false
      });
    }).catch(() => {
      this.setState({ fetchingDataset: false });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataset, classes, intl, licenses, languages, handleHomepage } = this.props;
    const { types, subtypes, frequencies, organizations, installations, duplicates, parents } = this.state;
    const { fetchingOrg, fetchingInst, fetchingDataset } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="type" defaultMessage="Type"/>}
          >
            {getFieldDecorator('type', {
              initialValue: (dataset && dataset.type) || types[0]
            })(
              <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}>
                {types.map(type => (
                  <Option value={type} key={type}>
                    <FormattedMessage id={type}/>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="subtype" defaultMessage="Subtype"/>}
          >
            {getFieldDecorator('subtype', {
              initialValue: dataset ? dataset.subtype : undefined
            })(
              <Select placeholder={<FormattedMessage id="select.subtype" defaultMessage="Select a subtype"/>}>
                {subtypes.map(subtype => (
                  <Option value={subtype} key={subtype}>{subtype}</Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="external" defaultMessage="External"/>}
          >
            {getFieldDecorator('disabled', {
              initialValue: dataset && dataset.external ? dataset.external : false
            })(
              <Checkbox style={{ fontSize: '10px' }}>
                <FormattedMessage
                  id="externalTip"
                  defaultMessage="Indicates that the dataset is found through integration with metadata networks, and not registered directly with GBIF"
                />
              </Checkbox>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="license" defaultMessage="License"/>}
          >
            {getFieldDecorator('license', {
              initialValue: dataset ? dataset.license : undefined,
              rules: [
                {
                  required: true,
                  message: <FormattedMessage id="provide.license" defaultMessage="Please provide a license"/>
                }
              ]
            })(
              <Select placeholder={<FormattedMessage id="select.license" defaultMessage="Select a license"/>}>
                {licenses.map(license => (
                  <Option value={license} key={license}>{prettifyLicense(license)}</Option>
                ))}
              </Select>
            )}
            <div>
              <Badge
                count={intl.formatMessage({ id: 'important', defaultMessage: 'Important' })}
                className={classes.important}
              />
              <FormattedMessage
                id="datasetLicenseWarning"
                defaultMessage="Changing this will update all occurrence records"
              />
            </div>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="lockAutoUpdates" defaultMessage="Lock auto updates"/>}
          >
            {getFieldDecorator('disabled', {
              initialValue: dataset && dataset.lockedForAutoUpdate ? dataset.lockedForAutoUpdate : false
            })(
              <Checkbox style={{ fontSize: '10px' }}>
                <FormattedMessage
                  id="lockedForAutoUpdateTip"
                  defaultMessage="Controls permissions for crawlers updating metadata, contacts etc"
                />
              </Checkbox>
            )}
            <div>
              <Badge
                count={intl.formatMessage({ id: 'important', defaultMessage: 'Important' })}
                className={classes.important}
              />
              <FormattedMessage
                id="datasetAutoUpdateWarning"
                defaultMessage="Use with caution - disables automated updates"
              />
            </div>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="title" defaultMessage="Title"/>}
          >
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

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="doi" defaultMessage="Digital Object Identifier"/>}
          >
            {getFieldDecorator('doi', {
              initialValue: dataset && dataset.doi,
              rules: [{
                required: true,
                message: <FormattedMessage id="provide.doi" defaultMessage="Please provide a DOI"/>
              }]
            })(
              <Input/>
            )}
            <div>
              <Badge
                count={intl.formatMessage({ id: 'important', defaultMessage: 'Important' })}
                className={classes.important}
              />
              <FormattedMessage
                id="datasetDOIWarning"
                defaultMessage="Changes should be made understanding the consequences"
              />
            </div>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="description" defaultMessage="Description"/>}
          >
            {getFieldDecorator('description', {
              initialValue: dataset && dataset.description
            })(
              <TextArea rows={4}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="publishingOrganization" defaultMessage="Publishing organization"/>}
            extra={<FormattedMessage
              id="publishingOrgExtra"
              defaultMessage="It is expected that this may be changed occasionally, but be vigilant in changes as this has potential to spawn significant processing for occurrence records, metrics and maps"
            />}
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
            <div>
              <Badge
                count={intl.formatMessage({ id: 'important', defaultMessage: 'Important' })}
                className={classes.important}
              />
              <FormattedMessage
                id="publishingOrganizationWarning"
                defaultMessage="Changing this will update hosting organization on all occurrence records."
              />
            </div>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="installation" defaultMessage="Installation"/>}
            extra={<FormattedMessage
              id="installationExtra"
              defaultMessage="It is expected that this may be changed occasionally, but be vigilant in changes as this has potential to spawn significant processing for occurrence records, metrics. Please verify the services are as expected on change"
            />}
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
            <div>
              <Badge
                count={intl.formatMessage({ id: 'important', defaultMessage: 'Important' })}
                className={classes.important}
              />
              <FormattedMessage
                id="instWarning"
                defaultMessage="It is expected that this may be changed occasionally, but be vigilant in changes as this has potential to spawn significant processing for occurrence records, metrics. Please verify the services are as expected on change"
              />
            </div>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="parentDataset" defaultMessage="Parent dataset"/>}
            extra={<FormattedMessage
              id="parentDatasetExtra"
              defaultMessage="For use in declaring dataset relationships, such as the constituent parts of the Catalogue of Life"
            />}
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
            {...formItemLayout}
            label={<FormattedMessage id="duplicateDataset" defaultMessage="Duplicate Dataset"/>}
            extra={<FormattedMessage
              id="duplicateDatasetExtra"
              defaultMessage="When a dataset is found to be a duplicate of another, then it should be updated. This will effectively trigger a de-index which is the same as a deletion. It may be that you ALSO need to set the parent dataset if this has been aggregated."
            />}
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
            <div>
              <Badge
                count={intl.formatMessage({ id: 'important', defaultMessage: 'Important' })}
                className={classes.important}
              />
              <FormattedMessage
                id="duplicateDatasetWarning"
                defaultMessage="Changing this will DELETE all occurrence records"
              />
            </div>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}
          >
            {getFieldDecorator('homepage', {
              initialValue: dataset && dataset.homepage,
              rules: [{
                validator: handleHomepage
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>}
          >
            {getFieldDecorator('logoUrl', { initialValue: dataset && dataset.logoUrl })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="language" defaultMessage="Language"/>}
          >
            {getFieldDecorator('language', {
              initialValue: dataset ? dataset.language : undefined,
              rules: [{
                required: true, message: 'Please provide a language'
              }]
            })(
              <Select
                showSearch
                optionFilterProp="children"
                placeholder={<FormattedMessage id="select.language" defaultMessage="Select a language"/>}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {languages.map(language => (
                  <Option value={language} key={language}>{language}</Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="updateFrequency" defaultMessage="Update frequency"/>}
            extra={<FormattedMessage
              id="updateFrequencyExtra"
              defaultMessage="The frequency with which changes and additions are made"
            />}
          >
            {getFieldDecorator('maintenanceUpdateFrequency', { initialValue: dataset ? dataset.maintenanceUpdateFrequency : undefined })(
              <Select
                placeholder={<FormattedMessage id="select.updateFrequency" defaultMessage="Select an update frequency"/>}
              >
                {frequencies.map(frequency => (
                  <Option value={frequency} key={frequency}>{frequency}</Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="alias" defaultMessage="Alias"/>}
          >
            {getFieldDecorator('alias', { initialValue: dataset && dataset.alias })(
              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="abbreviation" defaultMessage="Abbreviation"/>}
          >
            {getFieldDecorator('abbreviation', { initialValue: dataset && dataset.abbreviation })(
              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="citation" defaultMessage="Citation"/>}
          >
            {getFieldDecorator('citation.text', { initialValue: dataset && dataset.citation.text })(
              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="citationIdentifier" defaultMessage="Citation identifier"/>}
          >
            {getFieldDecorator('citation.identifier', { initialValue: dataset && dataset.citation.identifier })(
              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="rights" defaultMessage="Rights"/>}
          >
            {getFieldDecorator('rights', {
              initialValue: dataset && dataset.rights
            })(
              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              {dataset ?
                <FormattedMessage id="update" defaultMessage="Update"/> :
                <FormattedMessage id="create" defaultMessage="Create"/>
              }
            </Button>
          </FormItem>
        </Form>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ licenses, languages, addError }) => ({ licenses, languages, addError });

const WrappedDatasetForm = Form.create()(withContext(mapContextToProps)(injectIntl(injectSheet(styles)(formValidationWrapper(DatasetForm)))));
export default WrappedDatasetForm;
