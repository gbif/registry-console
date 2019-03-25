import React from 'react';
// import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// import PresentationItem from '../../../common/PresentationItem';

const EditorRoleScopesPresentation = scopes => {
  console.log('scopes:', scopes);
  return (
    <dl>
      {/*{scopes && scopes.map(scope => (
        <PresentationItem label={<FormattedMessage id="created" defaultMessage="Created"/>}>
          {item.created && <FormattedRelativeDate value={item.created}/>}
          {item.created && <DateValue value={item.created}/>}
        </PresentationItem>
      ))}*/}
    </dl>
  );
};

EditorRoleScopesPresentation.propTypes = {
  scopes: PropTypes.array
};

export default EditorRoleScopesPresentation;

