import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Form, Input, Row } from 'antd';

import { createInstitution, updateInstitution } from '../../../api/grbio.institution';
import formValidationWrapper from '../../hoc/formValidationWrapper';
import withContext from '../../hoc/withContext';

const FormItem = Form.Item;

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

class InstitutionForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    // if (this.props.data && !this.props.form.isFieldsTouched()) {
    //   return;
    // }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.props.data) {
          createInstitution(values)
            .then(response => this.props.onSubmit(response.data))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updateInstitution({ ...this.props.data, ...values })
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
    const { institution, handleHomepage, handleUrl } = this.props;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} layout={'vertical'}>
          <FormItem {...formItemLayout} label={<FormattedMessage id="name" defaultMessage="Name"/>}>
            {getFieldDecorator('name', {
              initialValue: institution && institution.name,
              rules: [{
                required: true, message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name"/>
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}
          >
            {getFieldDecorator('homepage', {
              initialValue: institution && institution.homepage,
              rules: [{ validator: handleHomepage }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="catalogUrl" defaultMessage="Catalog URL"/>}
          >
            {getFieldDecorator('catalogUrl', {
              initialValue: institution && institution.catalogUrl,
              rules: [{ validator: handleUrl }]
            })(
              <Input/>
            )}
          </FormItem>

          <Row>
            <Col span={10} offset={7} className="btn-container">
              <Button htmlType="button" onClick={this.props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit">
                {institution ?
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

const mapContextToProps = ({ addError }) => ({ addError });

const WrappedInstitutionForm = Form.create()(withContext(mapContextToProps)(formValidationWrapper(InstitutionForm)));
export default WrappedInstitutionForm;