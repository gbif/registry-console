import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import injectSheet from 'react-jss';
import { FormattedMessage } from 'react-intl'
import { Menu, Icon, Dropdown, Avatar, Modal, Button } from 'antd';
import { addError } from '../../../actions/errors'
import { login, logout } from '../../../actions/user'
import LoginForm from './LoginForm'

const hashCode = function(str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const styles = {
  avatar: {
    '& img': {
      imageRendering: 'pixelated'
    }
  }
};

class UserMenu extends PureComponent {
  state = { visible: false }

  showLogin = () => {
    this.setState({
      visible: true,
    });
  }

  handleLogin = (values) => {
    this.setState({
      visible: false,
    });
    this.props.login(values)
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { classes, user, logout } = this.props;
    let currentUser
    if (user) {
      const imgNr = Math.abs(hashCode(user.username)) % 10
      currentUser = {
        name: user.username,
        avatar: `/_palettes/${imgNr}.png`
      };
    }

    const menu = (
      <Menu selectedKeys={[]}>
        {user && <Menu.Item key="logout" onClick={() => { logout() }}>
          <Icon type="logout" />
          <FormattedMessage id="logout" defaultMessage="Logout" />
        </Menu.Item>
        }
      </Menu>
    );

    return (
      <React.Fragment>
        {!user && <span style={{ padding: '0 16px' }}><Button type="primary" onClick={this.showLogin}>
          <FormattedMessage id="login" defaultMessage="Login" />
        </Button></span>}
        {user && <Dropdown overlay={menu}>
          <span style={{ padding: '0 16px' }}>
            <Avatar
              style={{ marginRight: 8 }}
              size="small"
              className={classes.avatar}
              src={currentUser.avatar}
              alt="avatar"
            />
            <span>{currentUser.name}</span>
          </span>
        </Dropdown>
        }
        <Modal
          title={<FormattedMessage id="login" defaultMessage="Login" />}
          visible={this.state.visible}
          onOk={this.handleLogin}
          onCancel={this.handleCancel}
          footer={null}
        >
          <div className={classes.background}>
            <LoginForm
              onLogin={this.handleLogin}
              onCancel={this.handleCancel}
            />
          </div>
        </Modal>

      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  locale: state.locale,
  user: state.user
})

const mapDispatchToProps = {
  addError: addError,
  login: login,
  logout: logout
}

export default connect(mapStateToProps, mapDispatchToProps)(injectSheet(styles)(UserMenu))