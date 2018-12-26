import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import injectSheet from 'react-jss';

import Exception404 from '../exception/404';
import Exception500 from '../exception/500';

const styles = {
  loader: {
    display: 'flex',
    height: '50vh',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

const PageWrapper = ({ status, loading, children, classes }) => {
  let content;

  switch (status) {
    case 404:
      content = <Exception404/>;
      break;
    case 500:
      content = <Exception500/>;
      break;
    default:
      content = children;
      break;
  }

  return (
    <React.Fragment>
      {loading ? <Spin size="large" className={classes.loader}/> : content}
    </React.Fragment>
  );
};

PageWrapper.propTypes = {
  status: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired
};

export default injectSheet(styles)(PageWrapper);