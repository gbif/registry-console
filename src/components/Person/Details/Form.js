import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
// import { Form } from '@ant-design/compatible';
// import '@ant-design/compatible/assets/index.css';
import { Button, Col, Input, Row, Select, Form } from 'antd';
import PropTypes from 'prop-types';

// APIs
import { getSuggestedInstitutions } from '../../../api/institution';
import { getSuggestedCollections } from '../../../api/collection';
import { createPerson, updatePerson } from '../../../api/grscicollPerson';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FilteredSelectControl, FormItem } from '../../common';
// Helpers
import { validateEmail, validatePhone } from '../../util/validators';

const PersonForm = props => {
  const { person, countries, onSubmit, onCancel, addError } = props;

  const [form] = Form.useForm();
  const [institutions, setInstitutions] = useState(person?.institution ? [person.institution] : [])
  const [collections, setCollections] = useState(person?.collection ? [person.collection] : [])
  const [fetching, setFetching] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
 

  const handleSubmit = (values) => {
     
        if (!person) {
          createPerson(values)
            .then(response => onSubmit(response.data))
            .catch(error => {
              addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updatePerson({ ...person, ...values })
            .then(() => onSubmit())
            .catch(error => {
              addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      
  
  };

  const handleInstitutionSearch = value => {
    if (!value) {
      setInstitutions([])
      return;
    }
    setFetching(true)

    getSuggestedInstitutions({ q: value }).then(response => {
      setInstitutions(response.data)
      setFetching(false)
    });
  };

  const handleCollectionSearch = value => {
    if (!value) {
      setCollections([])
      return;
    }

    setFetching(true)

    getSuggestedCollections({ q: value }).then(response => {
      setFetching(true)
      setCollections(response.data)
    });
  };

  
    const mailingAddress =  person?.mailingAddress ? person.mailingAddress : {};
    const initialValues = {...person}

    return (
      <React.Fragment>
        <Form onFinish={handleSubmit}  initialValues={initialValues} form={form} onValuesChange={() => {
          setIsTouched(true)
        }}>
          <FormItem  name='firstName' rules={[{
                required: true,
                message: <FormattedMessage id="provide.firstName" defaultMessage="Please provide first name"/>
              }]} label={<FormattedMessage id="firstName" defaultMessage="Fist name"/>}>
            <Input/>
          </FormItem>

          <FormItem name='lastName' label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}>
            <Input/>
          </FormItem>

          <FormItem name='position' label={<FormattedMessage id="position" defaultMessage="Position"/>}>
            <Input/>
          </FormItem>

          <FormItem name='areaResponsibility' label={<FormattedMessage id="areaResponsibility" defaultMessage="Area responsibility"/>}>
            <Input/>
          </FormItem>

          <FormItem name='researchPursuits' label={<FormattedMessage id="researchPursuits" defaultMessage="Research pursuits"/>}>
            <Input/>
          </FormItem>

          <FormItem name='phone' rules={[{
                validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid"/>)
              }]}  label={<FormattedMessage id="phone" defaultMessage="Phone"/>}>
              <Input/>
          </FormItem>

          <FormItem name='fax' rules={[{
                validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid"/>)
              }]} label={<FormattedMessage id="fax" defaultMessage="Fax"/>}>
              <Input/>
          </FormItem>

          <FormItem name='email' rules={[{
                validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid"/>)
              }]} label={<FormattedMessage id="email" defaultMessage="Email"/>}>
              <Input/>
          </FormItem>

          <FormItem name={['mailingAddress','key']} rules={[{
                validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid"/>)
              }]} label={<FormattedMessage id="email" defaultMessage="Email"/>} style={{ display: 'none' }}>
              <Input style={{ display: 'none' }}/>
          </FormItem>
          

          <FormItem name={['mailingAddress','address']} initialValue={[]} label={<FormattedMessage id="address" defaultMessage="Address"/>}>
            <Input/>
          </FormItem>

          <FormItem name={['mailingAddress','city']} label={<FormattedMessage id="city" defaultMessage="City"/>}>
            {getFieldDecorator('mailingAddress.city', { initialValue: mailingAddress.city })(
              <Input/>
            )}
          </FormItem>

          <FormItem name={['mailingAddress', 'province']} label={<FormattedMessage id="province" defaultMessage="Province"/>}>
            <Input/>
          </FormItem>

          <FormItem name={['mailingAddress', 'country']} label={<FormattedMessage id="country" defaultMessage="Country"/>}>
            <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
                {countries.map(country => (
                  <Select.Option value={country} key={country}>
                    <FormattedMessage id={`country.${country}`}/>
                  </Select.Option>
                ))}
              </Select>
          </FormItem>

          <FormItem name={['mailingAddress', 'postalCode']} label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
            <Input/>
          </FormItem>

          <FormItem name='primaryInstitutionKey' label={<FormattedMessage id="primaryInstitution" defaultMessage="Primary institution"/>}>
            <FilteredSelectControl
                placeholder={<FormattedMessage
                  id="select.institution"
                  defaultMessage="Select an institution"
                />}
                search={handleInstitutionSearch}
                fetching={fetching}
                items={institutions}
                titleField="name"
                delay={1000}
              />
          </FormItem>

          <FormItem name='primaryCollectionKey' label={<FormattedMessage id="primaryCollection" defaultMessage="Primary collection"/>}>
            <FilteredSelectControl
                placeholder={<FormattedMessage
                  id="select.collection"
                  defaultMessage="Select a collection"
                />}
                search={handleCollectionSearch}
                fetching={fetching}
                items={collections}
                titleField="name"
                delay={1000}
              />
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit" disabled={person && !isTouched}>
                {person ?
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

PersonForm.propTypes = {
  person: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ countries, addError }) => ({ countries, addError });

export default withContext(mapContextToProps)(PersonForm);
