import React from 'react';
import { FormattedMessage } from 'react-intl';
import injectSheet from 'react-jss';

import { BooleanValue, PresentationItem } from '../../../widgets';

const styles = {
  modalPresentation: {
    marginBottom: 0,
    '& > div > div': {
      marginBottom: 0
    }
  }
};

const ContactPresentation = ({ data, classes }) => {
  return (
    <React.Fragment>
      {data && (
        <dl className={classes.modalPresentation}>
          <PresentationItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
            {data.type}
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
            <BooleanValue value={data.primary}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="firstName" defaultMessage="First name"/>}>
            {data.firstName}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}>
            {data.lastName}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="position" defaultMessage="Position"/>}>
            {data.position && data.position.length > 0 ? data.position : null}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            {data.description}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
            {data.email && data.email.length > 0 ? data.email : null}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="phone" defaultMessage="Phone"/>}>
            {data.phone && data.phone.length > 0 ? data.phone : null}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            {data.homepage && data.homepage.length > 0 ? data.homepage.map(((item, i) => (
              <a href={item} key={i} target="_blank" rel="noopener noreferrer">{item}</a>
            ))) : null}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="organization" defaultMessage="Organization"/>}>
            {data.organization}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="address" defaultMessage="Address"/>}>
            {data.address && data.address.length > 0 ? data.address : null}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="city" defaultMessage="City"/>}>
            {data.city}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="province" defaultMessage="Province"/>}>
            {data.province}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
            {data.country}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
            {data.postalCode}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="userId" defaultMessage="User ID"/>}>
            {data.userId && data.userId.length > 0 ? data.userId : null}
          </PresentationItem>
        </dl>
      )}
    </React.Fragment>
  );
};

export default injectSheet(styles)(ContactPresentation);