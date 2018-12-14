import React from 'react';
import { FormattedMessage } from 'react-intl';
import PresentationItem from '../PresentationItem';

const UserPresentation = ({ user }) => (
  <div>
    {user ?
      <React.Fragment>
        <dl>
          <PresentationItem label={<FormattedMessage id="userName" defaultMessage="User name"/>}>
            {user.userName}
          </PresentationItem>
        </dl>
      </React.Fragment>
      : null}
  </div>
);

export default UserPresentation;