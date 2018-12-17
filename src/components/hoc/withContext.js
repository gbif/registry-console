import React from 'react';
import ContextConsumer from './ContextConsumer';

const withContext = (injectedProps = context => {}) => WrappedComponent => {
  const Wrapper = props => {
    return (
      <ContextConsumer render={context =>
        <WrappedComponent {...injectedProps(context)} {...props} />
      }/>
    );
  };

  return Wrapper;
};

export default withContext;