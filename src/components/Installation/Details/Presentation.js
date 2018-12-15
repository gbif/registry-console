import React from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, FormattedDate, FormattedRelative, injectIntl } from 'react-intl';
import { Badge } from 'antd';
import injectSheet from 'react-jss';

import { dateTimeFormat } from '../../../config/formats';
import PresentationItem from '../../PresentationItem';

const styles = {
  type: {
    '& sup': {
      backgroundColor: '#468847'
    }
  },
  warning: {
    textAlign: 'center',
    backgroundColor: '#fcf8e3',
    border: '1px solid #fbeed5',
    padding: 5,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#c09853'
  }
};

const InstallationPresentation = ({ installation, intl, classes }) => (
  <div>
    {installation ? (
      <React.Fragment>
        <p className="help">
          <FormattedMessage
            id="installationOverviewInfo"
            defaultMessage="This information appears on the installation profile, installation pages, search results, and beyond."
          />
        </p>
        {installation.disabled ? (
          <p className={classes.warning}>
            <b><FormattedMessage id="important" defaultMessage="Important"/>: </b>
            <FormattedMessage
              id="warning.disabledInst"
              defaultMessage="This installation is disabled and no auto updates will occur"
            />
          </p>
        ) : null}
        <dl>
          <PresentationItem label={<FormattedMessage id="installationType" defaultMessage="Installation type"/>}>
            <Badge count={intl.formatMessage({ id: installation.type })} className={classes.type}/>
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="publishingOrganization" defaultMessage="Publishing organization"/>}
          >
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
    ) : null}
  </div>
);

export default injectSheet(styles)(injectIntl(InstallationPresentation));