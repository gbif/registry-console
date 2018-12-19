import React from 'react';
import { FormattedMessage, FormattedDate, FormattedRelative } from 'react-intl';

import { dateTimeFormat } from '../../../config/formats';
import { PresentationItem } from '../../widgets';

const PersonPresentation = ({ person }) => (
  <div>
    {person ? (
      <React.Fragment>
        <dl>
          <PresentationItem label={<FormattedMessage id="firstName" defaultMessage="First name"/>}>
            {person.firstName}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
            {person.email}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="created" defaultMessage="Created"/>}>
            <FormattedRelative value={person.created}/>
            <FormattedDate value={person.created} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="createdBy" defaultMessage="Created by"/>}>
            {person.createdBy}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modified" defaultMessage="Modified"/>}>
            <FormattedRelative value={person.modified}/>
            <FormattedDate value={person.modified} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modifiedBy" defaultMessage="Modified by"/>}>
            {person.modifiedBy}
          </PresentationItem>
        </dl>
      </React.Fragment>
    ) : null}
  </div>
);

export default PersonPresentation;