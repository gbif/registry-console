import React, { Component } from 'react';
import { Col, Row, Spin, Switch } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import injectSheet from 'react-jss';

// APIs
import { addEditorRight, deleteEditorRight, addCountryRight, deleteCountryRight, addNamespaceRight, deleteNamespaceRight } from '../../../../api/user'
import { HasRole } from '../../../auth';
// Wrappers
import ItemFormWrapper from '../../../hoc/ItemFormWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';

const styles = {
  header: {
    margin: 0,
    padding: '10px 10px 0',
    background: '#f7f7f7',
    border: '1px solid #eee',
    borderWidth: '1px 0',
    '& h3': {
      margin: 0,
      padding: 0
    }
  },
  loader: {
    display: 'block',
    margin: '15px auto 0'
  }
};

class EditorRoleScopes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      scopes: props.scopes ? props.scopes.map(scope => ({ ...scope.data, type: scope.type })) : null
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (!this.state.scopes) {
      this.setState({
        scopes: nextProps.scopes ? nextProps.scopes.map(scope => ({ ...scope.data, type: scope.type })) : null
      });
    }
  }

  onAdd = item => {
    return addEditorRight(this.props.userName, item.key).then(() => {
      this.setState(state => {
        return {
          scopes: state.scopes.concat(item)
        }
      });
    });
  };

  onRemove = key => {
    return deleteEditorRight(this.props.userName, key).then(() => {
      this.setState(state => {
        return {
          scopes: state.scopes.filter(scope => scope.key !== key)
        }
      });
    });
  };

  onAddCountryRight = countryCode => {
    return addCountryRight(this.props.userName, countryCode).then(() => {
      this.props.refresh();
    });
  };

  onDeleteCountryRight = countryCode => {
    return deleteCountryRight(this.props.userName, countryCode).then(() => {
      this.props.refresh();
    });
  };

  onAddNamespaceRight = namespace => {
    return addNamespaceRight(this.props.userName, namespace).then(() => {
      this.props.refresh();
    });
  };

  onDeleteNamespaceRight = namespace => {
    return deleteNamespaceRight(this.props.userName, namespace).then(() => {
      this.props.refresh();
    });
  };

  render() {
    const { scopes } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between" className={classes.header}>
          <Col span={20}>
            <h3>
              <FormattedMessage id="scopes.title" defaultMessage="Editor User Scopes" />
            </h3>
          </Col>
          <Col span={4} className="text-right">
            <HasRole roles={['REGISTRY_ADMIN']}>
              <div className="item-btn-panel">
                <Switch
                  checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit" />}
                  unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit" />}
                  onChange={val => this.setState({ isModalVisible: val })}
                  checked={this.state.isModalVisible}
                />
              </div>
            </HasRole>
          </Col>
        </Row>
        {scopes ? <Presentation user={this.props.user} scopes={scopes} /> : <Spin size="large" className={classes.loader} />}
        <ItemFormWrapper
          title={<FormattedMessage id="user" defaultMessage="User" />}
          visible={this.state.isModalVisible}
          mode={'edit'}
          closable={true}
          onCancel={() => this.setState({ isModalVisible: false })}
        >
          <Form
            scopes={scopes}
            user={this.props.user}
            onAdd={this.onAdd}
            onRemove={this.onRemove}
            addCountryRight={this.onAddCountryRight}
            deleteCountryRight={this.onDeleteCountryRight}
            addNamespaceRight={this.onAddNamespaceRight}
            deleteNamespaceRight={this.onDeleteNamespaceRight}
          />
        </ItemFormWrapper>
      </React.Fragment>
    );
  }
}

EditorRoleScopes.propTypes = {
  scopes: PropTypes.array,
  userName: PropTypes.string.isRequired
};

export default injectSheet(styles)(EditorRoleScopes);