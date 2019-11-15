import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Input, Select, Checkbox, Col, Row } from 'antd';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

// APIs
import { createConcept, updateConcept } from '../../../../../api/vocabulary';
// Wrappers
import withContext from '../../../../hoc/withContext';
// Components
import { FormItem } from '../../../../common';
// Helpers

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const styles = {
  customGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    '& .ant-checkbox-group-item': {
      flex: '50%',
      margin: 0
    }
  }
};

class ConceptForm extends Component {
  state = {
    roles: []
  };

  componentDidMount() {
    /* getRoles().then(response => {
      this.setState({ roles: response.data });
    }); */
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // if (this.props.organization && !this.props.form.isFieldsTouched()) {
    //   return;
    // }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(this.props.concept){
          updateConcept(this.props.vocabularyName, { ...this.props.concept, ...values })
          .then(() => this.props.onSubmit())
          .catch(error => {
            this.props.addError({ status: error.response.status, statusText: error.response.data });
          });
        } else {
          createConcept(this.props.vocabularyName, { ...values })
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
    const { concept, classes } = this.props;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label={<FormattedMessage id="conceptName" defaultMessage="Concept name"/>}
            helpText={
              <FormattedMessage
                id="help.conceptName"
                defaultMessage="Name of the concept, e.g. Preserved specimen"
              />
            }
          >
            {getFieldDecorator('name', { initialValue: concept && concept.userName })(
              <Input disabled={true}/>
            )}
          </FormItem>

{/*           <FormItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
            {getFieldDecorator('email', {
              initialValue: user && user.email,
              rules: [{
                validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid"/>)
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="firstName" defaultMessage="First name"/>}>
            {getFieldDecorator('firstName', { initialValue: user && user.firstName })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}>
            {getFieldDecorator('lastName', { initialValue: user && user.lastName })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="country" defaultMessage="Country"/>}
            helpText={
              <FormattedMessage
                id="help.reportingPurposes"
                defaultMessage="This is used for reporting purposes"
              />
            }
          >
            {getFieldDecorator('settings.country', { initialValue: user ? user.settings.country : undefined })(
              <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
                {countries.map(country => (
                  <Option value={country} key={country}>
                    <FormattedMessage id={`country.${country}`}/>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="roles" defaultMessage="Roles"/>}>
            {getFieldDecorator('roles', { initialValue: user && user.roles })(
              <CheckboxGroup className={classes.customGroup} options={roles}/>
            )}
          </FormItem> */}

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={this.props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="save" defaultMessage="Save"/>
              </Button>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

ConceptForm.propTypes = {
//  user: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ countries, addError }) => ({ countries, addError });

const WrappedOrganizationForm = Form.create()(withContext(mapContextToProps)(injectSheet(styles)(ConceptForm)));
export default WrappedOrganizationForm;