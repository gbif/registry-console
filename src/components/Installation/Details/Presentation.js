import React from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Badge } from 'antd';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

// Components
import { BooleanValue, PresentationItem } from '../../common';
import MetaData from '../../common/MetaData';

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
                id="help.instTitle"
                defaultMessage="Enter an accurate installation title as it is used in many key places."
              />
            }
          >
            {installation.title}
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="description" defaultMessage="Description"/>}
            helpText={
              <FormattedMessage
                id="help.instDescription"
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
                id="help.instPublishingOrg"
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
                id="help.instType"
                defaultMessage="When changing this, verify all services are also updated for the installation, and every dataset served. Most likely you do not want to change this field, but rather create a new installation of the correct type, and migrate datasets. Use this with extreme caution"
              />
            }
          >
            <Badge count={intl.formatMessage({ id: `installationType.${installation.type}` })} className={classes.type}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="disabled" defaultMessage="Disabled"/>}>
            <BooleanValue value={installation.disabled}/>
          </PresentationItem>
        </dl>
        <MetaData item={installation} />
      </React.Fragment>
    ) : null}
  </div>
);

InstallationPresentation.propTypes = {
  installation: PropTypes.object
};

export default injectSheet(styles)(injectIntl(InstallationPresentation));