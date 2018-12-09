import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Input, Select, Button, Checkbox, Badge, AutoComplete } from 'antd';

import { AppContext } from '../../App';
import { createDataset, updateDataset } from '../../../api/dataset';
import { search as searchOrganizations } from '../../../api/organization';
import { search as searchInstallations } from '../../../api/installation';
import { searchDatasets } from '../../../api/dataset';
import { getDatasetSubtypes, getDatasetTypes, getMaintenanceUpdateFrequencies } from '../../../api/enumeration';
import { arrayToString, prepareData } from '../../../api/util/helpers';
import { prettifyDatasetType, prettifyLicense } from '../../../api/util/prettifiers';

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

class DatasetForm extends React.Component {
  state = {
    confirmDirty: false,
    types: [],
    subtypes: [],
    frequencies: [],
    installations: this.props.dataset && this.props.dataset.installation ? [this.props.dataset.installation] : [],
    duplicates: [],
    parents: [],
    organizations: []
  };

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
        const preparedData = prepareData(values);

        if (!this.props.dataset) {
          createDataset(preparedData).then(response => {
            this.props.onSubmit(response.data);
          });
        } else {
          updateDataset({ ...this.props.dataset, ...preparedData })
            .then(this.props.onSubmit);
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

    searchOrganizations({ q: value }).then(response => {
      this.setState({
        organizations: response.data.results
      });
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

    searchInstallations({ q: value }).then(response => {
      this.setState({
        installations: response.data.results
      });
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

    searchDatasets({ q: value }).then(response => {
      this.setState({
        [type]: response.data.results
      });
    });
  };

  // handleConfirmBlur = (e) => {
  //   const value = e.target.value;
  //   this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  // };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataset } = this.props;
    const { types, subtypes, frequencies, organizations, installations, duplicates, parents } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="type" defaultMessage="Type"/>}
          >
            {getFieldDecorator('type', {
              initialValue: dataset && dataset.type,
              rules: [
                { required: true, message: 'Please select a type' }
              ]
            })(
              <Select placeholder="None selected">
                {types.map(type => (
                  <Option value={type} key={type}>{prettifyDatasetType(type)}</Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="subtype" defaultMessage="Subtype"/>}
          >
            {getFieldDecorator('subtype', {
              initialValue: dataset && dataset.subtype,
              rules: [
                { required: true, message: 'Please select a subtype' }
              ]
            })(
              <Select placeholder="None selected">
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
            {getFieldDecorator('disabled', { initialValue: dataset && dataset.external })(
              <Checkbox style={{ fontSize: '10px' }}>
                <FormattedMessage
                  id="externalTip"
                  defaultMessage="Indicates that the dataset is found through integration with metadata networks, and not registered directly with GBIF"
                />
              </Checkbox>
            )}
          </FormItem>

          <AppContext.Consumer>
            {({ licenses }) => (
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="license" defaultMessage="License"/>}
              >
                {getFieldDecorator('license', {
                  initialValue: dataset && dataset.license,
                  rules: [
                    { required: true, message: 'Please select a license' }
                  ]
                })(
                  <Select placeholder="None selected">
                    {licenses.map(license => (
                      <Option value={license} key={license}>{prettifyLicense(license)}</Option>
                    ))}
                  </Select>
                )}
                <div>
                  <Badge count="Important" style={{ backgroundColor: '#b94a48', marginRight: '10px' }}/>
                  <FormattedMessage
                    id="datasetLicenseWarning"
                    defaultMessage="Changing this will update all occurrence records"
                  />
                </div>
              </FormItem>
            )}
          </AppContext.Consumer>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="lockAutoUpdates" defaultMessage="Lock auto updates"/>}
          >
            {getFieldDecorator('disabled', { initialValue: dataset && dataset.lockedForAutoUpdate })(
              <Checkbox style={{ fontSize: '10px' }}>
                <FormattedMessage
                  id="lockedForAutoUpdateTip"
                  defaultMessage="Controls permissions for crawlers updating metadata, contacts etc"
                />
              </Checkbox>
            )}
            <div>
              <Badge count="Important" style={{ backgroundColor: '#b94a48', marginRight: '10px' }}/>
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
                required: true, message: 'Please provide a title'
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="doi" defaultMessage="DOI"/>}
          >
            {getFieldDecorator('doi', {
              initialValue: dataset && dataset.doi,
              rules: [{
                required: true, message: 'Please specify a DOI'
              }]
            })(
              <Input/>
            )}
            <div>
              <Badge count="Important" style={{ backgroundColor: '#b94a48', marginRight: '10px' }}/>
              <FormattedMessage
                id="datasetDOIWarning"
                defaultMessage="Changes should be made understanding the consequences"
              />
            </div>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="alias" defaultMessage="Alias"/>}
          >
            {getFieldDecorator('alias', {
              initialValue: dataset && dataset.alias
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="abbreviation" defaultMessage="Abbreviation"/>}
          >
            {getFieldDecorator('abbreviation', {
              initialValue: dataset && dataset.abbreviation
            })(
              <Input/>
            )}
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
            {getFieldDecorator('organizationKey', {
              initialValue: dataset.publishingOrganization.title
            })(
              <AutoComplete onSearch={this.handleOrgSearch}>
                {organizations.map(organization =>
                  <AutoComplete.Option key={organization.key}>{organization.title}</AutoComplete.Option>)
                }
              </AutoComplete>
            )}
            <div>
              <Badge count="Important" style={{ backgroundColor: '#b94a48', marginRight: '10px' }}/>
              <FormattedMessage id="publishingOrganizationWarning"
                                defaultMessage="Changing this will update hosting organization on all occurrence records."/>
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
              initialValue: dataset.installationKey,
            })(
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="None selected"
                filterOption={false}
                onSearch={this.handleInstSearch}
              >
                {installations.map(installation => (
                  <Option value={installation.key} key={installation.key}>{installation.title}</Option>
                ))}
              </Select>
            )}
            <div>
              <Badge count="Important" style={{ backgroundColor: '#b94a48', marginRight: '10px' }}/>
              <FormattedMessage id="publishingOrganizationWarning"
                                defaultMessage="Changing this will update hosting organization on all occurrence records."/>
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
            {getFieldDecorator('parentDatasetKey', {
              initialValue: dataset && dataset.parentDataset ? dataset.parentDataset.title : null
            })(
              <AutoComplete onSearch={value => this.handleDatasetSearch(value, 'parents')}>
                {parents.map(parent =>
                  <AutoComplete.Option key={parent.key}>{parent.title}</AutoComplete.Option>)
                }
              </AutoComplete>
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
            {getFieldDecorator('duplicateDatasetKey', {
              initialValue: dataset && dataset.duplicateDataset ? dataset.duplicateDataset.title : null
            })(
              <AutoComplete onSearch={value => this.handleDatasetSearch(value, 'duplicates')}>
                {duplicates.map(duplicate =>
                  <AutoComplete.Option key={duplicate.key}>{duplicate.title}</AutoComplete.Option>)
                }
              </AutoComplete>
            )}
            <div>
              <Badge count="Important" style={{ backgroundColor: '#b94a48', marginRight: '10px' }}/>
              <FormattedMessage id="duplicateDatasetWarning"
                                defaultMessage="Changing this will DELETE all occurrence records"/>
            </div>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="citation" defaultMessage="Citation"/>}
          >
            {getFieldDecorator('citation', {
              initialValue: dataset && dataset.citation
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="citationIdentifier" defaultMessage="Citation identifier"/>}
          >
            {getFieldDecorator('citationIdentifier', {
              initialValue: dataset && dataset.citationIdentifier
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="rights" defaultMessage="Rights"/>}
          >
            {getFieldDecorator('rights', {
              initialValue: dataset && dataset.rights
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}
          >
            {getFieldDecorator('homepage', {
              initialValue: dataset && arrayToString(dataset.homepage)
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>}
          >
            {getFieldDecorator('logoUrl', {
              initialValue: dataset && dataset.logoUrl
            })(
              <Input/>
            )}
          </FormItem>

          <AppContext.Consumer>
            {({ languages }) => (
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="language" defaultMessage="Language"/>}
              >
                {getFieldDecorator('language', {
                  initialValue: dataset && dataset.language,
                  rules: [{
                    required: true, message: 'Please provide a language'
                  }]
                })(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="None selected"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {languages.map(language => (
                      <Option value={language} key={language}>{language}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}
          </AppContext.Consumer>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="updateFrequency" defaultMessage="Update frequency"/>}
            extra={<FormattedMessage
              id="updateFrequencyExtra"
              defaultMessage="The frequency with which changes and additions are made"
            />}
          >
            {getFieldDecorator('subtype', {
              initialValue: dataset && dataset.maintenanceUpdateFrequency
            })(
              <Select placeholder="None selected">
                {frequencies.map(frequency => (
                  <Option value={frequency} key={frequency}>{frequency}</Option>
                ))}
              </Select>
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

const WrappedDatasetForm = Form.create()(DatasetForm);
export default WrappedDatasetForm;
