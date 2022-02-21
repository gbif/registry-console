import PropTypes from 'prop-types';
import React from 'react';
import { Button, Col, Input, Row, Select, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl'

import { createNetwork, updateNetwork } from '../../../api/network';
import withContext from '../../hoc/withContext';
import { FormItem } from '../../common';

const NetworkForm = props => {

  const [form] = Form.useForm();
  const { network, languages, intl, onSubmit, onCancel, addError} = props;

  const handleSubmit = values => {

        if (!network) {
          createNetwork(values)
            .then(response => onSubmit(response.data))
            .catch(error => {
              addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updateNetwork({ ...network, ...values })
            .then(() => onSubmit())
            .catch(error => {
              addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      
   
  };
    let initialValues = {...network}

    return (
      <React.Fragment>
        <Form onFinish={handleSubmit} form={form} initialValues={initialValues}>

          <FormItem name='title' rules={[{
                required: true,
                message: <FormattedMessage id="provide.title" defaultMessage="Please provide a title"/>
              }]} label={<FormattedMessage id="title" defaultMessage="Title"/>}>
            <Input/>
          </FormItem>

          <FormItem name='description' label={<FormattedMessage id="description" defaultMessage="Description"/>}>
          <Input.TextArea rows={6}/>
          </FormItem>

          <FormItem
            name='language'
            rules={[{
              required: true,
              message: <FormattedMessage id="provide.language" defaultMessage="Please provide a language"/>
            }]}
            label={<FormattedMessage id="language" defaultMessage="Language"/>}
            helpText={
              <FormattedMessage
                id="help.language"
                defaultMessage="The language used for the likes of description, citation etc"
              />
            }
          >
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
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={onCancel}>
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

NetworkForm.propTypes = {
  network: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ languages, addError, user }) => ({ languages, addError, user });
export default withContext(mapContextToProps)(injectIntl(NetworkForm));
