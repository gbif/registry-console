import React from 'react';
import { FormattedNumber } from 'react-intl';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

const styles = {
  badge: {
    display: 'inline-block',
    padding: '3px 5px',
    borderRadius: '3px',
    wordBreak: 'keep-all',
    margin: '0 3px'
  },
  green: {
    color: '#fff',
    background: '#8fbc8f'
  },
  red: {
    color: '#fff',
    background: 'tomato'
  }
};

/**
 * Displays number as a colored badge with three alternative backgrounds:
 *  - transparent (default)
 *  - red
 *  - green
 * @param number - number to display
 * @param red - true if background should be red
 * @param green - true if background should be green
 * @param classes
 * @returns {*}
 * @constructor
 */
const BadgeValue = ({ value, number, red, green, classes }) => {
  const getClasses = () => {
    const cls = [classes.badge];

    if (red) {
      cls.push(classes.red);
    }
    if (green) {
      cls.push(classes.green);
    }

    return cls.join(' ');
  };

  return (
    <div className={getClasses()}>
      {number ? <FormattedNumber value={value || 0}/> : <span>{value}</span>}
    </div>
  );
};

BadgeValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number]),
  number: PropTypes.bool,
  red: PropTypes.bool,
  green: PropTypes.bool
};

export default injectSheet(styles)(BadgeValue);