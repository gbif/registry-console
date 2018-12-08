import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Input, AutoComplete, Select, Checkbox, Badge } from 'antd';

import { updateInstallation } from '../../../api/installation';
import { search } from '../../../api/organization';
import { prepareData } from '../../../api/util/helpers';
import { AppContext } from '../../App';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 24 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 24 }
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

class InstallationForm extends Component {
  state = {
    confirmDirty: false,
    organizations: []
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const preparedData = prepareData(values);

        updateInstallation({ ...this.props.installation, ...preparedData })
          .then(this.props.onSubmit);
      }
    });
  };

  // TODO probably, should be refactored or removed
  // First of all, method implemented for demonstration purposes
  // One of the cases to refactor - request all nodes initially on login and store  them within application
  // If it's rational and possible
  handleSearch = value => {
    if (!value || value.length < 4) {
      return;
    }

    search({ q: value }).then(response => {
      this.setState({
        organizations: response.data.results
      })
    });
  };

  // handleConfirmBlur = (e) => {
  //   const value = e.target.value;
  //   this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  // };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { installation } = this.props;
    const organizations = this.state.organizations;

    return (
      <React.Fragment>
        <p style={{ color: '#999' }}>
          <small>
            <FormattedMessage
              id="editFormInstructions"
              defaultMessage="Multi value fields position, email, phone, homepage and address are indicated by * and use the semicolon as the delimiter."
            />
          </small>
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
              initialValue: installation.title,
              rules: [{
                required: true, message: 'Please provide a title'
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
            {getFieldDecorator('description', {
              initialValue: installation.description
            })(
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
            {getFieldDecorator('organizationKey', {
              initialValue: installation.organization.title
            })(
              <AutoComplete onSearch={this.handleSearch}>
                {organizations.map(organization =>
                  <AutoComplete.Option key={organization.key}>{organization.title}</AutoComplete.Option>)
                }
              </AutoComplete>
            )}
            <div>
              <Badge count="Important" style={{ backgroundColor: '#b94a48', marginRight: '10px' }}/>
              <FormattedMessage id="publishingOrganizationWarning" defaultMessage="Changing this will update hosting organization on all occurrence records."/>
            </div>
          </FormItem>

          <AppContext.Consumer>
            {({ installationTypes }) => (
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="installationType" defaultMessage="Installation type"/>}
                extra={<FormattedMessage
                  id="instTypeExtra"
                  defaultMessage="When changing this, verify all services are also updated for the installation, and every dataset served. Most likely you do not want to change this field, but rather create a new installation of the correct type, and migrate datasets. Use this with extreme caution"
                />}
              >
                {getFieldDecorator('type', {
                  initialValue: installation.type
                })(
                  <Select placeholder="None selected">
                    {installationTypes.map(installationType => (
                      <Select.Option value={installationType.code} key={installationType.code}>{installationType.name}</Select.Option>
                    ))}
                  </Select>
                )}
                <div>
                  <Badge count="Important" style={{ backgroundColor: '#b94a48', marginRight: '10px' }}/>
                  <FormattedMessage id="instTypeWarning" defaultMessage="Has significant impact on crawlers"/>
                </div>
              </FormItem>
            )}
          </AppContext.Consumer>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="disabled" defaultMessage="Disabled"/>}
          >
            {getFieldDecorator('disabled', { initialValue: installation.disabled })(
              <Checkbox style={{ fontSize: '10px' }}>
                <FormattedMessage
                  id="disabledCheckboxTip"
                  defaultMessage="Indicates that the installation is disabled and no metasync or crawling of associated datasets will occur"
                />
              </Checkbox>
            )}
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Update</Button>
          </FormItem>
        </Form>
      </React.Fragment>
    );
  }
}

const WrappedInstallationForm = Form.create()(InstallationForm);
export default WrappedInstallationForm;