import PropTypes from 'prop-types';

// Helpers
import { dateForSafari } from '../util/helpers';

const DateValue = ({ value }) => {
  if (!value) return null;
  return dateForSafari(value).toString();
};

DateValue.propTypes = {
  value: PropTypes.string
};

export default DateValue;