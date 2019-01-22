import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

// APIs
import { createInstitution, updateInstitution } from '../../../api/institution';
import {
  getInstitutionType,
  getInstitutionGovernance,
  getDiscipline,
  getCitesAppendix
} from '../../../api/enumeration';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FormItem, FormGroupHeader, TagControl } from '../../common';
// Helpers
import { validateImageUrl, validateUrl } from '../../util/validators';

class InstitutionForm extends Component {
  state = {
    types: [],
    governance: [],
    disciplines: [],
    citesAppendices: []
  };

  async componentDidMount() {
    const [types, governance, disciplines, citesAppendices] = await Promise.all([
      getInstitutionType(),
      getInstitutionGovernance(),
      getDiscipline(),
      getCitesAppendix()
    ]);

    this.setState({ types, governance, disciplines, citesAppendices });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.props.institution) {
          createInstitution(values)
            .then(response => this.props.onSubmit(response.data))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updateInstitution({ ...this.props.institution, ...values })
            .then(() => this.props.onSubmit())
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      }
    });
  };

  render() {
    const { institution, form, countries } = this.props;
    const mailingAddress = institution && institution.mailingAddress ? institution.mailingAddress : {};
    const address = institution && institution.address ? institution.address : {};
    const { getFieldDecorator } = form;
    const { types, governance, disciplines, citesAppendices } = this.state;

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

          <FormItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            {getFieldDecorator('description', { initialValue: institution && institution.description })(
              <Input.TextArea rows={4}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="code" defaultMessage="Code"/>}>
            {getFieldDecorator('code', {
              initialValue: institution && institution.code,
              rules: [{
                required: true, message: <FormattedMessage id="provide.code" defaultMessage="Please provide a code"/>
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
            {getFieldDecorator('type', {
              initialValue: institution ? institution.type : undefined
            })(
              <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}>
                {types.map(type => (
                  <Select.Option value={type} key={type}>
                    <FormattedMessage id={`institutionType.${type}`}/>
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="active" defaultMessage="Active"/>}>
            {getFieldDecorator('active', {
              valuePropName: 'checked',
              initialValue: institution && institution.active
            })(
              <Checkbox/>
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

          <FormItem label={<FormattedMessage id="apiUrl" defaultMessage="API URL"/>}>
            {getFieldDecorator('apiUrl', {
              initialValue: institution && institution.apiUrl,
              rules: [{
                validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid"/>)
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="institutionalGovernance" defaultMessage="Institutional governance"/>}>
            {getFieldDecorator('institutionalGovernance', {
              initialValue: institution ? institution.institutionalGovernance : undefined
            })(
              <Select placeholder={<FormattedMessage id="select.governance" defaultMessage="Select a governance"/>}>
                {governance.map(item => (
                  <Select.Option value={item} key={item}>
                    <FormattedMessage id={`institutionGovernance.${item}`}/>
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="disciplines" defaultMessage="Disciplines"/>}>
            {getFieldDecorator('disciplines', {
              initialValue: institution ? institution.disciplines : undefined
            })(
              <Select
                mode="multiple"
                placeholder={<FormattedMessage id="select.discipline" defaultMessage="Select a discipline"/>}
              >
                {disciplines.map(discipline => (
                  <Select.Option value={discipline} key={discipline}>
                    <FormattedMessage id={`discipline.${discipline}`}/>
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="latitude" defaultMessage="Latitude"/>}>
            {getFieldDecorator('latitude', {
              initialValue: institution && institution.latitude
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="longitude" defaultMessage="Longitude"/>}>
            {getFieldDecorator('longitude', {
              initialValue: institution && institution.longitude
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="additionalNames" defaultMessage="Additional names"/>}>
            {getFieldDecorator('additionalNames', {
              initialValue: institution && institution.additionalNames,
              defaultValue: []
            })(
              <TagControl label={<FormattedMessage id="name" defaultMessage="Name"/>} removeAll={true}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="foundingDate" defaultMessage="Founding date"/>}>
            {getFieldDecorator('foundingDate', {
              initialValue: institution && moment(institution.foundingDate)
            })(
              <DatePicker allowClear={true} format={'L'}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="geographicDescription" defaultMessage="Geographic description"/>}>
            {getFieldDecorator('geographicDescription', {
              initialValue: institution && institution.geographicDescription
            })(
              <Input.TextArea rows={4}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="taxonomicDescription" defaultMessage="Taxonomic description"/>}>
            {getFieldDecorator('taxonomicDescription', {
              initialValue: institution && institution.taxonomicDescription
            })(
              <Input.TextArea rows={4}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="numberSpecimens" defaultMessage="Number specimens"/>}>
            {getFieldDecorator('numberSpecimens', { initialValue: institution && institution.numberSpecimens })(
              <InputNumber min={0} max={9999}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="indexHerbariorumRecord" defaultMessage="Herbariorum record"/>}>
            {getFieldDecorator('indexHerbariorumRecord', {
              valuePropName: 'checked',
              initialValue: institution && institution.indexHerbariorumRecord
            })(
              <Checkbox/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="logoUrl" defaultMessage="Logo URL"/>}>
            {getFieldDecorator('logoUrl', {
              initialValue: institution && institution.logoUrl,
              rules: [{
                validator: validateImageUrl(
                  <FormattedMessage id="invalid.url.logo" defaultMessage="Logo url is invalid"/>
                )
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="citesPermitNumber" defaultMessage="Cites permit number"/>}>
            {getFieldDecorator('citesPermitNumber', {
              initialValue: institution ? institution.citesPermitNumber : undefined
            })(
              <Select placeholder={<FormattedMessage id="select.number" defaultMessage="Select a number"/>}>
                {citesAppendices.map(citesAppendix => (
                  <Select.Option value={citesAppendix} key={citesAppendix}>
                    {citesAppendix}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormGroupHeader
            title={<FormattedMessage id="mailingAddress" defaultMessage="Mailing address"/>}
            helpText={<FormattedMessage id="help.mailingAddress" defaultMessage="An address to send emails"/>}
          />

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

          <FormGroupHeader
            title={<FormattedMessage id="physicalAddress" defaultMessage="Physical address"/>}
            helpText={<FormattedMessage id="help.physicalAddress" defaultMessage="An address of a building"/>}
          />

          {getFieldDecorator('address.key', { initialValue: address.key })(
            <Input style={{ display: 'none' }}/>
          )}

          <FormItem label={<FormattedMessage id="address" defaultMessage="Address"/>}>
            {getFieldDecorator('address.address', {
              initialValue: address.address,
              defaultValue: []
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="city" defaultMessage="City"/>}>
            {getFieldDecorator('address.city', { initialValue: address.city })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="province" defaultMessage="Province"/>}>
            {getFieldDecorator('address.province', { initialValue: address.province })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
            {getFieldDecorator('address.country', {
              initialValue: address ? address.country : undefined
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
            {getFieldDecorator('address.postalCode', { initialValue: address.postalCode })(
              <Input/>
            )}
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={this.props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit" disabled={institution && !form.isFieldsTouched()}>
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

const mapContextToProps = ({ countries, addError }) => ({ countries, addError });

const WrappedInstitutionForm = Form.create()(withContext(mapContextToProps)(InstitutionForm));
export default WrappedInstitutionForm;