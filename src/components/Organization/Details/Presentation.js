import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

// Components
import { BooleanValue, PresentationItem } from '../../common';
import MetaData from '../../common/MetaData';

const OrganizationPresentation = ({ organization }) => (
  <div>
    {organization ?
      <React.Fragment>
        <dl>
          <PresentationItem
            label={<FormattedMessage id="title" defaultMessage="Title"/>}
            helpText={
              <FormattedMessage
                id="help.orgTitle"
                defaultMessage="Enter an accurate organization title as it is used in many key places."
              />
            }
            required
          >
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
            </React.Fragment>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="endorsementApproved" defaultMessage="Endorsement approved"/>}>
            <BooleanValue value={organization.endorsementApproved}/>
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
            {organization.language && <FormattedMessage id={`language.${organization.language}`}/>}
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
            {organization.country && <FormattedMessage id={`country.${organization.country}`}/>}
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
        </dl>
        <MetaData item={organization} />
      </React.Fragment>
      : null}
  </div>
);

OrganizationPresentation.propTypes = {
  organization: PropTypes.object
};

export default OrganizationPresentation;