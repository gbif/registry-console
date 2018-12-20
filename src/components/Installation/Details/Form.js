import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Form, Input, Select, Checkbox, Badge, Col, Row } from 'antd';
import injectSheet from 'react-jss';

import { createInstallation, updateInstallation } from '../../../api/installation';
import { search } from '../../../api/organization';
import { FilteredSelectControl } from '../../widgets';
import withContext from '../../hoc/withContext';
import { getPermittedOrganizations } from '../../helpers';

const FormItem = Form.Item;
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
const styles = {
  important: {
    marginRight: '10px',
    '& sup': {
      backgroundColor: '#b94a48'
    }
  }
};

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
    const { installation, classes, intl, installationTypes } = this.props;
    const { organizations, fetching } = this.state;

    return (
      <React.Fragment>
        <p className="help">
          <FormattedMessage
            id="installationOverviewInfo"
            defaultMessage="This information appears on the installation profile, installation pages, search results, and beyond."
          />
        </p>

        <Form onSubmit={this.handleSubmit} layout={'vertical'}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="title" defaultMessage="Title"/>}
            extra={<FormattedMessage
              id="instTitleExtra"
              defaultMessage="Enter an accurate installation title as it is used in many key places."
            />}
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
            {...formItemLayout}
            label={<FormattedMessage id="description" defaultMessage="Description"/>}
            extra={<FormattedMessage
              id="instDescriptionExtra"
              defaultMessage="Provide a meaningful description of the installation, so a user will understand what the installation is."
            />}
          >
            {getFieldDecorator('description', { initialValue: installation && installation.description })(
              <TextArea rows={4}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="publishingOrganization" defaultMessage="Publishing organization"/>}
            extra={<FormattedMessage
              id="instPublishingOrgExtra"
              defaultMessage="It is expected that this may be changed occasionally, but be vigilant in changes as this has potential to spawn significant processing for occurrence records, metrics and maps"
            />}
          >
            {getFieldDecorator('organizationKey', { initialValue: installation ? installation.organizationKey : undefined })(
              <FilteredSelectControl
                placeholder={<FormattedMessage id="select.organization" defaultMessage="Select an organization"/>}
                search={this.handleSearch}
                fetching={fetching}
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
            label={<FormattedMessage id="installationType" defaultMessage="Installation type"/>}
            extra={<FormattedMessage
              id="instTypeExtra"
              defaultMessage="When changing this, verify all services are also updated for the installation, and every dataset served. Most likely you do not want to change this field, but rather create a new installation of the correct type, and migrate datasets. Use this with extreme caution"
            />}
          >
            {getFieldDecorator('type', { initialValue: installation ? installation.type : undefined })(
              <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}>
                {installationTypes.map(installationType => (
                  <Select.Option value={installationType} key={installationType}>
                    <FormattedMessage id={`${installationType}`}/>
                  </Select.Option>
                ))}
              </Select>
            )}
            <div>
              <Badge
                count={intl.formatMessage({ id: 'important', defaultMessage: 'Important' })}
                className={classes.important}
              />
              <FormattedMessage id="instTypeWarning" defaultMessage="Has significant impact on crawlers"/>
            </div>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="disabled" defaultMessage="Disabled"/>}
          >
            {getFieldDecorator('disabled', { initialValue: installation && installation.disabled ? installation.disabled : false })(
              <Checkbox style={{ fontSize: '10px' }}>
                <FormattedMessage
                  id="disabledCheckboxTip"
                  defaultMessage="Indicates that the installation is disabled and no metasync or crawling of associated datasets will occur"
                />
              </Checkbox>
            )}
          </FormItem>

          <Row>
            <Col span={10} offset={7} className="btn-container">
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

const mapContextToProps = ({ installationTypes, addError, user }) => ({ installationTypes, addError, user });

const WrappedInstallationForm = Form.create()(withContext(mapContextToProps)(injectIntl(injectSheet(styles)(InstallationForm))));
export default WrappedInstallationForm;