import React from 'react';
import { FormattedRelative } from 'react-intl';
import PropTypes from 'prop-types';

// Helpers
import { dateForSafari } from '../util/helpers';

const FormattedRelativeDate = ({ value }) => <FormattedRelative value={dateForSafari(value)}/>;

FormattedRelativeDate.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.string.isRequired]).isRequired
};

export default FormattedRelativeDate;