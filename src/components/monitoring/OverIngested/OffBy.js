import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

const styles = {
  badge: {
    color: '#fff',
    padding: '3px 5px',
    borderRadius: '3px',
    wordBreak: 'keep-all'
  },
  red: {
    background: 'tomato'
  },
  yellow: {
    background: 'orange'
  }
};

/**
 * Component counts percentage for Over-ingested dataset
 * @param percentage
 * @param classes
 * @returns {*}
 * @constructor
 */
const OffBy = ({ percentage, classes }) => {
  const formatAsPercentage = percentage => {
    let formattedPercentage = 0;
    if (!isFinite(percentage)) {
      return percentage;
    }

    if (percentage > 101) {
      formattedPercentage = percentage.toFixed();
    } else if (percentage > 100.1) {
      formattedPercentage = percentage.toFixed(1);
    } else if (percentage > 100) {
      formattedPercentage = 100.1;
    } else if (percentage === 100) {
      formattedPercentage = 100;
    } else if (percentage >= 99.9) {
      formattedPercentage = 99.9;
    } else if (percentage > 99) {
      formattedPercentage = percentage.toFixed(1);
    } else if (percentage >= 1) {
      formattedPercentage = percentage.toFixed();
    } else if (percentage >= 0.01) {
      formattedPercentage = percentage.toFixed(2);
    } else if (percentage < 0.01 && percentage !== 0) {
      formattedPercentage = 0.01;
    }

    return formattedPercentage;
  };

  const getClassName = percentage => {
    if (percentage < 5) return;

    const cls = [classes.badge];
    percentage > 60 ? cls.push(classes.red) : cls.push(classes.yellow);

    return cls.join(' ');
  };

  return (
    <span className={getClassName(percentage)}>{formatAsPercentage(percentage)}%</span>
  );
};

OffBy.propTypes = {
  percentage: PropTypes.number.isRequired
};

export default injectSheet(styles)(OffBy);