import React from 'react';
import { Alert, Col, Icon, Row, Switch, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { roles } from '../../auth/enums';
// Wrappers
import { HasRole } from '../../auth';
import ItemFormWrapper from '../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';
import FormattedRelativeDate from '../../common/FormattedRelativeDate';

class VocabularyDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: !props.vocabulary,
      isModalVisible: false
    };
  }

  onCancel = () => {
    if (this.props.vocabulary) {
      this.setState({ isModalVisible: false });
    } else {
      this.props.history.push('/vocabulary/search');
    }
  };

  onSubmit = key => {
    this.setState({ edit: false, isModalVisible: false });
    this.props.refresh(key);
  };

  toggleEditState = val => {
    if (this.props.vocabulary) {
      this.setState({ isModalVisible: val });
    } else {
      this.setState({ edit: false });
    }
  };

  render() {
    const { vocabulary, createMapItem, deleteMapItem, createListItem, deleteListItem, createMultiMapItem, deleteMultiMapItem } = this.props;

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2>
                <FormattedMessage id="details.vocabulary" defaultMessage="Vocabulary details"/>
                <Tooltip title={
                  <FormattedMessage
                    id="help.vocabularyOverviewInfo"
                    defaultMessage="This information appears on the vocabulary profile, vocabulary pages, search results, and beyond."
                  />
                }>
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </h2>
            </Col>
            <Col span={4} className="text-right">
              <HasRole roles={[roles.VOCABULARY_ADMIN]}>
                {/* If network was deleted, it couldn't be edited before restoring */}
                {vocabulary && !vocabulary.deprecated && (
                  <div className="item-btn-panel">
                    {vocabulary && <Switch
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

          {/* If vocabulary was deleted, we should show a message about that */}
          {vocabulary && vocabulary.deprecated && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.deprecated.vocabulary"
                  defaultMessage="This vocabulary was deprecated {relativeTime} by {name}."
                  values={{
                    name: vocabulary.deprecatedBy,
                    relativeTime: <FormattedRelativeDate value={vocabulary.deprecated}/>
                  }}
                />
              }
              type="error"
            />
          )}

          {!this.state.edit && 
            <Presentation 
              vocabulary={vocabulary} 
              createMapItem={createMapItem} 
              deleteMapItem={deleteMapItem} 
              createListItem={createListItem} 
              deleteListItem={deleteListItem} 
              createMultiMapItem={createMultiMapItem}
              deleteMultiMapItem={deleteMultiMapItem}
              />}
          <ItemFormWrapper
            title={<FormattedMessage id="vocabulary" defaultMessage="Vocabulary"/>}
            visible={this.state.edit || this.state.isModalVisible}
            mode={vocabulary ? 'edit' : 'create'}
          >
            <Form vocabulary={vocabulary} onSubmit={this.onSubmit} onCancel={this.onCancel}/>
          </ItemFormWrapper>
        </div>
      </React.Fragment>
    );
  }
}

VocabularyDetails.propTypes = {
  vocabulary: PropTypes.object,
  refresh: PropTypes.func.isRequired
};

export default withRouter(VocabularyDetails);