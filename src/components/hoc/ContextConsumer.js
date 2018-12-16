import React from 'react';
import { AppContext } from './ContextProvider';

class ContextConsumer extends React.Component {
  render() {
    return (
      <AppContext.Consumer>
        {context => this.props.render(context)}
      </AppContext.Consumer>
    );
  }
}

export default ContextConsumer;