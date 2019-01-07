import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Input, Select, Checkbox, Col, Row } from 'antd';
import PropTypes from 'prop-types';

// APIs
import { createInstallation, updateInstallation } from '../../../api/installation';
import { search } from '../../../api/organization';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FilteredSelectControl, FormItem } from '../../widgets';
// Helpers
import { getPermittedOrganizations } from '../../helpers';

const TextArea = Input.TextArea;

class InstallationForm extends Component {
  constructor(props) {
    super(props);

    const { installation } = props;
    const organizations = installation && installation.organization ? [installation.organization] : [];

    this.state = {
      fetching: false,
      organizations
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.props.installation) {
          createInstallation(values)
            .then(response => this.props.onSubmit(response.data))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updateInstallation({ ...this.props.installation, ...values })
            .then(() => this.props.onSubmit())
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      }
    });
  };

  handleSearch = value => {
    if (!value || value.length < 4) {
      return;
    }

    this.setState({ fetching: true });

    search({ q: value }).then(response => {
      this.setState({
        organizations: getPermittedOrganizations(this.props.user, response.data.results),
        fetching: false
      });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { installation, installationTypes } = this.props;
    const isNew = installation === null;
    const { organizations, fetching } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label={<FormattedMessage id="title" defaultMessage="Title"/>}
            helpText={
              <FormattedMessage
                id="help.instTitle"
                defaultMessage="Enter an accurate installation title as it is used in many key places."
              />
            }
          >
            {getFieldDecorator('title', {
              initialValue: installation && installation.title,
              rules: [{
                required: true,
                message: <FormattedMessage id="provide.title" defaultMessage="Please provide a title"/>
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="description" defaultMessage="Description"/>}
            helpText={
              <FormattedMessage
                id="help.instDescription"
                defaultMessage="Provide a meaningful description of the installation, so a user will understand what the installation is."
              />
            }
          >
            {getFieldDecorator('description', { initialValue: installation && installation.description })(
              <TextArea rows={4}/>
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="publishingOrganization" defaultMessage="Publishing organization"/>}
            helpText={
              <FormattedMessage
                id="help.instPublishingOrg"
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
            {getFieldDecorator('organizationKey', {
              initialValue: installation ? installation.organizationKey : undefined,
              rules: [{
                required: true,
                message: <FormattedMessage id="provide.organization" defaultMessage="Please provide an organization"/>
              }]
            })(
              <FilteredSelectControl
                placeholder={<FormattedMessage id="select.organization" defaultMessage="Select an organization"/>}
                search={this.handleSearch}
                fetching={fetching}
                items={organizations}
                delay={1000}
              />
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="installationType" defaultMessage="Installation type"/>}
            helpText={
              <FormattedMessage
                id="help.instType"
                defaultMessage="When changing this, verify all services are also updated for the installation, and every dataset served. Most likely you do not want to change this field, but rather create a new installation of the correct type, and migrate datasets. Use this with extreme caution"
              />
            }
            warning={<FormattedMessage id="warning.installationType" defaultMessage="Has significant impact on crawlers"/>}
            isNew={isNew}
          >
            {getFieldDecorator('type', {
              initialValue: installation ? installation.type : undefined,
              rules: [{
                required: true,
                message: <FormattedMessage id="provide.type" defaultMessage="Please provide a type"/>
              }]
            })(
              <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}>
                {installationTypes.map(installationType => (
                  <Select.Option value={installationType} key={installationType}>
                    <FormattedMessage id={`installationType.${installationType}`}/>
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="disabled" defaultMessage="Disabled"/>}
            helpText={
              <FormattedMessage
                id="help.disabledCheckboxTip"
                defaultMessage="Indicates that the installation is disabled and no metasync or crawling of associated datasets will occur"
              />
            }
          >
            {getFieldDecorator('disabled', {
              valuePropName: 'checked',
              initialValue: installation && installation.disabled
            })(
              <Checkbox/>
            )}
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={this.props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit">
                {installation ?
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

InstallationForm.propTypes = {
  installation: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ installationTypes, addError, user }) => ({ installationTypes, addError, user });

const WrappedInstallationForm = Form.create()(withContext(mapContextToProps)(InstallationForm));
export default WrappedInstallationForm;