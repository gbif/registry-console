import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import PropTypes from 'prop-types';

// APIs
import { institutionSearch } from '../../../api/institution';
import { collectionSearch } from '../../../api/collection';
import { createPerson, updatePerson } from '../../../api/grbioPerson';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FilteredSelectControl, FormItem } from '../../common';
// Helpers
import { validateEmail, validatePhone } from '../../helpers';

class PersonForm extends Component {
  constructor(props) {
    super(props);

    const { person } = props;
    const institutions = person && person.institution ? [person.institution] : [];
    const collections = person && person.collection ? [person.collection] : [];

    this.state = {
      fetching: false,
      institutions,
      collections
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.props.person) {
          createPerson(values)
            .then(response => this.props.onSubmit(response.data))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updatePerson({ ...this.props.person, ...values })
            .then(() => this.props.onSubmit())
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      }
    });
  };

  handleInstitutionSearch = value => {
    if (!value) {
      this.setState({ institutions: [] });
      return;
    }

    this.setState({ fetching: true });

    institutionSearch({ q: value }).then(response => {
      this.setState({
        institutions: response.data.results,
        fetching: false
      });
    });
  };

  handleCollectionSearch = value => {
    if (!value) {
      this.setState({ collections: [] });
      return;
    }

    this.setState({ fetching: true });

    collectionSearch({ q: value }).then(response => {
      this.setState({
        collections: response.data.results,
        fetching: false
      });
    });
  };

  render() {
    const { person, form, countries } = this.props;
    const mailingAddress = person && person.mailingAddress ? person.mailingAddress : {};
    const { getFieldDecorator } = form;
    const { institutions, collections, fetching } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} layout={'vertical'}>
          <FormItem label={<FormattedMessage id="firstName" defaultMessage="Fist name"/>}>
            {getFieldDecorator('firstName', {
              initialValue: person && person.firstName,
              rules: [{
                required: true,
                message: <FormattedMessage id="provide.firstName" defaultMessage="Please provide first name"/>
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}>
            {getFieldDecorator('lastName', { initialValue: person && person.lastName, })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="position" defaultMessage="Position"/>}>
            {getFieldDecorator('position', { initialValue: person && person.position })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="areaResponsibility" defaultMessage="Area responsibility"/>}>
            {getFieldDecorator('areaResponsibility', { initialValue: person && person.areaResponsibility })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="researchPursuits" defaultMessage="Research pursuits"/>}>
            {getFieldDecorator('researchPursuits', { initialValue: person && person.researchPursuits })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="phone" defaultMessage="Phone"/>}>
            {getFieldDecorator('phone', {
              initialValue: person && person.phone,
              rules: [{
                validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid"/>)
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="fax" defaultMessage="Fax"/>}>
            {getFieldDecorator('fax', {
              initialValue: person && person.fax,
              rules: [{
                validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid"/>)
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
            {getFieldDecorator('email', {
              initialValue: person && person.email,
              rules: [{
                validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid"/>)
              }]
            })(
              <Input/>
            )}
          </FormItem>

          {getFieldDecorator('mailingAddress.key', { initialValue: mailingAddress.key })(
            <Input style={{ display: 'none' }}/>
          )}

          <FormItem label={<FormattedMessage id="address" defaultMessage="Address"/>}>
            {getFieldDecorator('mailingAddress.address', {
              initialValue: mailingAddress.address,
              defaultValue: []
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="city" defaultMessage="City"/>}>
            {getFieldDecorator('mailingAddress.city', { initialValue: mailingAddress.city })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="province" defaultMessage="Province"/>}>
            {getFieldDecorator('mailingAddress.province', { initialValue: mailingAddress.province })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
            {getFieldDecorator('mailingAddress.country', {
              initialValue: mailingAddress ? mailingAddress.country : undefined
            })(
              <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
                {countries.map(country => (
                  <Select.Option value={country} key={country}>
                    <FormattedMessage id={`country.${country}`}/>
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
            {getFieldDecorator('mailingAddress.postalCode', { initialValue: mailingAddress.postalCode })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="primaryInstitution" defaultMessage="Primary institution"/>}>
            {getFieldDecorator('primaryInstitutionKey', {
              initialValue: person ? person.primaryInstitutionKey : undefined
            })(
              <FilteredSelectControl
                placeholder={<FormattedMessage
                  id="select.institution"
                  defaultMessage="Select an institution"
                />}
                search={this.handleInstitutionSearch}
                fetching={fetching}
                items={institutions}
                delay={1000}
              />
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="primaryCollection" defaultMessage="Primary collection"/>}>
            {getFieldDecorator('primaryCollectionKey', {
              initialValue: person ? person.primaryCollectionKey : undefined
            })(
              <FilteredSelectControl
                placeholder={<FormattedMessage
                  id="select.collection"
                  defaultMessage="Select a collection"
                />}
                search={this.handleCollectionSearch}
                fetching={fetching}
                items={collections}
                delay={1000}
              />
            )}
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={this.props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit" disabled={person && !form.isFieldsTouched()}>
                {person ?
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

PersonForm.propTypes = {
  person: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ countries, addError }) => ({ countries, addError });

const WrappedPersonForm = Form.create()(withContext(mapContextToProps)(PersonForm));
export default WrappedPersonForm;