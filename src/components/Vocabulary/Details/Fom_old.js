import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Input, Row } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl'

import { createVocabulary, updateVocabulary } from '../../../api/vocabulary';
import withContext from '../../hoc/withContext';
import { FormItem } from '../../common';

class vocabularyForm extends Component {

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.props.vocabulary) {
          createVocabulary(values)
            .then(response => this.props.onSubmit(response.data))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updateVocabulary({ ...this.props.vocabulary, ...values })
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
    const { vocabulary } = this.props;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>

          <FormItem label={<FormattedMessage id="name" defaultMessage="Name"/>}>
            {getFieldDecorator('name', {
              initialValue: vocabulary && vocabulary.name,
              rules: [{
                required: true,
                message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name"/>
              }]
            })(
              <Input disabled={this.props.vocabulary}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="namespace" defaultMessage="Namespace"/>}>
            {getFieldDecorator('namespace', { initialValue: vocabulary && vocabulary.namespace })(
              <Input />
            )}
          </FormItem>



          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={this.props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit">
                {vocabulary ?
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

vocabularyForm.propTypes = {
  vocabulary: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ languages, addError, user }) => ({ languages, addError, user });

const WrappedvocabularyForm = Form.create()(withContext(mapContextToProps)(injectIntl(vocabularyForm)));
export default WrappedvocabularyForm;