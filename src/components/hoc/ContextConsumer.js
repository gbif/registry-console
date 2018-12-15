import React from 'react';
import { AppContext } from '../App';

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