import React from 'react';
import { Alert, Col, Icon, Row, Switch, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { roles } from '../../../../auth/enums';
// Wrappers
import { HasRole } from '../../../../auth';
// Components
import Presentation from './Presentation';
import ConceptForm from './ConceptForm';
import FormattedRelativeDate from '../../../../common/FormattedRelativeDate';

class ConceptDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false
    };
  }

  toggleEditState = () => {
    
    this.setState({ edit: !this.state.edit  });
  };

  onSubmit = key => {
    this.setState({ edit: false });
    this.props.refresh(key);
  };


  render() {
    const { vocabulary, concept,  createMapItem, deleteMapItem, updateMultiMapItems, createListItem, deleteListItem, preferredLanguages  } = this.props;

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
               <HasRole roles={[roles.VOCABULARY_ADMIN]}>
                {concept && !concept.deprecated && (
                  <div className="item-btn-panel">
                    {concept && <Switch
                      checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                      unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                      onChange={this.toggleEditState}
                      checked={this.state.edit}
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
              vocabulary={vocabulary}
              createMapItem={createMapItem} 
              deleteMapItem={deleteMapItem} 
              createListItem={createListItem} 
              deleteListItem={deleteListItem}
              updateMultiMapItems={updateMultiMapItems}
              preferredLanguages={preferredLanguages}

              />}
          <ConceptForm
            concept={concept}
            vocabulary={vocabulary}
            visible={this.state.edit}
            onCancel={this.toggleEditState}
            onSubmit={this.onSubmit}
          />
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