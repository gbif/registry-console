import React from 'react';
import injectSheet from 'react-jss';
import LoadBar from './LoadBar';

const styles = theme => ({
  blocker: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 10000,
    backgroundColor: '#ffffff88'
  }
});

function BlockingLoader(props) {
  const {classes} = props;
  return (
    <div className={classes.blocker}>
      <LoadBar active={true} />
    </div>
  );
}

export default injectSheet(styles)(BlockingLoader);