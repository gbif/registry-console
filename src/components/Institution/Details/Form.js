import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Form, Input, Row } from 'antd';
import PropTypes from 'prop-types';

// APIs
import { createInstitution, updateInstitution } from '../../../api/grbio.institution';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FormItem } from '../../widgets';
// Helpers
import { validateUrl } from '../../helpers';

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
    const { institution } = this.props;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>

          <FormItem label={<FormattedMessage id="name" defaultMessage="Name"/>}>
            {getFieldDecorator('name', {
              initialValue: institution && institution.name,
              rules: [{
                required: true, message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name"/>
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            {getFieldDecorator('homepage', {
              initialValue: institution && institution.homepage,
              rules: [{
                validator: validateUrl(<FormattedMessage id="invalid.homepage" defaultMessage="Homepage is invalid"/>)
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="catalogUrl" defaultMessage="Catalog URL"/>}>
            {getFieldDecorator('catalogUrl', {
              initialValue: institution && institution.catalogUrl,
              rules: [{
                validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid"/>)
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
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

InstitutionForm.propTypes = {
  institution: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ addError }) => ({ addError });

const WrappedInstitutionForm = Form.create()(withContext(mapContextToProps)(InstitutionForm));
export default WrappedInstitutionForm;