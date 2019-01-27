import React from 'react';
import { FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

const styles = {
  green: {
    color: '#568f56'
  },
  red: {
    color: 'tomato'
  }
};

const FormattedColoredNumber = ({ value, green, classes }) => {
  const getClassName = green => green ? classes.green : classes.red;

  return (
    <div className={getClassName(green)}>
      {value && <FormattedNumber value={value}/>}
    </div>
  );
};

FormattedColoredNumber.propTypes = {
  value: PropTypes.number,
  green: PropTypes.bool.isRequired
};

export default injectSheet(styles)(FormattedColoredNumber);