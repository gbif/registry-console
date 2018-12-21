import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Form, Input, Row, Select, Switch } from 'antd';

import { search } from '../../../api/node';
import { createOrganization, updateOrganization } from '../../../api/organization';
import { TagControl, FilteredSelectControl } from '../../widgets';
import formValidationWrapper from '../../hoc/formValidationWrapper';
import withContext from '../../hoc/withContext';
import { formItemLayout } from '../../../config/config';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

class OrganizationForm extends Component {
  constructor(props) {
    super(props);

    const { organization } = props;
    const nodes = organization && organization.endorsingNode ? [organization.endorsingNode] : [];

    this.state = {
      fetching: false,
      nodes
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // if (this.props.organization && !this.props.form.isFieldsTouched()) {
    //   return;
    // }

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

    if (!user.roles.includes('REGISTRY_ADMIN')) {
      // if a user is not an ADMIN but has an access to create an organization, we already have all his Nodes
      this.setState({
        nodes: user.editorRoleScopeItems.filter(item => item.type === 'node')
      });
    } else {
      if (!value) {
        this.setState({ nodes: [] });
        return;
      }

      this.setState({ fetching: true });

      search({ q: value }).then(response => {
        this.setState({
          nodes: response.data.results,
          fetching: false
        });
      });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { organization, languages, countries, handleEmail, handlePhone, handleHomepage } = this.props;
    const { nodes, fetching } = this.state;

    return (
      <React.Fragment>
        <p className="help">
          <FormattedMessage
            id="orgOverviewInfo"
            defaultMessage="This information appears on the organization profile, organization pages, search results, and beyond."
          />
        </p>

        <Form onSubmit={this.handleSubmit} layout={'vertical'}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="title" defaultMessage="Title"/>}
            extra={<FormattedMessage
              id="extra.orgTitle"
              defaultMessage="Enter an accurate organization title as it is used in many key places."
            />}
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
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="abbreviation" defaultMessage="Abbreviation"/>}
          >
            {getFieldDecorator('abbreviation', {
              initialValue: organization && organization.abbreviation
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="description" defaultMessage="Description"/>}
          >
            {getFieldDecorator('description', {
              initialValue: organization && organization.description
            })(
              <TextArea rows={4}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="endorsingNode" defaultMessage="Endorsing node"/>}
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

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="endorsementApproved" defaultMessage="Endorsement approved"/>}
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
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}
          >
            {getFieldDecorator('homepage', {
              initialValue: organization && organization.homepage,
              defaultValue: [],
              rules: [{
                validator: handleHomepage
              }]
            })(
              <TagControl label={<FormattedMessage id="newHomepage" defaultMessage="New homepage"/>} removeAll={true}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>}
          >
            {getFieldDecorator('logoUrl', {
              initialValue: organization && organization.logoUrl
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="language" defaultMessage="Language"/>}
          >
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

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="address" defaultMessage="Address"/>}
          >
            {getFieldDecorator('address', {
              initialValue: organization && organization.address,
              defaultValue: []
            })(
              <TagControl label={<FormattedMessage id="newAddress" defaultMessage="New address"/>} removeAll={true}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="city" defaultMessage="City"/>}
          >
            {getFieldDecorator('city', {
              initialValue: organization && organization.city
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="province" defaultMessage="Province"/>}
          >
            {getFieldDecorator('province', {
              initialValue: organization && organization.province
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="country" defaultMessage="Country"/>}
          >
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

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}
          >
            {getFieldDecorator('postalCode', {
              initialValue: organization && organization.postalCode
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="email" defaultMessage="Email"/>}
          >
            {getFieldDecorator('email', {
              initialValue: organization && organization.email,
              defaultValue: [],
              rules: [{
                validator: handleEmail
              }]
            })(
              <TagControl label={<FormattedMessage id="newEmail" defaultMessage="New email"/>} removeAll={true}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="phone" defaultMessage="Phone"/>}
          >
            {getFieldDecorator('phone', {
              initialValue: organization && organization.phone,
              defaultValue: [],
              rules: [{
                validator: handlePhone
              }]
            })(
              <TagControl label={<FormattedMessage id="newPhone" defaultMessage="New phone"/>} removeAll={true}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="latitude" defaultMessage="Latitude"/>}
          >
            {getFieldDecorator('latitude', {
              initialValue: organization && organization.latitude
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="longitude" defaultMessage="Longitude"/>}
          >
            {getFieldDecorator('longitude', {
              initialValue: organization && organization.longitude
            })(
              <Input/>
            )}
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={this.props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit">
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

const mapContextToProps = ({ countries, languages, addError, user }) => ({ countries, languages, addError, user });

const WrappedOrganizationForm = Form.create()(withContext(mapContextToProps)(formValidationWrapper(OrganizationForm)));
export default WrappedOrganizationForm;