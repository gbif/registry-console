import React from 'react';

import Presentation from './Presentation';
import Form from './Form';

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
            <Form node={node} onSubmit={key => {
              this.setState({ edit: false });
              refresh(key);
            }}/>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default NodeDetails;