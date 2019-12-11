import React from 'react';
import { Alert, Col, Icon, Row, Switch, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { roles } from '../../../../auth/enums';
// Wrappers
import { HasRole } from '../../../../auth';
import ItemFormWrapper from '../../../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './ConceptForm';
import FormattedRelativeDate from '../../../../common/FormattedRelativeDate';

class ConceptDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: !props.concept,
      isModalVisible: false
    };
  }

  onCancel = () => {
    if (this.props.concept) {
      this.setState({ isModalVisible: false });
    } else {
      this.props.history.push('/concept/search');
    }
  };

  onSubmit = key => {
    this.setState({ edit: false, isModalVisible: false });
    this.props.refresh(key);
  };

  toggleEditState = val => {
    if (this.props.concept) {
      this.setState({ isModalVisible: val });
    } else {
      this.setState({ edit: false });
    }
  };

  render() {
    const { concept,  createMapItem, deleteMapItem, updateMultiMapItems, createListItem, deleteListItem  } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2>
                <FormattedMessage id="details.concept" defaultMessage="concept details"/>
                <Tooltip title={
                  <FormattedMessage
                    id="help.conceptOverviewInfo"
                    defaultMessage="This information appears on the concept pages, search results, and beyond."
                  />
                }>
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </h2>
            </Col>
            <Col span={4} className="text-right">
              <HasRole roles={[roles.concept_ADMIN]}>
                {/* If concept was deprecated, it couldn't be edited before restoring */}
                {concept && !concept.deprecated && (
                  <div className="item-btn-panel">
                    {concept && <Switch
                      checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                      unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                      onChange={this.toggleEditState}
                      checked={this.state.edit || this.state.isModalVisible}
                    />}
                  </div>
                )}
              </HasRole>
            </Col>
          </Row>

          {/* If concept was deprecated, we should show a message about that */}
          {concept && concept.deprecated && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.deprecated.concept"
                  defaultMessage="This concept was deprecated {relativeTime} by {name}."
                  values={{
                    name: concept.deprecatedBy,
                    relativeTime: <FormattedRelativeDate value={concept.deprecated}/>
                  }}
                />
              }
              type="error"
            />
          )}

          {!this.state.edit && 
            <Presentation 
              concept={concept} 
              createMapItem={createMapItem} 
              deleteMapItem={deleteMapItem} 
              createListItem={createListItem} 
              deleteListItem={deleteListItem}
              updateMultiMapItems={updateMultiMapItems}
              />}
          <ItemFormWrapper
            title={<FormattedMessage id="concept" defaultMessage="concept"/>}
            visible={this.state.edit || this.state.isModalVisible}
            mode={concept ? 'edit' : 'create'}
          >
            <Form concept={concept} onSubmit={this.onSubmit} onCancel={this.onCancel}/>
          </ItemFormWrapper>
        </div>
      </React.Fragment>
    );
  }
}

ConceptDetails.propTypes = {
  concept: PropTypes.object,
 // refresh: PropTypes.func.isRequired
};

export default withRouter(ConceptDetails);