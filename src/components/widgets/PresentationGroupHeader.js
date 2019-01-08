import React from 'react';
import injectSheet from 'react-jss';

import Help from './Help';

const styles = {
  header: {
    margin: 0,
    padding: 10,
    background: '#f7f7f7',
    border: '1px solid #eee',
    borderWidth: '1px 0'
  }
};

const PresentationGroupHeader = ({ title, helpText, classes }) => {
  return (
    <h3 className={classes.header}>
      {title}
      <Help title={helpText} />
    </h3>
  );
};

export default injectSheet(styles)(PresentationGroupHeader);