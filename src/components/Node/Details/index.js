import React from 'react';

import Presentation from './Presentation';
import Form from './Form';
import { FormattedMessage } from 'react-intl';

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
          <span className="help"><FormattedMessage id="node" defaultMessage="Node"/></span>
          <h2>{node ? node.title : <FormattedMessage id="newNode" defaultMessage="New node"/>}</h2>

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