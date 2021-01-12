import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// API
import { deprecateVocabulary } from '../../api/vocabulary';
// Enums
import { roles } from '../auth/enums';
// Wrappers
import { HasRole } from '../auth';
// Components
import { ConfirmButton } from '../common';

/**
 * Vocabulary Actions component
 * Displays buttons depends on user's roles and scope, and item's state
 * @param vocabulary - active item object
 * @param onChange - callback to invoke any parent process
 * @returns {*}
 * @constructor
 */
const VocabularyActions = ({ vocabulary, onChange }) => {
  const deleteItem = () => {
    deprecateVocabulary(vocabulary.name).then(() => onChange()).catch(onChange);
  };
  return (
    <React.Fragment>
      <HasRole roles={[roles.VOCABULARY_ADMIN]}>
        {vocabulary.deprecated ? null : (
          <ConfirmButton
            title={
              <FormattedMessage
                id="deprecate.confirmation.vocabulary"
                defaultMessage="Are you sure to deprecate this vocabulary?"
              />
            }
            btnText={<FormattedMessage id="deprecate.vocabulary" defaultMessage="Deprecate this vocabulary"/>}
            onConfirm={deleteItem}
          />
        )}
      </HasRole>
    </React.Fragment>
  );
};

VocabularyActions.propTypes = {
  vocabulary: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default VocabularyActions;