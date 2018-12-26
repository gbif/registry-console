import React from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, FormattedDate, FormattedRelative, injectIntl } from 'react-intl';
import { Badge } from 'antd';
import injectSheet from 'react-jss';

import { dateTimeFormat } from '../../../config/config';
import { PresentationItem } from '../../widgets';

const styles = {
  type: {
    '& sup': {
      backgroundColor: '#468847'
    }
  }
};

const InstallationPresentation = ({ installation, intl, classes }) => (
  <div>
    {installation ? (
      <React.Fragment>
        <dl>
          <PresentationItem
            label={<FormattedMessage id="title" defaultMessage="Title"/>}
            helpText={
              <FormattedMessage
                id="instTitleExtra"
                defaultMessage="Enter an accurate installation title as it is used in many key places."
              />
            }
            required
          >
            {installation.title}
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="description" defaultMessage="Description"/>}
            helpText={
              <FormattedMessage
                id="instDescriptionExtra"
                defaultMessage="Provide a meaningful description of the installation, so a user will understand what the installation is."
              />
            }
          >
            {installation.description}
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="publishingOrganization" defaultMessage="Publishing organization"/>}
            helpText={
              <FormattedMessage
                id="instPublishingOrgExtra"
                defaultMessage="It is expected that this may be changed occasionally, but be vigilant in changes as this has potential to spawn significant processing for occurrence records, metrics and maps"
              />
            }
          >
            <React.Fragment>
              <NavLink to={`/organization/${installation.organizationKey}`}>
                {installation.organization.title}
              </NavLink>
            </React.Fragment>
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="installationType" defaultMessage="Installation type"/>}
            helpText={
              <FormattedMessage
                id="instTypeExtra"
                defaultMessage="When changing this, verify all services are also updated for the installation, and every dataset served. Most likely you do not want to change this field, but rather create a new installation of the correct type, and migrate datasets. Use this with extreme caution"
              />
            }
          >
            <Badge count={intl.formatMessage({ id: installation.type })} className={classes.type}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="disabled" defaultMessage="Disabled"/>}>
            <Badge status={installation.disabled ? 'success' : 'error'} text={`${installation.disabled}`}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="created" defaultMessage="Created"/>}>
            <FormattedRelative value={installation.created}/>
            <FormattedDate value={installation.created} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="createdBy" defaultMessage="Created by"/>}>
            {installation.createdBy}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modified" defaultMessage="Modified"/>}>
            <FormattedRelative value={installation.modified}/>
            <FormattedDate value={installation.modified} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modifiedBy" defaultMessage="Modified by"/>}>
            {installation.modifiedBy}
          </PresentationItem>
        </dl>
      </React.Fragment>
    ) : null}
  </div>
);

export default injectSheet(styles)(injectIntl(InstallationPresentation));