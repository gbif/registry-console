import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import { BooleanValue, PresentationItem } from '../../../index';

const ContactPresentation = ({ contact }) => {
  return (
    <React.Fragment>
      {contact && (
        <dl>
          <PresentationItem
            label={<FormattedMessage id="primary" defaultMessage="Primary"/>}
            helpText={
              <FormattedMessage
                id="help.primaryCheckboxTip"
                defaultMessage="Indicates that the contact is the primary contact for the given type"
              />
            }
          >
            <BooleanValue value={contact.primary}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="firstName" defaultMessage="First name"/>}>
            {contact.firstName}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}>
            {contact.lastName}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="position" defaultMessage="Position"/>}>
            {contact.position && contact.position.length > 0 ? contact.position : null}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="notes" defaultMessage="Notes"/>}>
            {contact.notes}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
            {contact.email && contact.email.length > 0 ? contact.email : null}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="phone" defaultMessage="Phone"/>}>
            {contact.phone && contact.phone.length > 0 ? contact.phone : null}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="address" defaultMessage="Address"/>}>
            {contact.address && contact.address.length > 0 ? contact.address : null}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="city" defaultMessage="City"/>}>
            {contact.city}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="province" defaultMessage="Province"/>}>
            {contact.province}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
            {contact.country}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
            {contact.postalCode}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="userId" defaultMessage="User ID"/>}>
            {contact.userIds && contact.userIds.length > 0 && <>
              {contact.userIds.map((x, index) => <div key={`${x.type}_${index}`}>
              {x.id} <span style={{color: '#aaa', margin: '0 10px'}}><FormattedMessage id={`idType.${x.type}`} defaultMessage={x.type} /></span>
                </div>)}
            </>}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="taxonomicExpertise" defaultMessage="Taxonomic expertise"/>}>
            {contact.taxonomicExpertise && contact.taxonomicExpertise.length > 0 ? contact.taxonomicExpertise : null}
          </PresentationItem>
        </dl>
      )}
    </React.Fragment>
  );
};

ContactPresentation.propTypes = {
  contact: PropTypes.object.isRequired
};

export default ContactPresentation;