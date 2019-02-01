import React from 'react';
import { FormattedRelative } from 'react-intl';
import PropTypes from 'prop-types';

// Helpers
import { dateForSafari } from '../util/helpers';

const FormattedRelativeDate = ({ value }) => {
  if (!value) return null;
  return <FormattedRelative value={dateForSafari(value)}/>;
};

FormattedRelativeDate.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default FormattedRelativeDate;