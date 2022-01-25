import PropTypes from 'prop-types';
import React from 'react';
// import { Form } from '@ant-design/compatible';
// import '@ant-design/compatible/assets/index.css';
import { Button, Col, Input, Row, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl'

import { createVocabulary, updateVocabulary } from '../../../api/vocabulary';
import withContext from '../../hoc/withContext';
import { FormItem } from '../../common';

const VocabularyForm = props => {
  const {vocabulary, onSubmit, onCancel, addError} = props;
  const [form] = Form.useForm();
  
  const handleSubmit = values => {   
        if (!vocabulary) {
          createVocabulary(values)
            .then(response => onSubmit(response.data))
            .catch(error => {
              addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updateVocabulary({ ...vocabulary, ...values })
            .then(() => onSubmit())
            .catch(error => {
              addError({ status: error.response.status, statusText: error.response.data });
            });
        }   
  };

 
 
    let initialValues = {...vocabulary}
    return (
      <React.Fragment>
        <Form onFinish={handleSubmit} initialValues={initialValues}>

          <FormItem 
            name='name' 
            rules={[{
                required: true,
                message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name"/>
              }]} 
            label={<FormattedMessage id="name" defaultMessage="Name"/>}>
              <Input disabled={vocabulary}/>
          </FormItem>

          <FormItem
            name='namespace' 
            label={<FormattedMessage id="namespace" defaultMessage="Namespace"/>}>
              <Input /> 
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

VocabularyForm.propTypes = {
  vocabulary: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ languages, addError, user }) => ({ languages, addError, user });

export default withContext(mapContextToProps)(injectIntl(VocabularyForm));
