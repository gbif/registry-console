import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Input, Select, Checkbox, Col, Row } from 'antd';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';

// APIs
import { updateUser, getRoles } from '../../../api/user';
import { getNodeSuggestions } from '../../../api/node';
import { getOrgSuggestions } from '../../../api/organization';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FilteredSelectControl, FormItem } from '../../common';
// Helpers
import { validateEmail } from '../../util/validators';

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const styles = {
  customGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    '& .ant-checkbox-group-item': {
      flex: '50%',
      margin: 0
    }
  }
};

class UserForm extends Component {
  state = {
    roles: [],
    nodes: [],
    organizations: [],
    fetchingNodes: false,
    fetchingOrganizations: false
  };

  componentDidMount() {
    getRoles().then(response => {
      this.setState({ roles: response.data });
    });
  }

  handleNodeSearch = value => {
    if (!value) {
      this.setState({ nodes: [] });
      return;
    }

    this.setState({ fetchingNodes: true });

    getNodeSuggestions({ q: value }).then(response => {
      this.setState({
        nodes: response.data,
        fetchingNodes: false
      });
    });
  };

  handleOrganizationSearch = value => {
    if (!value) {
      this.setState({ organizations: [] });
      return;
    }

    this.setState({ fetchingOrganizations: true });

    getOrgSuggestions({ q: value }).then(response => {
      this.setState({
        organizations: response.data,
        fetchingOrganizations: false
      });
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // Removing unnecessary data and copying role scopes to one field
        const data = _cloneDeep(values);
        delete data.organizationScopes;
        delete data.nodeScopes;
        data.editorRoleScopes = [...values.organizationScopes, ...values.nodeScopes];

        updateUser(data)
          .then(() => this.props.onSubmit())
          .catch(error => {
            this.props.addError({ status: error.response.status, statusText: error.response.data });
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { user, countries, classes } = this.props;
    const { roles, nodes, organizations, fetchingNodes, fetchingOrganizations } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label={<FormattedMessage id="userName" defaultMessage="Username"/>}
            helpText={
              <FormattedMessage
                id="help.userName"
                defaultMessage="You can log in using a username or an email address."
              />
            }
          >
            {getFieldDecorator('userName', { initialValue: user && user.userName })(
              <Input disabled={true}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
            {getFieldDecorator('email', {
              initialValue: user && user.email,
              rules: [{
                validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid"/>)
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="firstName" defaultMessage="First name"/>}>
            {getFieldDecorator('firstName', { initialValue: user && user.firstName })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}>
            {getFieldDecorator('lastName', { initialValue: user && user.lastName })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="country" defaultMessage="Country"/>}
            helpText={
              <FormattedMessage
                id="help.reportingPurposes"
                defaultMessage="This is used for reporting purposes"
              />
            }
          >
            {getFieldDecorator('settings.country', { initialValue: user ? user.settings.country : undefined })(
              <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
                {countries.map(country => (
                  <Option value={country} key={country}>
                    <FormattedMessage id={`country.${country}`}/>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="roles" defaultMessage="Roles"/>}>
            {getFieldDecorator('roles', { initialValue: user && user.roles })(
              <CheckboxGroup className={classes.customGroup} options={roles}/>
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="nodeScopes" defaultMessage="Node scopes"/>}
          >
            {getFieldDecorator('nodeScopes', {
              initialValue: user && user.editorRoleScopes
            })(
              <FilteredSelectControl
                mode="multiple"
                placeholder={<FormattedMessage
                  id="select.node"
                  defaultMessage="Select a node"
                />}
                search={this.handleNodeSearch}
                fetching={fetchingNodes}
                items={nodes}
                delay={1000}
              />
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="organizationScopes" defaultMessage="Organization scopes"/>}
          >
            {getFieldDecorator('organizationScopes', {
              initialValue: user && user.editorRoleScopes
            })(
              <FilteredSelectControl
                mode="multiple"
                placeholder={<FormattedMessage
                  id="select.organization"
                  defaultMessage="Select an organization"
                />}
                search={this.handleOrganizationSearch}
                fetching={fetchingOrganizations}
                items={organizations}
                delay={1000}
              />
            )}
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={this.props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="save" defaultMessage="Save"/>
              </Button>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

UserForm.propTypes = {
  user: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ countries, addError }) => ({ countries, addError });

const WrappedOrganizationForm = Form.create()(withContext(mapContextToProps)(injectSheet(styles)(UserForm)));
export default WrappedOrganizationForm;