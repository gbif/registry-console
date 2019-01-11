import React from 'react';
import { Col, Row, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

// Wrappers
import { HasRole } from '../../auth';
// Components
import Presentation from './Presentation';
import Form from './Form';

class InstitutionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.institution === null
    };
  }

  onCancel = () => {
    if (this.props.institution) {
      this.setState({ edit: false });
    } else {
      this.props.history.push('/institution/search');
    }
  };

  render() {
    const { institution, refresh } = this.props;
    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="details.institution" defaultMessage="Institution details"/></h2>
            </Col>
            <Col span={4} className="text-right">
              <HasRole roles={'REGISTRY_ADMIN'}>
                <div className="item-btn-panel">
                  {institution && <Switch
                    checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    onChange={(val) => this.setState({ edit: val })}
                    checked={this.state.edit}
                  />}
                </div>
              </HasRole>
            </Col>
          </Row>

          {!this.state.edit && <Presentation institution={institution}/>}
          {this.state.edit && (
            <Form
              institution={institution}
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

InstitutionDetails.propTypes = {
  institution: PropTypes.object,
  refresh: PropTypes.func.isRequired
};

export default withRouter(InstitutionDetails);