import React from 'react';
import { AppContext } from './ContextProvider';

const withContext = (injectedProps = context => {}) => WrappedComponent => {
  const Wrapper = props => {
    return (

      <AppContext.Consumer>
        {context => <WrappedComponent {...injectedProps(context)} {...props} />}
      </AppContext.Consumer>
    );
  };

  return Wrapper;
};

export default withContext;