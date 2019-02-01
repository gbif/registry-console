import React from 'react';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

const styles = {
  text: {
    wordBreak: 'keep-all'
  }
};

const TableTitle = ({ title, text, classes }) => {
  return (
      <Tooltip placement="top" title={title}>
        <span className={classes.text}>{text}</span>
      </Tooltip>
  );
};

TableTitle.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default injectSheet(styles)(TableTitle);