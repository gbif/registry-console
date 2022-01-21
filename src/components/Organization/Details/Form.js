// import { Form } from '@ant-design/compatible';
// import '@ant-design/compatible/assets/index.css';
import { Button, Col, Input, Row, Select, Form } from 'antd';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
// APIs
import { getNodeSuggestions } from '../../../api/node';
import { createOrganization, updateOrganization } from '../../../api/organization';
// Components
import { FilteredSelectControl, FormItem, MapComponent, TagControl } from '../../common';
// Wrappers
import withContext from '../../hoc/withContext';
// Helpers
import { validateEmail, validatePhone, validateUrl } from '../../util/validators';



const TextArea = Input.TextArea;
const Option = Select.Option;

const OrganizationForm = props => {
  const { organization , onSubmit, onCancel, addError, languages, countries, intl } = props;
  const [form] = Form.useForm();
  const [isTouched, setIsTouched] = useState(false)
  const [nodes, setNodes] = useState(organization && organization.endorsingNode ? [organization.endorsingNode] : [])
  const [fetching, setFetching] = useState(false)
  const [latLng, setLatLng] = useState({latitude: organization?.latitude || 0, longitude: organization?.longitude || 0})
  

  const handleSubmit = (values) => {

        if (!organization) {
          createOrganization({data: values})
            .then(response => onSubmit(response.data))
            .catch(error => {
              addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updateOrganization({ ...organization, ...values })
            .then(() => onSubmit())
            .catch(error => {
              addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      
  };

  const handleSearch = value => {
    if (!value) {
      setNodes([])
      return;
    }
    setFetching(true)

    getNodeSuggestions({ q: value }).then(response => {
      setNodes(response.data)
      setFetching(false)
      
    });
  };

  const getCoordinates = (latitude, longitude) => {
    setLatLng({ latitude, longitude })
    setIsTouched(true)
    form.setFieldsValue({ latitude, longitude });
  };

  
   let initialValues = {...organization}
    return (
      <React.Fragment>
        <Form onFinish={handleSubmit} initialValues={initialValues} form={form} onValuesChange={(info) => {
          console.log(info)
          setIsTouched(true)
        }}>
          <FormItem
            name='title'
            rules={[{
              required: true, message: <FormattedMessage id="provide.title" defaultMessage="Please provide a title"/>
            }]}
            label={<FormattedMessage id="title" defaultMessage="Title"/>}
            helpText={
              <FormattedMessage
                id="help.orgTitle"
                defaultMessage="Enter an accurate organization title as it is used in many key places."
              />
            }
          >
             <Input/>
          </FormItem>
          <FormItem name='abbreviation' label={<FormattedMessage id="abbreviation" defaultMessage="Abbreviation"/>}>
            <Input/>
          </FormItem>
          <FormItem name='description' label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            <TextArea rows={4}/>
          </FormItem>

          <FormItem
            name='endorsingNodeKey'
            rules={[{
              required: true,
              message: <FormattedMessage
                id="provide.endorsingNode"
                defaultMessage="Please provide an endorsing node"
              />
            }]}
            label={<FormattedMessage id="endorsingNode" defaultMessage="Endorsing node"/>}
            warning={
              <FormattedMessage
                id="warning.endorsingNode"
                defaultMessage="The node that has verified the organization should publish through GBIF"
              />
            }
            isNew={!organization}
          >
            <FilteredSelectControl
                placeholder={<FormattedMessage
                  id="select.endorsingNode"
                  defaultMessage="Select an endorsing node"
                />}
                search={handleSearch}
                fetching={fetching}
                items={nodes}
                delay={1000}
              />
          </FormItem>

{/*           <FormItem
            label={<FormattedMessage id="endorsementApproved" defaultMessage="Endorsement approved"/>}
            warning={
              <FormattedMessage
                id="warning.endorsementApproved"
                defaultMessage="Has the endorsement been approved?"
              />
            }
            isNew={!organization}
          >
            {getFieldDecorator('endorsementApproved', {
              initialValue: organization && organization.endorsementApproved,
              defaultValue: false
            })(
              <Switch
                checkedChildren={<FormattedMessage id="approved" defaultMessage="Approved"/>}
                unCheckedChildren={<FormattedMessage id="awaitingApproval" defaultMessage="Awaiting approval"/>}
                defaultChecked={organization && organization.endorsementApproved}
              />
            )}
          </FormItem> */}

          <FormItem 
            name='homepage'
            initialValue={[]}
            rules={[{
                validator: validateUrl(<FormattedMessage id="invalid.homepage" defaultMessage="Homepage is invalid"/>)
              }]}
              label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
               <TagControl label={<FormattedMessage id="newHomepage" defaultMessage="New homepage"/>} removeAll={true}/> 
          </FormItem>

          <FormItem 
            name='logoUrl'
            rules={[{
              validator: validateUrl(
                <FormattedMessage id="invalid.url.logo" defaultMessage="Logo url is invalid"/>
              )
            }]}
            label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>}>
              <Input/>
          </FormItem>

          <FormItem 
            name='language'
            rules={[{
              required: true,
              message: <FormattedMessage id="provide.language" defaultMessage="Please provide a language"/>
            }]}
            label={<FormattedMessage id="language" defaultMessage="Language"/>}>
            <Select
                showSearch
                optionFilterProp="children"
                placeholder={<FormattedMessage id="select.language" defaultMessage="Select a language"/>}
                filterOption={
                  (input, option) => {
                    // We need to translate language code before we'll be able to compare it with input
                    const langTranslation = intl.formatMessage({
                      id: option.props.children.props.id,
                      defaultMessage: ''
                    });
                    // if there is a translation for language code and it contains user's input then return true
                    return langTranslation && langTranslation.toLowerCase().includes(input.toLowerCase());
                  }
                }
              >
                {languages.map(language => (
                  <Option value={language} key={language}>
                    <FormattedMessage id={`language.${language}`}/>
                  </Option>
                ))}
              </Select>
          </FormItem>

          <FormItem name='address' initialValue={[]} rules={[{
                required: !organization
              }]} label={<FormattedMessage id="address" defaultMessage="Address"/>}>
              <TagControl label={<FormattedMessage id="newAddress" defaultMessage="New address"/>} removeAll={true}/>

          </FormItem>

          <FormItem name='city' rules={[{
                  required: !organization,
                }]} label={<FormattedMessage id="city" defaultMessage="City"/>}>
                  <Input/>
          </FormItem>

          <FormItem name='province' rules={[{
                  required: !organization,
                }]} label={<FormattedMessage id="province" defaultMessage="Province"/>}>
                  <Input/>
          </FormItem>

          <FormItem name='country' rules={[{
                  required: !organization,
                }]} label={<FormattedMessage id="country" defaultMessage="Country"/>}>
                  <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
                {countries.map(country => (
                  <Option value={country} key={country}>
                    <FormattedMessage id={`country.${country}`}/>
                  </Option>
                ))}
              </Select>
          </FormItem>

          <FormItem name='postalCode' rules={[{
                  required: !organization
                }]} label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
                   <Input/>
          </FormItem>

          <FormItem name='email' initialValue={[]} rules={[{
                required: !organization,
                validator: validateEmail(<FormattedMessage id="invalid.email" defaultMessage="Email is invalid"/>)
              }]} label={<FormattedMessage id="email" defaultMessage="Email"/>}>
                 <TagControl label={<FormattedMessage id="newEmail" defaultMessage="New email"/>} removeAll={true}/>
          </FormItem>

          <FormItem name='phone' initialValue={[]} rules={[{
                validator: validatePhone(<FormattedMessage id="invalid.phone" defaultMessage="Phone is invalid"/>)
              }]} label={<FormattedMessage id="phone" defaultMessage="Phone"/>}>
                <TagControl label={<FormattedMessage id="newPhone" defaultMessage="New phone"/>} removeAll={true}/>
          </FormItem>

          <FormItem name='latitude' label={<FormattedMessage id="latitude" defaultMessage="Latitude"/>}>
            <Input/>
          </FormItem>

          <FormItem name='longitude' label={<FormattedMessage id="longitude" defaultMessage="Longitude"/>}>
            <Input/>
          </FormItem>

          <MapComponent
            lat={latLng.latitude}
            lng={latLng.longitude}
            getCoordinates={getCoordinates}
            helpText={<FormattedMessage
              id="help.coordinates"
              defaultMessage="Use map to select your coordinates manually"
            />}
          />

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit" disabled={organization && !isTouched}>
                {organization ?
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

OrganizationForm.propTypes = {
  organization: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ countries, languages, addError, user }) => ({ countries, languages, addError, user });

export default withContext(mapContextToProps)(injectIntl(OrganizationForm));
