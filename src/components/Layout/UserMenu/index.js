import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { FormattedMessage } from 'react-intl';
import { Menu, Icon, Dropdown, Avatar, Modal, Button } from 'antd';
import LoginForm from './LoginForm';
import withContext from '../../hoc/withContext';

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

class UserMenu extends PureComponent {
  state = { visible: false };

  componentDidMount() {
    this.props.loadTokenUser();
  }

  showLogin = () => {
    this.setState({
      visible: true
    });
  };

  handleLogin = (values) => {
    this.setState({
      visible: false
    });
    this.props.login(values);
  };

  handleCancel = (e) => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { classes, user, logout } = this.props;
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
        {user && <Menu.Item key="logout" onClick={() => {
          logout();
        }}>
          <Icon type="logout"/>
          <FormattedMessage id="logout" defaultMessage="Logout"/>
        </Menu.Item>
        }
      </Menu>
    );

    return (
      <React.Fragment>
        {!user && (
          <span style={{ padding: '0 16px' }}>
            <Button htmlType="button" type="primary" onClick={this.showLogin}>
              <FormattedMessage id="login" defaultMessage="Login"/>
            </Button>
          </span>
        )}
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
          title={<FormattedMessage id="login" defaultMessage="Login"/>}
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

const mapContextToProps = ({ locale, user, addError, login, logout, loadTokenUser }) =>
  ({ locale, user, addError, login, logout, loadTokenUser });

export default withContext(mapContextToProps)(injectSheet(styles)(UserMenu));