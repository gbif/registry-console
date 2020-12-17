import React from 'react';
import { Alert, Col, Row, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { InstitutionLink } from '../index';

// Wrappers
import { HasRole, roles } from '../../auth';
import ItemFormWrapper from '../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';
import FormattedRelativeDate from '../../common/FormattedRelativeDate';

class InstitutionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: !props.institution,
      isModalVisible: false
    };
  }

  onCancel = () => {
    if (this.props.institution) {
      this.setState({ isModalVisible: false });
    } else {
      this.props.history.push('/institution/search');
    }
  };

  onSubmit = key => {
    this.setState({ edit: false, isModalVisible: false });
    this.props.refresh(key);
  };

  toggleEditState = val => {
    if (this.props.institution) {
      this.setState({ isModalVisible: val });
    } else {
      this.setState({ edit: false });
    }
  };

  render() {
    const { institution } = this.props;
    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="details.institution" defaultMessage="Institution details"/></h2>
            </Col>
            <Col span={4} className="text-right">
              <HasRole roles={[roles.REGISTRY_ADMIN, roles.GRSCICOLL_ADMIN]}>
                <div className="item-btn-panel">
                  {institution && !institution.deleted && (
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

          {/* If institution was deleted, we should show a message about that */}
          {institution && institution.deleted && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.deleted.institution"
                  defaultMessage="This institution was deleted {relativeTime} by {name}."
                  values={{
                    name: institution.modifiedBy,
                    relativeTime: <FormattedRelativeDate value={institution.modified}/>
                  }}
                />
              }
              type="error"
            />
          )}
          {institution && institution.replacedBy && (
            <Alert
              className="deleted-alert"
              message={
                <FormattedMessage
                  id="important.replacedBy.institution"
                  defaultMessage="This institution was replaced by {name}."
                  // values={{name: <a href={`/institution/${institution.replacedBy}`}>{institution.replacedBy}</a>}}
                  values={{name: <InstitutionLink uuid={institution.replacedBy} />}}
                />
              }
              type="error"
            />
          )}

          {!this.state.edit && <Presentation institution={institution}/>}
          <ItemFormWrapper
            title={<FormattedMessage id="institution" defaultMessage="Institution"/>}
            visible={this.state.edit || this.state.isModalVisible}
            mode={institution ? 'edit' : 'create'}
          >
            <Form institution={institution} onSubmit={this.onSubmit} onCancel={this.onCancel}/>
          </ItemFormWrapper>
        </div>
      </React.Fragment>
    );
  }
}

InstitutionDetails.propTypes = {
  institution: PropTypes.object,
  refresh: PropTypes.func.isRequired
};

export default withRouter(InstitutionDetails);