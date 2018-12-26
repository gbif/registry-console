import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Tooltip } from 'antd';

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
          <h2>
            <FormattedMessage id="details.node" defaultMessage="Node details"/>
            <Tooltip title={
              <FormattedMessage
                id="nodeOverviewInfo"
                defaultMessage="This information appears on the node profile, organization pages, search results, and beyond."
              />
            }>
              <Icon type="question-circle-o"/>
            </Tooltip>
          </h2>

          <Presentation node={node}/>
        </div>
      </React.Fragment>
    );
  }
}

export default NodeDetails;