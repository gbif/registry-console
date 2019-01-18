import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';

const CountMessage = ({id='nResults', count=0, defaultMessage='{formattedNumber}'}) => (
  <FormattedMessage
    id={id}
    defaultMessage={defaultMessage || 'Loading'}
    values={{ formattedNumber: <FormattedNumber value={count}/>, count: count }}
  />
)

CountMessage.propTypes = {
  id: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  defaultMessage: PropTypes.object,
};

export default injectIntl(CountMessage);
