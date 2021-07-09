import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { FormattedRelative } from 'react-intl';

const FormattedRelativeDate = ({ value }) => {
  if (!value) return null;
  // return moment(value).fromNow();
  return <FormattedRelative value={value} />
};

FormattedRelativeDate.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default FormattedRelativeDate;