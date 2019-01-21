import React from 'react';
import { FormattedRelative } from 'react-intl';
import PropTypes from 'prop-types';

// Helpers
import { dateForSafari } from '../util/helpers';

const FormattedRelativeDate = ({ value }) => {
  return <FormattedRelative value={dateForSafari(value)}/>;
};

FormattedRelativeDate.propTypes = {
  value: PropTypes.string.isRequired
};

export default FormattedRelativeDate;