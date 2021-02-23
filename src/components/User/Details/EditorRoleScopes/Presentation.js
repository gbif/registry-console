import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import PresentationItem from '../../../common/PresentationItem';

const EditorRoleScopesPresentation = ({ scopes }) => {
  return (
    <dl>
      {scopes && scopes.map(scope => (
        <PresentationItem label={<FormattedMessage id={`scopes.type.${scope.type}`}/>} key={scope.key}>
          <NavLink to={`/${scope.type.toLowerCase()}/${scope.key}`}>
            {scope.title || scope.name}
          </NavLink>
        </PresentationItem>
      ))}
    </dl>
  );
};

EditorRoleScopesPresentation.propTypes = {
  scopes: PropTypes.array
};

export default EditorRoleScopesPresentation;

