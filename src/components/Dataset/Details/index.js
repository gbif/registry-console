import React from 'react';
import { Row, Col, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

//Wrappers
import PermissionWrapper from '../../hoc/PermissionWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.dataset === null
    };
  }

  onCancel = () => {
    if (this.props.dataset) {
      this.setState({ edit: false });
    } else {
      this.props.history.push('/dataset/search');
    }
  };

  render() {
    const { dataset, uuids, refresh } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="details.dataset" defaultMessage="Dataset details"/></h2>
            </Col>
            <Col span={4} className="text-right">
              <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                {dataset && <Row className="item-btn-panel">
                  <Col>
                    <Switch
                      checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                      unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                      onChange={(val) => this.setState({ edit: val })}
                      checked={this.state.edit}
                    />
                  </Col>
                </Row>}
              </PermissionWrapper>
            </Col>
          </Row>

          {!this.state.edit && <Presentation dataset={dataset}/>}
          {this.state.edit && (
            <Form
              dataset={dataset}
              onSubmit={key => {
                this.setState({ edit: false });
                refresh(key);
              }}
              onCancel={this.onCancel}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

Details.propTypes = {
  dataset: PropTypes.object,
  uuids: PropTypes.array.isRequired,
  refresh: PropTypes.func.isRequired
};

export default withRouter(Details);