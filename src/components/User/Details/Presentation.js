import React from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import { PresentationItem, DateValue } from '../../common';

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
      {user && (
        <React.Fragment>
          <dl>
            <PresentationItem
              label={<FormattedMessage id="userName" defaultMessage="User name"/>}
              helpText={
                <FormattedMessage
                  id="help.userName"
                  defaultMessage="You can log in using a username or an email address."
                />
              }
            >
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
              <DateValue value={user.lastLogin}/>
            </PresentationItem>
            <PresentationItem
              label={<FormattedMessage id="settings" defaultMessage="Settings"/>}
              helpText={
                <FormattedMessage
                  id="help.userCountry"
                  defaultMessage="This is used for reporting purposes"
                />
              }
            >
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
      )}
    </div>
  );
};

UserPresentation.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserPresentation;