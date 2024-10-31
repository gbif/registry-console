import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// API
import { deprecateConcept } from '../../../../api/vocabulary';
// Enums
import { roles } from '../../../auth/enums';
// Wrappers
import { HasRole } from '../../../auth';
// Components
import { ConfirmButton } from '../../../common';

/**
 * concept Actions component
 * Displays buttons depends on user's roles and scope, and item's state
 * @param concept - active item object
 * @param onChange - callback to invoke any parent process
 * @returns {*}
 * @constructor
 */
const ConceptActions = ({ concept, onChange }) => {
  const deleteItem = () => {
    deprecateConcept(concept?.vocabularyName, concept).then(() => onChange()).catch(onChange);
  };

  return (
    <React.Fragment>
      <HasRole roles={[roles.VOCABULARY_ADMIN]}>
        {concept.deprecated ? null : (
          <ConfirmButton
            title={
              <FormattedMessage
                id="deprecate.confirmation.concept"
                defaultMessage="Are you sure to deprecate this concept?"
              />
            }
            btnText={<FormattedMessage id="deprecate.concept" defaultMessage="Deprecate this concept"/>}
            onConfirm={deleteItem}
          />
        )}
      </HasRole>
    </React.Fragment>
  );
};

ConceptActions.propTypes = {
  concept: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ConceptActions;