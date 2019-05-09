import React from 'react';
import { Row, Col, Switch, Icon, Alert, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

//Wrappers
import { HasScope } from '../../auth';
import ItemFormWrapper from '../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';
import FormattedRelativeDate from '../../common/FormattedRelativeDate';

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: !props.dataset,
      isModalVisible: false
    };
  }

  onCancel = () => {
    if (this.props.dataset) {
      this.setState({ isModalVisible: false });
    } else {
      this.props.history.push('/dataset/search');
    }
  };

  onSubmit = key => {
    this.setState({ edit: false, isModalVisible: false });
    this.props.refresh(key);
  };

  toggleEditState = val => {
    if (this.props.dataset) {
      this.setState({ isModalVisible: val });
    } else {
      this.setState({ edit: false });
    }
  };

  render() {
    const { dataset, uuids } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2>
                <FormattedMessage id="details.dataset" defaultMessage="Dataset details"/>
                <Tooltip title={
                  <FormattedMessage
                    id="help.datasetOverviewInfo"
                    defaultMessage="Dataset information might partly be rewritten by the crawled source data. If you wish to freeze the metadata then 'lock auto updates'."
                  />
                }>
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </h2>
            </Col>
            <Col span={4} className="text-right">
              <HasScope uuids={uuids}>
                {dataset && (
                  <Row className="item-btn-panel">
                    <Col>
                      <Switch
                        checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                        unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                        onChange={this.toggleEditState}
                        checked={this.state.edit || this.state.isModalVisible}
                      />
                    </Col>
                  </Row>
                )}
              </HasScope>
            </Col>
          </Row>

          {/* If dataset was deleted, we should show a message about that */}
          {dataset && dataset.deleted && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.deleted.dataset"
                  defaultMessage="This dataset was deleted {relativeTime} by {name}."
                  values={{
                    name: dataset.modifiedBy,
                    relativeTime: <FormattedRelativeDate value={dataset.modified}/>
                  }}
                />
              }
              type="error"
            />
          )}

          {!this.state.edit && <Presentation dataset={dataset}/>}
          <ItemFormWrapper
            title={<FormattedMessage id="dataset" defaultMessage="Dataset"/>}
            visible={this.state.edit || this.state.isModalVisible}
            mode={dataset ? 'edit' : 'create'}
          >
            <Form dataset={dataset} onSubmit={this.onSubmit} onCancel={this.onCancel}/>
          </ItemFormWrapper>
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