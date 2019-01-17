import React from 'react';
import { Col, Row, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Wrappers
import { HasRole } from '../../auth';
import ItemFormWrapper from '../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';

/**
 * Displays collection details and edit form
 * @param collection - collection object or null
 * @param refresh - a callback after save/edit
 */
class CollectionDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: !props.collection,
      isModalVisible: false
    };
  }

  onCancel = () => {
    if (this.props.collection) {
      this.setState({ isModalVisible: false });
    } else {
      this.props.history.push('/collection/search');
    }
  };

  onSubmit = key => {
    this.setState({ edit: false, isModalVisible: false });
    this.props.refresh(key);
  };

  toggleEditState = val => {
    if (this.props.collection) {
      this.setState({ isModalVisible: val });
    } else {
      this.setState({ edit: false });
    }
  };

  render() {
    const { collection } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="details.collection" defaultMessage="Collection details"/></h2>
            </Col>
            <Col span={4} className="text-right">
              <HasRole roles={'REGISTRY_ADMIN'}>
                <div className="item-btn-panel">
                  {collection && <Switch
                    checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    onChange={this.toggleEditState}
                    checked={this.state.edit || this.state.isModalVisible}
                  />}
                </div>
              </HasRole>
            </Col>
          </Row>

          {!this.state.edit && <Presentation collection={collection}/>}
          <ItemFormWrapper
            title={<FormattedMessage id="collection" defaultMessage="Collection"/>}
            visible={this.state.edit || this.state.isModalVisible}
            mode={collection ? 'edit' : 'create'}
          >
            <Form collection={collection} onSubmit={this.onSubmit} onCancel={this.onCancel}/>
          </ItemFormWrapper>
        </div>
      </React.Fragment>
    );
  }
}

CollectionDetails.propTypes = {
  collection: PropTypes.object,
  refresh: PropTypes.func.isRequired
};

export default CollectionDetails;