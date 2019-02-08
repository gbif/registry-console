import PropTypes from 'prop-types';
import moment from 'moment';

const FormattedRelativeDate = ({ value }) => {
  if (!value) return null;
  return moment(value).fromNow();
};

FormattedRelativeDate.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default FormattedRelativeDate;