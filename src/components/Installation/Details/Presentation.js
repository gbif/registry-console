import React from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, FormattedDate, FormattedRelative, injectIntl } from 'react-intl';
import { Badge } from 'antd';

import { dateTimeFormat } from '../../../config/formats';
import PresentationItem from '../../PresentationItem';

const InstallationPresentation = ({ installation, intl }) => (
  <div>
    {installation ?
      <React.Fragment>
        <p style={{ color: '#999', marginBottom: '10px' }}>
          <small>
            <FormattedMessage
              id="installationOverviewInfo"
              defaultMessage="This information appears on the installation profile, installation pages, search results, and beyond."
            />
          </small>
        </p>
        <dl>
          <PresentationItem label={<FormattedMessage id="installationType" defaultMessage="Installation type"/>}>
            <Badge count={intl.formatMessage({ id: installation.type })} style={{ backgroundColor: '#468847' }}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="publishingOrganization" defaultMessage="Publishing organization"/>}>
            <React.Fragment>
              <NavLink to={`/organization/${installation.organizationKey}`}>
                {installation.organization.title}
              </NavLink>
            </React.Fragment>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="title" defaultMessage="Title"/>}>
            {installation.title}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            {installation.description}
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
      : null}
  </div>
);

export default injectIntl(InstallationPresentation);