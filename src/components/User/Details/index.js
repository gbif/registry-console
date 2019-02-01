import React from 'react';
import { Col, Row, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

// Wrappers
import { HasRole } from '../../auth';
import ItemFormWrapper from '../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';

const styles = {
};

class UserDetails extends React.Component {
  state = {
    isModalVisible: false
  };

  onSubmit = key => {
    this.setState({ isModalVisible: false });
    this.props.refresh(key);
  };

  render() {
    const { user } = this.props;

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <Col span={20}>
            <h2><FormattedMessage id="details.user" defaultMessage="User details"/></h2>
          </Col>
          <Col span={4} className="text-right">
            <HasRole roles={['REGISTRY_ADMIN']}>
              <div className="item-btn-panel">
                <Switch
                  checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                  unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                  onChange={val => this.setState({ isModalVisible: val })}
                  checked={this.state.isModalVisible}
                />
              </div>
            </HasRole>
          </Col>
        </Row>

        <Presentation user={user}/>
        <ItemFormWrapper
          title={<FormattedMessage id="user" defaultMessage="User"/>}
          visible={this.state.isModalVisible}
          mode={user ? 'edit' : 'create'}
        >
          <Form user={user} onSubmit={this.onSubmit} onCancel={() => this.setState({ isModalVisible: false })}/>
        </ItemFormWrapper>
      </React.Fragment>
    );
  }
}

UserDetails.propTypes = {
  user: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired
};

export default injectSheet(styles)(UserDetails);