import React from 'react';
import { FormattedMessage, FormattedDate, FormattedRelative, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Badge } from 'antd';
import injectSheet from 'react-jss';

import { dateTimeFormat } from '../../../config/formats';
import PresentationItem from '../../PresentationItem';

const styles = {
  approved: {
    marginLeft: '10px',
    '& sup': {
      backgroundColor: '#468847'
    }
  },
  awaiting: {
    marginLeft: '10px',
    '& sup': {
      backgroundColor: '#b94a48'
    }
  }
};

const OrganizationPresentation = ({ organization, classes, intl }) => (
  <div>
    {organization ?
      <React.Fragment>
        <p className="help">
          <small>
            <FormattedMessage
              id="orgOverviewInfo"
              defaultMessage="This information appears on the organization profile, organization pages, search results, and beyond."
            />
          </small>
        </p>
        <dl>
          <PresentationItem label={<FormattedMessage id="title" defaultMessage="Title"/>}>
            {organization.title}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="abbreviation" defaultMessage="Abbreviation"/>}>
            {organization.abbreviation}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            {organization.description}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="endorsingNode" defaultMessage="Endorsing node"/>}>
            <React.Fragment>
              <NavLink to={`/node/${organization.endorsingNodeKey}`}>
                {organization.endorsingNode.title}
              </NavLink>
              {organization.endorsementApproved ?
                <Badge
                  count={intl.formatMessage({ id: 'approved', defaultMessage: 'Approved' })}
                  className={classes.approved}
                /> :
                <Badge
                  count={intl.formatMessage({ id: 'awaitingApproval', defaultMessage: 'Awaiting approval' })}
                  className={classes.awaiting}
                />
              }
            </React.Fragment>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            {organization.homepage ? organization.homepage.map(((item, i) => (
              <a href={item} key={i} target="_blank" rel="noopener noreferrer">{item}</a>
            ))) : null}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>}>
            {organization.logoUrl}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="language" defaultMessage="Language"/>}>
            {organization.language}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="address" defaultMessage="Address"/>}>
            {organization.address}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="city" defaultMessage="City"/>}>
            {organization.city}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="province" defaultMessage="Province"/>}>
            {organization.province}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
            <FormattedMessage id={`country.${organization.country}`} defaultMessage="Country"/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
            {organization.postalCode}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
            {organization.email}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="phone" defaultMessage="Phone"/>}>
            {organization.phone}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="latitude" defaultMessage="Latitude"/>}>
            {organization.latitude}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="longitude" defaultMessage="Longitude"/>}>
            {organization.longitude}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="created" defaultMessage="Created"/>}>
            <FormattedRelative value={organization.created}/>
            <FormattedDate value={organization.created} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="createdBy" defaultMessage="Created by"/>}>
            {organization.createdBy}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modified" defaultMessage="Modified"/>}>
            <FormattedRelative value={organization.modified}/>
            <FormattedDate value={organization.modified} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modifiedBy" defaultMessage="Modified by"/>}>
            {organization.modifiedBy}
          </PresentationItem>
        </dl>
      </React.Fragment>
      : null}
  </div>
);

export default injectIntl(injectSheet(styles)(OrganizationPresentation));