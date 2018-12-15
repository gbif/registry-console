import React from 'react';

import Presentation from './Presentation';
import Form from './Form';
import ContextConsumer from '../../hoc/ContextConsumer';

class NodeDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.node === null
    };
  }

  render() {
    const { node, refresh } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          {!this.state.edit && <Presentation node={node}/>}
          {this.state.edit && (
            <ContextConsumer render={context =>
              <Form node={node} {...context} onSubmit={key => {
                this.setState({ edit: false });
                refresh(key);
              }}/>
            }/>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default NodeDetails;