import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Input, Select } from 'antd';

import { createNode } from '../../../api/node';
import { getContinents, getGbifRegions, getNodeTypes, getParticipationStatuses } from '../../../api/enumeration';

const FormItem = Form.Item;
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

class NodeForm extends Component {
  state = {
    confirmDirty: false,
    types: [],
    statuses: [],
    regions: [],
    continents: []
  };

  async componentDidMount() {
    const types = await getNodeTypes();
    const statuses = await getParticipationStatuses();
    const regions = await getGbifRegions();
    const continents = await getContinents();

    this.setState({
      types,
      statuses,
      regions,
      continents
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        createNode(values).then(response => {
          this.props.onSubmit(response.data);
        });
      }
    });
  };

  // handleConfirmBlur = (e) => {
  //   const value = e.target.value;
  //   this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  // };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { node, countries } = this.props;
    const { types, statuses, regions, continents } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} layout={'vertical'}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="title" defaultMessage="Title"/>}
            extra={<FormattedMessage
              id="extra.nodeTitle"
              defaultMessage="Enter an accurate node title as it is used in many key places."
            />}
          >
            {getFieldDecorator('title', {
              initialValue: node && node.title,
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
            label={<FormattedMessage id="type" defaultMessage="Type"/>}
            extra={<FormattedMessage id="extra.nodeType" defaultMessage="Please verify IMS is the same"/>}
          >
            {getFieldDecorator('type', { initialValue: node ? node.type : undefined })(
              <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}>
                {types.map(type => (
                  <Option value={type} key={type}>
                    <FormattedMessage id={`nodeType.${type}`}/>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="participationStatus" defaultMessage="Participation Status"/>}
            extra={<FormattedMessage
              id="extra.nodeStatus"
              defaultMessage="This is used for reporting purposes (e.g. occurrence counts in ad hoc reporting)"
            />}
          >
            {getFieldDecorator('participationStatus', { initialValue: node ? node.participationStatus : undefined })(
              <Select placeholder={<FormattedMessage id="select.status" defaultMessage="Select a status"/>}>
                {statuses.map(status => (
                  <Option value={status} key={status}>
                    <FormattedMessage id={`participationStatus.${status}`}/>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="gbifRegion" defaultMessage="GBIF Region"/>}
            extra={<FormattedMessage id="extra.nodeRegion" defaultMessage="This is used for reporting purposes"/>}
          >
            {getFieldDecorator('gbifRegion', { initialValue: node ? node.gbifRegion : undefined })(
              <Select placeholder={<FormattedMessage id="select.region" defaultMessage="Select a region"/>}>
                {regions.map(region => (
                  <Option value={region} key={region}>
                    <FormattedMessage id={`region.${region}`}/>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="continent" defaultMessage="Continent"/>}
            extra={<FormattedMessage id="extra.nodeContinent" defaultMessage="This is used for reporting purposes"/>}
          >
            {getFieldDecorator('continent', { initialValue: node ? node.continent : undefined })(
              <Select placeholder={<FormattedMessage id="select.continent" defaultMessage="Select a continent"/>}>
                {continents.map(continent => (
                  <Option value={continent} key={continent}>
                    <FormattedMessage id={`continent.${continent}`}/>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="country" defaultMessage="Country"/>}
            extra={<FormattedMessage id="extra.nodeCountry" defaultMessage="This is used for reporting purposes"/>}
          >
            {getFieldDecorator('country', { initialValue: node ? node.country : undefined })(
              <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
                {countries.map(country => (
                  <Option value={country} key={country}>
                    <FormattedMessage id={`country.${country}`}/>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="create" defaultMessage="Create"/>
            </Button>
          </FormItem>
        </Form>
      </React.Fragment>
    );
  }
}

const WrappedOrganizationForm = Form.create()(NodeForm);
export default WrappedOrganizationForm;