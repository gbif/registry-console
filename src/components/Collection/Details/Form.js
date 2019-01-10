import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Checkbox, Col, Form, Input, Row, Select } from 'antd';
import PropTypes from 'prop-types';

// APIs
import { createCollection, updateCollection } from '../../../api/collection';
import { institutionSearch } from '../../../api/institution';
import { getPreservationMethodType, getAccessionStatus, getCollectionContentType } from '../../../api/enumeration';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FilteredSelectControl, FormItem, FormGroupHeader } from '../../common';
// Helpers
import { validateDOI, validateUrl } from '../../helpers';

class CollectionForm extends Component {
  constructor(props) {
    super(props);

    const { collection } = props;
    const institutions = collection && collection.institution ? [collection.institution] : [];

    this.state = {
      fetching: false,
      institutions,
      accessionStatuses: [],
      preservationTypes: [],
      contentTypes: []
    };
  }

  componentDidMount() {
    Promise.all([
      getAccessionStatus(),
      getPreservationMethodType(),
      getCollectionContentType()
    ]).then(responses => {
      this.setState({
        accessionStatuses: responses[0],
        preservationTypes: responses[1],
        contentTypes: responses[2]
      });
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.props.collection) {
          createCollection(values)
            .then(response => this.props.onSubmit(response.data))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updateCollection({ ...this.props.collection, ...values })
            .then(() => this.props.onSubmit())
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      }
    });
  };


  handleSearch = value => {
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

  render() {
    const { collection, form, countries } = this.props;
    const isNew = collection === null;
    const mailingAddress = collection && collection.mailingAddress ? collection.mailingAddress : {};
    const address = collection && collection.address ? collection.address : {};
    const { getFieldDecorator } = form;
    const { institutions, fetching, accessionStatuses, preservationTypes, contentTypes } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label={<FormattedMessage id="name" defaultMessage="Name"/>}>
            {getFieldDecorator('name', {
              initialValue: collection && collection.name,
              rules: [{
                required: true, message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name"/>
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            {getFieldDecorator('description', { initialValue: collection && collection.description })(
              <Input.TextArea rows={4}/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="contentTypes" defaultMessage="Content types"/>}>
            {getFieldDecorator('contentTypes', { initialValue: collection ? collection.contentTypes : undefined })(
              <Select
                mode="multiple"
                placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}
              >
                {contentTypes.map(type => (
                  <Select.Option value={type} key={type}>
                    <FormattedMessage id={`collectionContentType.${type}`}/>
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="code" defaultMessage="Code"/>}>
            {getFieldDecorator('code', {
              initialValue: collection && collection.code,
              rules: [{
                required: true, message: <FormattedMessage id="provide.code" defaultMessage="Please provide a code"/>
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            {getFieldDecorator('homepage', {
              initialValue: collection && collection.homepage,
              rules: [{
                validator: validateUrl(<FormattedMessage id="invalid.homepage" defaultMessage="Homepage is invalid"/>)
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="catalogUrl" defaultMessage="Catalog URL"/>}>
            {getFieldDecorator('catalogUrl', {
              initialValue: collection && collection.catalogUrl,
              rules: [{
                validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid"/>)
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="apiUrl" defaultMessage="API URL"/>}>
            {getFieldDecorator('apiUrl', {
              initialValue: collection && collection.apiUrl,
              rules: [{
                validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid"/>)
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="institution" defaultMessage="Institution"/>}>
            {getFieldDecorator('institutionKey', { initialValue: collection ? collection.institutionKey : undefined })(
              <FilteredSelectControl
                placeholder={<FormattedMessage
                  id="select.institution"
                  defaultMessage="Select an institution"
                />}
                search={this.handleSearch}
                fetching={fetching}
                items={institutions}
                delay={1000}
              />
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="preservationType" defaultMessage="Preservation type"/>}>
            {getFieldDecorator('preservationType', {
              initialValue: collection ? collection.preservationType : undefined
            })(
              <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}>
                {preservationTypes.map(type => (
                  <Select.Option value={type} key={type}>
                    <FormattedMessage id={`preservationType.${type}`}/>
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="accessionStatus" defaultMessage="Accession status"/>}>
            {getFieldDecorator('accessionStatus', {
              initialValue: collection ? collection.accessionStatus : undefined
            })(
              <Select placeholder={<FormattedMessage id="select.status" defaultMessage="Select a status"/>}>
                {accessionStatuses.map(status => (
                  <Select.Option value={status} key={status}>
                    <FormattedMessage id={`accessionStatus.${status}`}/>
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="active" defaultMessage="Active"/>}>
            {getFieldDecorator('active', {
              valuePropName: 'checked',
              initialValue: collection && collection.active
            })(
              <Checkbox/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="personalCollection" defaultMessage="Personal collection"/>}>
            {getFieldDecorator('personalCollection', {
              valuePropName: 'checked',
              initialValue: collection && collection.personalCollection
            })(
              <Checkbox/>
            )}
          </FormItem>

          <FormItem
            label={<FormattedMessage id="doi" defaultMessage="Digital Object Identifier"/>}
            warning={
              <FormattedMessage
                id="warning.datasetDOI"
                defaultMessage="Changes should be made understanding the consequences"
              />
            }
            isNew={isNew}
          >
            {getFieldDecorator('doi', {
              initialValue: collection && collection.doi,
              rules: [{
                validator: validateDOI(<FormattedMessage id="invalid.doi" defaultMessage="Digital Object Identifier is invalid"/>)
              }]
            })(
              <Input/>
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
            {getFieldDecorator('mailingAddress.address', { initialValue: mailingAddress.address })(
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
            {getFieldDecorator('address.address', { initialValue: address.address })(
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
            {getFieldDecorator('address.country', { initialValue: address ? address.country : undefined })(
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
              <Button type="primary" htmlType="submit" disabled={collection && !form.isFieldsTouched()}>
                {collection ?
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

CollectionForm.propTypes = {
  collection: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ countries, addError }) => ({ countries, addError });

const WrappedCollectionForm = Form.create()(withContext(mapContextToProps)(CollectionForm));
export default WrappedCollectionForm;