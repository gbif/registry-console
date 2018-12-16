import React from 'react';
import { FormattedMessage, FormattedDate, FormattedRelative } from 'react-intl';

import { dateTimeFormat } from '../../../config/formats';
import { PresentationItem } from '../../widgets';

const UserPresentation = ({ user }) => {
  const getSettings = settings => {
    const result = [];

    for (const key in settings) {
      if (settings.hasOwnProperty(key)) {
        result.push(`${key} => ${settings[key]}`);
      }
    }

    return result;
  };

  return (
    <div>
      {user ?
        <React.Fragment>
          <dl>
            <PresentationItem label={<FormattedMessage id="userName" defaultMessage="User name"/>}>
              {user.userName}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
              {user.email}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="firstName" defaultMessage="First name"/>}>
              {user.firstName}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}>
              {user.lastName}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="lastLogin" defaultMessage="Last login"/>}>
              <FormattedRelative value={user.lastLogin}/>
              <FormattedDate value={user.lastLogin} {...dateTimeFormat}/>
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="settings" defaultMessage="Settings"/>}>
              {getSettings(user.settings)}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="systemSettings" defaultMessage="System settings"/>}>
              {getSettings(user.systemSettings)}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="roles" defaultMessage="Roles"/>}>
              {user.roles}
            </PresentationItem>
          </dl>
        </React.Fragment>
        : null}
    </div>
  );
};

export default UserPresentation;