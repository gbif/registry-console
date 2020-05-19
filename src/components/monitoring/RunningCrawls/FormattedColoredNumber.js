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
  },
  number: {
    wordBreak: 'keep-all'
  }
};

const FormattedColoredNumber = ({ value, green, classes }) => {
  const getClassName = green => {
    if (typeof green === 'undefined') return classes.number;

    return [classes.number, green ? classes.green : classes.red].join(' ');
  };

  return (
    <div className={getClassName(green)}>
      {value && <FormattedNumber value={value}/>}
    </div>
  );
};

FormattedColoredNumber.propTypes = {
  value: PropTypes.number,
  green: PropTypes.bool
};

export default injectSheet(styles)(FormattedColoredNumber);