import React from 'react';
import { Row, Col, Switch, Alert } from 'antd';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

//Wrappers
import PermissionWrapper from '../../hoc/PermissionWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';

const styles = {
  alert: {
    textAlign: 'center',
    marginBottom: '15px'
  }
};

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: !props.dataset
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
    const { dataset, uuids, refresh, classes } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="details.dataset" defaultMessage="Dataset details"/></h2>
            </Col>
            <Col span={4} className="text-right">
              <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                {dataset && (
                  <Row className="item-btn-panel">
                    <Col>
                      <Switch
                        checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                        unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                        onChange={(val) => this.setState({ edit: val })}
                        checked={this.state.edit}
                      />
                    </Col>
                  </Row>
                )}
              </PermissionWrapper>
            </Col>
          </Row>

          {/* If dataset was deleted, we should show a message about that */}
          {dataset && dataset.deleted && (
            <Alert
              className={classes.alert}
              message={
                <FormattedMessage
                  id="important.deleted.dataset"
                  defaultMessage="This dataset was deleted {relativeTime} by {name}."
                  values={{
                    name: dataset.modifiedBy,
                    relativeTime: <FormattedRelative value={dataset.modified}/>
                  }}
                />
              }
              type="error"
            />
          )}

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

export default withRouter(injectSheet(styles)(Details));