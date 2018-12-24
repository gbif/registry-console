import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Tooltip } from 'antd';
import injectSheet from 'react-jss';

import Presentation from './Presentation';

const styles = {
  icon: {
    color: 'rgba(0,0,0,.45)',
    marginLeft: '5px'
  }
};

class NodeDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.node === null
    };
  }

  render() {
    const { node, classes } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          <h2>
            <FormattedMessage id="details.node" defaultMessage="Node details"/>
            <Tooltip className={classes.icon} title={
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

export default injectSheet(styles)(NodeDetails);