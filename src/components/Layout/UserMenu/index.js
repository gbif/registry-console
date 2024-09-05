import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { FormattedMessage } from 'react-intl';
import { LogoutOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Avatar, Modal, Button } from 'antd';
import { Link } from 'react-router-dom';
import { LoginOutlined } from '@ant-design/icons';

// Wrappers
import withContext from '../../hoc/withContext';
// Components
import LoginForm from './LoginForm';
import withWidth, { MEDIUM } from '../../hoc/Width';

const hashCode = function (str) {
  let hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const styles = {
  avatar: {
    '& img': {
      imageRendering: 'crisp-edges',
      fallbacks: {
        imageRendering: 'pixelated'
      }
    }
  }
};

class UserMenu extends Component {
  state = {
    visible: false,
    invalid: false
  };

  showLogin = () => {
    this.setState({
      visible: true
    });
  };

  handleLogin = (values) => {
    this.props.login(values)
      .then(() => {
        this.setState({
          visible: false,
          invalid: false
        });
      })
      .catch(() => {
        this.setState({ invalid: true });
      });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      invalid: false
    });
  };

  render() {
    const { classes, user, logout, width } = this.props;
    let currentUser;
    if (user) {
      const imgNr = Math.abs(hashCode(user.userName)) % 10;
      currentUser = {
        name: user.userName,
        avatar: `/_palettes/${imgNr}.png`
      };
    }

    const menu = (
      <Menu selectedKeys={[]}>
        {user && 
          <Menu.Item key="logout" onClick={() => {
            logout();
          }}>
            <LogoutOutlined />{" "}
            <FormattedMessage id="logout" defaultMessage="Logout" />
          </Menu.Item>}
          {user && <Menu.Item key="profile">
            <Link to={`/who-am-i`}>Profile</Link>
          </Menu.Item>}
      </Menu>
    );

    return <React.Fragment>
      {!user && (
        <span style={{ padding: '0 16px' }}>
          <Button htmlType="button" type="primary" onClick={this.showLogin}>
            {width > MEDIUM && <FormattedMessage id="login" defaultMessage="Login" />}
            {width <= MEDIUM && <LoginOutlined />}
          </Button>
        </span>
      )}
      {user && (
        <Dropdown overlay={menu} trigger={['click']}>
          <span style={{ padding: '0 16px' }}>
            <Avatar
              style={{ marginRight: 8, marginLeft: 8 }}
              size="small"
              className={classes.avatar}
              src={currentUser.avatar}
              alt="avatar"
            />
            {width > MEDIUM && <span>{currentUser.name}</span>}
          </span>
        </Dropdown>
      )}
      <Modal
        title={<FormattedMessage id="login" defaultMessage="Login" />}
        visible={this.state.visible}
        onOk={this.handleLogin}
        onCancel={this.handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <div className={classes.background}>
          <LoginForm
            invalid={this.state.invalid}
            onLogin={this.handleLogin}
          />
        </div>
      </Modal>
    </React.Fragment>
  }
}

const mapContextToProps = ({ user, login, logout }) => ({ user, login, logout });

export default withContext(mapContextToProps)(injectSheet(styles)(withWidth()(UserMenu)));