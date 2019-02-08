import PropTypes from 'prop-types';
import moment from 'moment';

const DateValue = ({ value }) => {
  if (!value) return null;
  return `${moment.utc(value).format('ddd DD MMM YYYY HH:mm:ss')} (UTC ${moment(value).format('Z')})`;
};

DateValue.propTypes = {
  value: PropTypes.string
};

export default DateValue;