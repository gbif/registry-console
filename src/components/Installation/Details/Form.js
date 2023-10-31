import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Input, Select, Checkbox, Col, Row, Form } from 'antd';
import PropTypes from 'prop-types';

// APIs
import { createInstallation, updateInstallation } from '../../../api/installation';
import { getOrgSuggestions } from '../../../api/organization';
// Wrappers
import withContext from '../../hoc/withContext';
// Components
import { FilteredSelectControl, FormItem } from '../../common';
import { getPermittedOrganizations } from '../../util/helpers';

const TextArea = Input.TextArea;

const InstallationForm = props => {
  const {installationTypes, installation , onSubmit, onCancel, addError, user} = props;

  const [organizations, setorganizations] = useState(installation && installation.organization ? [installation.organization] : [])
  const [fetching, setFetching] = useState(false)

  const handleSearch = value => {
    if (!value) {
      setorganizations([])
      return;
    }
    setorganizations([])
    setFetching(true)

    getOrgSuggestions({ q: value }).then(response => {
      setorganizations(getPermittedOrganizations(user, response.data))
      setFetching(false)
      
    }).catch(() => {
      setFetching(false)
    });
  };

  const handleSubmit = (values) => {

        if (!installation) {
          createInstallation(values)
            .then(response => onSubmit(response.data))
            .catch(error => {
              addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updateInstallation({ ...installation, ...values })
            .then(() => onSubmit())
            .catch(error => {
              addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      
   
  };

   let initialValues = {...installation}

    return (
      <React.Fragment>
        <Form onFinish={handleSubmit} initialValues={initialValues}>
          <FormItem
            name='title'
            rules={[{
              required: true,
              message: <FormattedMessage id="provide.title" defaultMessage="Please provide a title"/>
            }]}
            label={<FormattedMessage id="title" defaultMessage="Title"/>}
            helpText={
              <FormattedMessage
                id="help.instTitle"
                defaultMessage="Enter an accurate installation title as it is used in many key places."
              />
            }
          >
            <Input/>
          </FormItem>

          <FormItem
          name='description'
            label={<FormattedMessage id="description" defaultMessage="Description"/>}
            helpText={
              <FormattedMessage
                id="help.instDescription"
                defaultMessage="Provide a meaningful description of the installation, so a user will understand what the installation is."
              />
            }
          >
            <TextArea rows={4}/>
          </FormItem>

          <FormItem
          name='organizationKey'
          rules={[{
            required: true,
            message: <FormattedMessage id="provide.organization" defaultMessage="Please provide an organization"/>
          }]}
            label={<FormattedMessage id="publishingOrganization" defaultMessage="Publishing organization"/>}
            helpText={
              <FormattedMessage
                id="help.instPublishingOrg"
                defaultMessage="It is expected that this may be changed occasionally, but be vigilant in changes as this has potential to spawn significant processing for occurrence records, metrics and maps"
              />
            }
            warning={
              <FormattedMessage
                id="warning.publishingOrganization"
                defaultMessage="Changing this will update hosting organization on all occurrence records."
              />
            }
            isNew={!installation}
          >
            <FilteredSelectControl
                placeholder={<FormattedMessage id="select.organization" defaultMessage="Select an organization"/>}
                search={handleSearch}
                fetching={fetching}
                items={organizations}
                delay={1000}
              />
          </FormItem>

          <FormItem
          name='type'
          rules= {[{
            required: true,
            message: <FormattedMessage id="provide.type" defaultMessage="Please provide a type"/>
          }]}
            label={<FormattedMessage id="installationType" defaultMessage="Installation type"/>}
            helpText={
              <FormattedMessage
                id="help.instType"
                defaultMessage="When changing this, verify all services are also updated for the installation, and every dataset served. Most likely you do not want to change this field, but rather create a new installation of the correct type, and migrate datasets. Use this with extreme caution"
              />
            }
            warning={<FormattedMessage
              id="warning.installationType"
              defaultMessage="Has significant impact on crawlers"
            />}
            isNew={!installation}
          >
            <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}>
                {installationTypes.map(installationType => (
                  <Select.Option value={installationType} key={installationType}>
                    <FormattedMessage id={`installationType.${installationType}`}/>
                  </Select.Option>
                ))}
              </Select>
          </FormItem>

          <FormItem
            name='disabled'
            valuePropName='checked'
            label={<FormattedMessage id="disabled" defaultMessage="Disabled"/>}
            helpText={
              <FormattedMessage
                id="help.disabledCheckboxTip"
                defaultMessage="Indicates that the installation is disabled and no metasync or crawling of associated datasets will occur"
              />
            }
          >
           <Checkbox/>
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit">
                {installation ?
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

InstallationForm.propTypes = {
  installation: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ installationTypes, addError, user }) => ({ installationTypes, addError, user });

export default withContext(mapContextToProps)(InstallationForm);
