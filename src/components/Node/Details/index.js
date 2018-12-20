import React from 'react';
import { FormattedMessage } from 'react-intl';

import Presentation from './Presentation';

class NodeDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.node === null
    };
  }

  render() {
    const { node } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          <h2><FormattedMessage id="details.node" defaultMessage="Node details"/></h2>

          <Presentation node={node}/>
        </div>
      </React.Fragment>
    );
  }
}

export default NodeDetails;