import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';

// Components
import Presentation from './Presentation';

const NodeDetails = ({ node }) => (
  <React.Fragment>
    <div className="item-details">
      <h2>
        <FormattedMessage id="details.node" defaultMessage="Node details"/>
        <Tooltip title={
          <FormattedMessage
            id="help.nodeOverviewInfo"
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

NodeDetails.propTypes = {
  node: PropTypes.object.isRequired
};

export default NodeDetails;