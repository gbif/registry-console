import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl'

import { createNetwork, updateNetwork } from '../../../api/network';
import withContext from '../../hoc/withContext';
import { FormItem } from '../../common';

class NetworkForm extends Component {

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.props.network) {
          createNetwork(values)
            .then(response => this.props.onSubmit(response.data))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updateNetwork({ ...this.props.network, ...values })
            .then(() => this.props.onSubmit())
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { network, languages, intl } = this.props;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>

          <FormItem label={<FormattedMessage id="title" defaultMessage="Title"/>}>
            {getFieldDecorator('title', {
              initialValue: network && network.title,
              rules: [{
                required: true,
                message: <FormattedMessage id="provide.title" defaultMessage="Please provide a title"/>
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            {getFieldDecorator('description', { initialValue: network && network.description })(
              <Input.TextArea rows={6}/>
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="language" defaultMessage="Language"/>}
            helpText={
              <FormattedMessage
                id="help.language"
                defaultMessage="The language used for the likes of description, citation etc"
              />
            }
          >
            {getFieldDecorator('language', {
              initialValue: network ? network.language : undefined,
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
                    const langTranslation = intl.formatMessage({ id: option.props.children.props.id, defaultMessage: '' });
                    // if there is a translation for language code and it contains user's input then return true
                    return langTranslation && langTranslation.toLowerCase().includes(input.toLowerCase());
                  }
                }
              >
                {languages.map(language => (
                  <Select.Option value={language} key={language}>
                    <FormattedMessage id={`language.${language}`}/>
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={this.props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit">
                {network ?
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

NetworkForm.propTypes = {
  network: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ languages, addError, user }) => ({ languages, addError, user });

const WrappedNetworkForm = Form.create()(withContext(mapContextToProps)(injectIntl(NetworkForm)));
export default WrappedNetworkForm;