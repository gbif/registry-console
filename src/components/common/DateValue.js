import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import injectSheet from 'react-jss';
import { Tooltip } from 'antd';

const styles = {
  date: {
    // display: 'inline-block',
    // width: '250px',
    // justifyContent: 'space-between'
  }
};

const DateValue = ({ value, classes }) => {
  if (!value) return null;

  return (
    <span className={classes.date}>
      <Tooltip placement="topLeft" title={`${moment(value).format('ddd DD MMM YYYY HH:mm:ss')} (UTC ${moment(value).format('Z')}`}>
        <span>{moment.utc(value).format('ddd DD MMM YYYY HH:mm:ss')}</span>
        {/* <span>(UTC {moment.utc(value).format('Z')})</span> */}
      </Tooltip>
    </span>
  );
};

DateValue.propTypes = {
  value: PropTypes.string
};

export default injectSheet(styles)(DateValue);