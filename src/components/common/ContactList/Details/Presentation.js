import React from 'react';
import { FormattedMessage } from 'react-intl';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

// Components
import { BooleanValue, PresentationItem } from '../../../widgets';

const styles = {
  modalPresentation: {
    marginBottom: 0,
    '& > div > div': {
      marginBottom: 0
    }
  }
};

const ContactPresentation = ({ contact, classes }) => {
  return (
    <React.Fragment>
      {contact && (
        <dl className={classes.modalPresentation}>
          <PresentationItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
            {contact.type && <FormattedMessage id={`contactType.${contact.type}`}/>}
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="primary" defaultMessage="Primary"/>}
            helpText={
              <FormattedMessage
                id="primaryCheckboxTip"
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
          <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            {contact.description}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
            {contact.email && contact.email.length > 0 ? contact.email : null}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="phone" defaultMessage="Phone"/>}>
            {contact.phone && contact.phone.length > 0 ? contact.phone : null}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            {contact.homepage && contact.homepage.length > 0 ? contact.homepage.map(((item, i) => (
              <a href={item} key={i} target="_blank" rel="noopener noreferrer">{item}</a>
            ))) : null}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="organization" defaultMessage="Organization"/>}>
            {contact.organization}
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
            {contact.userId && contact.userId.length > 0 ? contact.userId : null}
          </PresentationItem>
        </dl>
      )}
    </React.Fragment>
  );
};

ContactPresentation.propTypes = {
  contact: PropTypes.object.isRequired
};

export default injectSheet(styles)(ContactPresentation);