import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Form, Input, Row, Select, Switch, AutoComplete } from 'antd';

import { AppContext } from '../../App';
import { updateOrganization } from '../../../api/organization';
import { search } from '../../../api/node';
import { prepareData } from '../../../api/util/helpers';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

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

class OrganizationForm extends Component {
  state = {
    confirmDirty: false,
    nodes: []
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const preparedData = prepareData(values);

        updateOrganization({ ...this.props.organization, ...preparedData })
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
        nodes: response.data.results
      })
    });
  };

  // handleConfirmBlur = (e) => {
  //   const value = e.target.value;
  //   this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  // };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { organization } = this.props;
    const nodes = this.state.nodes;

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
              id="orgTitleExtra"
              defaultMessage="Enter an accurate organization title as it is used in many key places."
            />}
          >
            {getFieldDecorator('title', {
              initialValue: organization.title,
              rules: [{
                required: true, message: 'Please provide a title'
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
              initialValue: organization.abbreviation
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="description" defaultMessage="Description"/>}
          >
            {getFieldDecorator('description', {
              initialValue: organization.description
            })(
              <TextArea rows={8}/>
            )}
          </FormItem>

          <Row gutter={24}>
            <Col className="gutter-row" span={18}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="endorsingNode" defaultMessage="Endorsing node"/>}
              >
                {getFieldDecorator('endorsingNodeKey', {
                  initialValue: organization.endorsingNode.title
                })(
                  <AutoComplete onSearch={this.handleSearch}>
                    {nodes.map(node => <AutoComplete.Option key={node.key}>{node.title}</AutoComplete.Option>)}
                  </AutoComplete>
                )}
              </FormItem>
            </Col>
            <Col className="gutter-row" span={6}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="endorsementApproved" defaultMessage="Endorsement approved"/>}
              >
                {getFieldDecorator('endorsementApproved', {
                  initialValue: organization.endorsementApproved
                })(
                  <Switch
                    checkedChildren="Approved"
                    unCheckedChildren="Awaiting approval"
                    defaultChecked={organization.endorsementApproved}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}
          >
            {getFieldDecorator('homepage', {
              initialValue: organization.homepage.join('; ')
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>}
          >
            {getFieldDecorator('logoUrl', {
              initialValue: organization.logoUrl
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="language" defaultMessage="Language"/>}
          >
            {getFieldDecorator('language', {
              initialValue: organization.language
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="address" defaultMessage="Address"/>}
          >
            {getFieldDecorator('address', {
              initialValue: organization.address.join('; '),
              rules: [{
                required: true, message: 'Please provide an email'
              }]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="city" defaultMessage="City"/>}
          >
            {getFieldDecorator('city', {
              initialValue: organization.city
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="province" defaultMessage="Province"/>}
          >
            {getFieldDecorator('province', {
              initialValue: organization.province
            })(
              <Input/>
            )}
          </FormItem>
          <AppContext.Consumer>
            {({ countries }) => (
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="country" defaultMessage="Country"/>}
              >
                {getFieldDecorator('country', {
                  initialValue: organization.country
                })(
                  <Select placeholder="None selected">
                    {countries.map(country => (
                      <Option value={country.code} key={country.code}>{country.name}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}
          </AppContext.Consumer>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}
          >
            {getFieldDecorator('postalCode', {
              initialValue: organization.postalCode
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="email" defaultMessage="Email"/>}
          >
            {getFieldDecorator('email', {
              initialValue: organization.email.join('; '),
              rules: [{
                required: true, message: 'Please provide an email'
              }]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="phone" defaultMessage="Phone"/>}
          >
            {getFieldDecorator('phone', {
              initialValue: organization.phone.join('; '),
              rules: [{
                required: true, message: 'Please provide a phone'
              }]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="latitude" defaultMessage="Latitude"/>}
          >
            {getFieldDecorator('latitude', {
              initialValue: organization.latitude
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="longitude" defaultMessage="Longitude"/>}
          >
            {getFieldDecorator('longitude', {
              initialValue: organization.longitude
            })(
              <Input/>
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

const WrappedOrganizationForm = Form.create()(OrganizationForm);
export default WrappedOrganizationForm;