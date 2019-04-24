import React from 'react';
import { Alert, Col, Row, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

// Wrappers
import { HasRole, roles } from '../../auth';
import ItemFormWrapper from '../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';
import FormattedRelativeDate from '../../common/FormattedRelativeDate';

const styles = {
};

class PersonDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: !props.person,
      isModalVisible: false
    };
  }

  onCancel = () => {
    if (this.props.person) {
      this.setState({ isModalVisible: false });
    } else {
      this.props.history.push('/person/search');
    }
  };

  onSubmit = key => {
    this.setState({ edit: false, isModalVisible: false });
    this.props.refresh(key);
  };

  toggleEditState = val => {
    if (this.props.person) {
      this.setState({ isModalVisible: val });
    } else {
      this.setState({ edit: false });
    }
  };

  render() {
    const { person } = this.props;

    return (
      <React.Fragment>
        <div>
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="details.person" defaultMessage="Person details"/></h2>
            </Col>
            <Col span={4} className="text-right">
              <HasRole roles={[roles.REGISTRY_ADMIN, roles.GRSCICOLL_ADMIN]}>
                <div className="item-btn-panel">
                  {person && !person.deleted && (
                    <Switch
                      checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                      unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                      onChange={this.toggleEditState}
                      checked={this.state.edit || this.state.isModalVisible}
                    />
                  )}
                </div>
              </HasRole>
            </Col>
          </Row>

          {/* If person was deleted, we should show a message about that */}
          {person && person.deleted && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.deleted.person"
                  defaultMessage="This person was deleted {relativeTime} by {name}."
                  values={{
                    name: person.modifiedBy,
                    relativeTime: <FormattedRelativeDate value={person.modified}/>
                  }}
                />
              }
              type="error"
            />
          )}

          {!this.state.edit && <Presentation person={person}/>}
          <ItemFormWrapper
            title={<FormattedMessage id="person" defaultMessage="Person"/>}
            visible={this.state.edit || this.state.isModalVisible}
            mode={person ? 'edit' : 'create'}
          >
            <Form person={person} onSubmit={this.onSubmit} onCancel={this.onCancel}/>
          </ItemFormWrapper>
        </div>
      </React.Fragment>
    );
  }
}

PersonDetails.propTypes = {
  person: PropTypes.object,
  refresh: PropTypes.func.isRequired
};

export default withRouter(injectSheet(styles)(PersonDetails));