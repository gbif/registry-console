import React from 'react';
import { Alert, Col, Icon, Row, Switch, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

// Wrappers
import { HasScope } from '../../auth';
import ItemFormWrapper from '../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';
import FormattedRelativeDate from '../../common/FormattedRelativeDate';

class NetworkDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: !props.network,
      isModalVisible: false
    };
  }

  onCancel = () => {
    if (this.props.network) {
      this.setState({ isModalVisible: false });
    } else {
      this.props.history.push('/network/search');
    }
  };

  onSubmit = key => {
    this.setState({ edit: false, isModalVisible: false });
    this.props.refresh(key);
  };

  toggleEditState = val => {
    if (this.props.network) {
      this.setState({ isModalVisible: val });
    } else {
      this.setState({ edit: false });
    }
  };

  render() {
    const { network, uuids } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2>
                <FormattedMessage id="details.network" defaultMessage="Network details"/>
                <Tooltip title={
                  <FormattedMessage
                    id="help.networkOverviewInfo"
                    defaultMessage="This information appears on the network profile, network pages, search results, and beyond."
                  />
                }>
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </h2>
            </Col>
            <Col span={4} className="text-right">
              <HasScope uuids={uuids}>
                {/* If network was deleted, it couldn't be edited before restoring */}
                {network && !network.deleted && (
                  <div className="item-btn-panel">
                    {network && <Switch
                      checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                      unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                      onChange={this.toggleEditState}
                      checked={this.state.edit || this.state.isModalVisible}
                    />}
                  </div>
                )}
              </HasScope>
            </Col>
          </Row>

          {/* If network was deleted, we should show a message about that */}
          {network && network.deleted && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.deleted.network"
                  defaultMessage="This network was deleted {relativeTime} by {name}."
                  values={{
                    name: network.modifiedBy,
                    relativeTime: <FormattedRelativeDate value={network.modified}/>
                  }}
                />
              }
              type="error"
            />
          )}

          {!this.state.edit && <Presentation network={network}/>}
          <ItemFormWrapper
            title={<FormattedMessage id="network" defaultMessage="Network"/>}
            visible={this.state.edit || this.state.isModalVisible}
            mode={network ? 'edit' : 'create'}
          >
            <Form network={network} onSubmit={this.onSubmit} onCancel={this.onCancel}/>
          </ItemFormWrapper>
        </div>
      </React.Fragment>
    );
  }
}

NetworkDetails.propTypes = {
  uuids: PropTypes.array.isRequired,
  network: PropTypes.object,
  refresh: PropTypes.func.isRequired
};

export default withRouter(NetworkDetails);