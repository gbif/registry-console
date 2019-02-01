import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import { PresentationItem } from '../../common';
import MetaData from '../../common/MetaData';
import { NavLink } from 'react-router-dom';

const PersonPresentation = ({ person }) => (
  <div>
    {person ? (
      <React.Fragment>
        <dl>
          <PresentationItem label={<FormattedMessage id="firstName" defaultMessage="First name"/>}>
            {person.firstName}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}>
            {person.lastName}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="position" defaultMessage="Position"/>}>
            {person.position}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="areaResponsibility" defaultMessage="Area responsibility"/>}>
            {person.areaResponsibility}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="researchPursuits" defaultMessage="Research pursuits"/>}>
            {person.researchPursuits}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="phone" defaultMessage="Phone"/>}>
            {person.phone}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="fax" defaultMessage="Fax"/>}>
            {person.fax}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
            {person.email}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="address" defaultMessage="Address"/>}>
            {person.mailingAddress && person.mailingAddress.address}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="city" defaultMessage="City"/>}>
            {person.mailingAddress && person.mailingAddress.city}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="province" defaultMessage="Province"/>}>
            {person.mailingAddress && person.mailingAddress.province}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
            {person.mailingAddress && person.mailingAddress.country && (
              <FormattedMessage id={`country.${person.mailingAddress.country}`}/>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
            {person.mailingAddress && person.mailingAddress.postalCode}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="primaryInstitution" defaultMessage="Primary institution"/>}>
            {person.institution && (
              <NavLink to={`/institution/${person.primaryInstitutionKey}`}>
                {person.institution.name}
              </NavLink>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="primaryCollection" defaultMessage="Primary collection"/>}>
            {person.collection && (
              <NavLink to={`/collection/${person.primaryCollectionKey}`}>
                {person.collection.name}
              </NavLink>
            )}
          </PresentationItem>
        </dl>
        <MetaData item={person} />
      </React.Fragment>
    ) : null}
  </div>
);

PersonPresentation.propTypes = {
  person: PropTypes.object
};

export default PersonPresentation;