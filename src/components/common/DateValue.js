import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import injectSheet from 'react-jss';

const styles = {
  date: {
    display: 'inline-flex',
    width: '245px',
    justifyContent: 'space-between'
  }
};

const DateValue = ({ value, classes }) => {
  if (!value) return null;

  return (
    <div className={classes.date}>
      <span>{moment.utc(value).format('ddd DD MMM YYYY HH:mm:ss')}</span>
      <span>(UTC {moment(value).format('Z')})</span>
    </div>
  );
};

DateValue.propTypes = {
  value: PropTypes.string
};

export default injectSheet(styles)(DateValue);