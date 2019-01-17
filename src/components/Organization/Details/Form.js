import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Form, Input, Row, Select, Switch } from 'antd';
import PropTypes from 'prop-types';

// APIs
import { getNodeSuggestions } from '../../../api/node';
import { createOrganization, updateOrganization } from '../../../api/organization';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { TagControl, FilteredSelectControl, FormItem } from '../../common';
// Helpers
import { validateEmail, validatePhone, validateUrl } from '../../helpers';

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

  render() {
    const { organization, languages, countries, form, modal } = this.props;
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
            modal={modal}
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
          <FormItem label={<FormattedMessage id="abbreviation" defaultMessage="Abbreviation"/>} modal={modal}>
            {getFieldDecorator('abbreviation', { initialValue: organization && organization.abbreviation })(
              <Input/>
            )}
          </FormItem>
          <FormItem label={<FormattedMessage id="description" defaultMessage="Description"/>} modal={modal}>
            {getFieldDecorator('description', { initialValue: organization && organization.description })(
              <TextArea rows={4}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="endorsingNode" defaultMessage="Endorsing node"/>} modal={modal}>
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

          <FormItem label={<FormattedMessage id="endorsementApproved" defaultMessage="Endorsement approved"/>} modal={modal}>
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
          </FormItem>

          <FormItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>} modal={modal}>
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

          <FormItem label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>} modal={modal}>
            {getFieldDecorator('logoUrl', { initialValue: organization && organization.logoUrl })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="language" defaultMessage="Language"/>} modal={modal}>
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
                  (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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

          <FormItem label={<FormattedMessage id="address" defaultMessage="Address"/>} modal={modal}>
            {getFieldDecorator('address', {
              initialValue: organization && organization.address,
              defaultValue: []
            })(
              <TagControl label={<FormattedMessage id="newAddress" defaultMessage="New address"/>} removeAll={true}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="city" defaultMessage="City"/>} modal={modal}>
            {getFieldDecorator('city', { initialValue: organization && organization.city })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="province" defaultMessage="Province"/>} modal={modal}>
            {getFieldDecorator('province', { initialValue: organization && organization.province })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="country" defaultMessage="Country"/>} modal={modal}>
            {getFieldDecorator('country', { initialValue: organization ? organization.country : undefined })(
              <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
                {countries.map(country => (
                  <Option value={country} key={country}>
                    <FormattedMessage id={`country.${country}`}/>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>} modal={modal}>
            {getFieldDecorator('postalCode', { initialValue: organization && organization.postalCode })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="email" defaultMessage="Email"/>} modal={modal}>
            {getFieldDecorator('email', {
              initialValue: organization && organization.email,
              defaultValue: [],
              rules: [{
                validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid"/>)
              }]
            })(
              <TagControl label={<FormattedMessage id="newEmail" defaultMessage="New email"/>} removeAll={true}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="phone" defaultMessage="Phone"/>} modal={modal}>
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

          <FormItem label={<FormattedMessage id="latitude" defaultMessage="Latitude"/>} modal={modal}>
            {getFieldDecorator('latitude', { initialValue: organization && organization.latitude })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="longitude" defaultMessage="Longitude"/>} modal={modal}>
            {getFieldDecorator('longitude', { initialValue: organization && organization.longitude })(
              <Input/>
            )}
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={this.props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit" disabled={organization && !form.isFieldsTouched()}>
                {organization ?
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

OrganizationForm.propTypes = {
  organization: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired
};

const mapContextToProps = ({ countries, languages, addError, user }) => ({ countries, languages, addError, user });

const WrappedOrganizationForm = Form.create()(withContext(mapContextToProps)(OrganizationForm));
export default WrappedOrganizationForm;