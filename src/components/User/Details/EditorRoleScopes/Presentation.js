import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import PresentationItem from '../../../common/PresentationItem';

const EditorRoleScopesPresentation = ({ scopes, user }) => {
  return (
    <dl>
      {scopes && scopes.map(scope => (
        <PresentationItem label={<FormattedMessage id={`scopes.type.${scope.type}`}/>} key={scope.key}>
          <NavLink to={`/${scope.type.toLowerCase()}/${scope.key}`}>
            {scope.title || scope.name}
          </NavLink>
        </PresentationItem>
      ))}
      {user.countryRights && user.countryRights.map(countryCode => <PresentationItem 
        label={<FormattedMessage id={`country`}/>} key={countryCode}>
          <FormattedMessage id={`country.${countryCode}`}/>
        </PresentationItem>
      )}
      {user.namespaceRights && user.namespaceRights.map(namespace => <PresentationItem 
        label={<FormattedMessage id={`namespace`}/>} key={namespace}>
          {namespace}
        </PresentationItem>
      )}
    </dl>
  );
};

EditorRoleScopesPresentation.propTypes = {
  scopes: PropTypes.array
};

export default EditorRoleScopesPresentation;

