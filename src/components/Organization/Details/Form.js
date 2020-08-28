import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Col, Form, Input, Row, Select, Switch } from 'antd';
import PropTypes from 'prop-types';

// APIs
import { getNodeSuggestions } from '../../../api/node';
import { createOrganization, updateOrganization } from '../../../api/organization';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { TagControl, FilteredSelectControl, FormItem, MapComponent } from '../../common';
// Helpers
import { validateEmail, validatePhone, validateUrl } from '../../util/validators';

import { hasRole } from '../../auth';

const TextArea = Input.TextArea;
const Option = Select.Option;

class OrganizationForm extends Component {
  constructor(props) {
    super(props);

    const { organization, user } = props;
    let nodes;
    // If a user is not an ADMIN and has a permission to create new organization
    // then we should pre-fill list of available nodes from the list
    // that we've requested on app load
    if (hasRole(user, 'REGISTRY_EDITOR') && !hasRole(user, 'REGISTRY_ADMIN')) {
      nodes = user._editorRoleScopeItems.filter(item => item.type === 'NODE').map(item => item.data);
    } else {
      nodes = organization && organization.endorsingNode ? [organization.endorsingNode] : [];
    }

    this.state = {
      fetching: false,
      nodes
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.props.organization) {
          createOrganization(values)
            .then(response => this.props.onSubmit(response.data))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updateOrganization({ ...this.props.organization, ...values })
            .then(() => this.props.onSubmit())
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      }
    });
  };

  handleSearch = value => {
    const { user } = this.props;

    // if a user is not an ADMIN but has an access to create an organization, we already have all his Nodes
    if (user.roles.includes('REGISTRY_ADMIN')) {
      if (!value) {
        this.setState({ nodes: [] });
        return;
      }

      this.setState({ fetching: true });

      getNodeSuggestions({ q: value }).then(response => {
        this.setState({
          nodes: response.data,
          fetching: false
        });
      });
    }
  };

  getCoordinates = (latitude, longitude) => {
    const { form } = this.props;

    form.setFieldsValue({ latitude, longitude });
  };

  render() {
    const { organization, languages, countries, form, intl } = this.props;
    const { getFieldDecorator } = form;
    const { nodes, fetching } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label={<FormattedMessage id="title" defaultMessage="Title"/>}
            helpText={
              <FormattedMessage
                id="help.orgTitle"
                defaultMessage="Enter an accurate organization title as it is used in many key places."
              />
            }
          >
            {getFieldDecorator('title', {
              initialValue: organization && organization.title,
              rules: [{
                required: true, message: <FormattedMessage id="provide.title" defaultMessage="Please provide a title"/>
              }]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label={<FormattedMessage id="abbreviation" defaultMessage="Abbreviation"/>}>
            {getFieldDecorator('abbreviation', { initialValue: organization && organization.abbreviation })(
              <Input/>
            )}
          </FormItem>
          <FormItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            {getFieldDecorator('description', {
                initialValue: organization && organization.description,
                rules: [{
                  required: !organization,
                }]
              })(
              <TextArea rows={4}/>
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="endorsingNode" defaultMessage="Endorsing node"/>}
            warning={
              <FormattedMessage
                id="warning.endorsingNode"
                defaultMessage="The node that has verified the organization should publish through GBIF"
              />
            }
            isNew={!organization}
          >
            {getFieldDecorator('endorsingNodeKey', {
              initialValue: organization ? organization.endorsingNodeKey : undefined,
              rules: [{
                required: true,
                message: <FormattedMessage
                  id="provide.endorsingNode"
                  defaultMessage="Please provide an endorsing node"
                />
              }]
            })(
              <FilteredSelectControl
                placeholder={<FormattedMessage
                  id="select.endorsingNode"
                  defaultMessage="Select an endorsing node"
                />}
                search={this.handleSearch}
                fetching={fetching}
                items={nodes}
                delay={1000}
              />
            )}
          </FormItem>

{/*           <FormItem
            label={<FormattedMessage id="endorsementApproved" defaultMessage="Endorsement approved"/>}
            warning={
              <FormattedMessage
                id="warning.endorsementApproved"
                defaultMessage="Has the endorsement been approved?"
              />
            }
            isNew={!organization}
          >
            {getFieldDecorator('endorsementApproved', {
              initialValue: organization && organization.endorsementApproved,
              defaultValue: false
            })(
              <Switch
                checkedChildren={<FormattedMessage id="approved" defaultMessage="Approved"/>}
                unCheckedChildren={<FormattedMessage id="awaitingApproval" defaultMessage="Awaiting approval"/>}
                defaultChecked={organization && organization.endorsementApproved}
              />
            )}
          </FormItem> */}

          <FormItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            {getFieldDecorator('homepage', {
              initialValue: organization && organization.homepage,
              defaultValue: [],
              rules: [{
                validator: validateUrl(<FormattedMessage id="invalid.homepage" defaultMessage="Homepage is invalid"/>)
              }]
            })(
              <TagControl label={<FormattedMessage id="newHomepage" defaultMessage="New homepage"/>} removeAll={true}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>}>
            {getFieldDecorator('logoUrl', {
              initialValue: organization && organization.logoUrl,
              rules: [{
                validator: validateUrl(
                  <FormattedMessage id="invalid.url.logo" defaultMessage="Logo url is invalid"/>
                )
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="language" defaultMessage="Language"/>}>
            {getFieldDecorator('language', {
              initialValue: organization ? organization.language : undefined,
              rules: [{
                required: true,
                message: <FormattedMessage id="provide.language" defaultMessage="Please provide a language"/>
              }]
            })(
              <Select
                showSearch
                optionFilterProp="children"
                placeholder={<FormattedMessage id="select.language" defaultMessage="Select a language"/>}
                filterOption={
                  (input, option) => {
                    // We need to translate language code before we'll be able to compare it with input
                    const langTranslation = intl.formatMessage({
                      id: option.props.children.props.id,
                      defaultMessage: ''
                    });
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
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="address" defaultMessage="Address"/>}>
            {getFieldDecorator('address', {
              initialValue: organization && organization.address,
              defaultValue: [],
              rules: [{
                required: !organization
              }]
            })(
              <TagControl label={<FormattedMessage id="newAddress" defaultMessage="New address"/>} removeAll={true}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="city" defaultMessage="City"/>}>
            {getFieldDecorator('city', {
                initialValue: organization && organization.city,
                rules: [{
                  required: !organization,
                }]
              })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="province" defaultMessage="Province"/>}>
            {getFieldDecorator('province', {
                initialValue: organization && organization.province,
                rules: [{
                  required: !organization,
                }]
              })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
            {getFieldDecorator('country', {
                initialValue: organization ? organization.country : undefined,
                rules: [{
                  required: !organization,
                }]
              })(
              <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
                {countries.map(country => (
                  <Option value={country} key={country}>
                    <FormattedMessage id={`country.${country}`}/>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
            {getFieldDecorator('postalCode', { 
                initialValue: organization && organization.postalCode,
                rules: [{
                  required: !organization
                }]
              })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
            {getFieldDecorator('email', {
              initialValue: organization && organization.email,
              defaultValue: [],
              rules: [{
                required: !organization,
                validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid"/>)
              }]
            })(
              <TagControl label={<FormattedMessage id="newEmail" defaultMessage="New email"/>} removeAll={true}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="phone" defaultMessage="Phone"/>}>
            {getFieldDecorator('phone', {
              initialValue: organization && organization.phone,
              defaultValue: [],
              rules: [{
                validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid"/>)
              }]
            })(
              <TagControl label={<FormattedMessage id="newPhone" defaultMessage="New phone"/>} removeAll={true}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="latitude" defaultMessage="Latitude"/>}>
            {getFieldDecorator('latitude', { initialValue: organization && organization.latitude })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="longitude" defaultMessage="Longitude"/>}>
            {getFieldDecorator('longitude', { initialValue: organization && organization.longitude })(
              <Input/>
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

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={this.props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit" disabled={organization && !form.isFieldsTouched()}>
                {organization ?
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
}

OrganizationForm.propTypes = {
  organization: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ countries, languages, addError, user }) => ({ countries, languages, addError, user });

const WrappedOrganizationForm = Form.create()(withContext(mapContextToProps)(injectIntl(OrganizationForm)));
export default WrappedOrganizationForm;