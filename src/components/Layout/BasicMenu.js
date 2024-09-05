import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Menu } from 'antd';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

// Config
import MenuConfig from './menu.config';
// Wrappers
import withContext from '../hoc/withContext';
// Components
import Logo from './Logo';
// Helpers
import { hasRole } from '../auth';
import { CloseOutlined } from '@ant-design/icons';

const SubMenu = Menu.SubMenu;
const styles = ({ direction }) => ({
  sideMenu: direction === 'rtl' ? {
    '& > div': {
      paddingLeft: '34px !important',
      paddingRight: '24px !important',
      '& > i': {
        right: 'auto !important',
        left: '16px'
      }
    }
  } : {}
});

/**
 * A Basic/Main menu
 * @param user - a current user object taken from a ContextProvider
 * @param location - a current user object taken from a withRouter wrapper
 * @param collapsed
 * @param classes
 * @returns {*}
 * @constructor
 */
const BasicMenu = ({ user, location, collapsed, onClose, classes }) => {
  const renderMenu = () => {
    return MenuConfig.map(el => {
      if (el.type === 'submenu') {
        return renderSubmenu(el);
      }

      return renderItem(el);
    });
  };

  const renderSubmenu = menu => {
    if (menu.roles && !hasRole(user, menu.roles)) {
      return null;
    }

    return (
      <SubMenu key={menu.key} title={
        <div style={{ alignItems: 'center' }}>
          {menu?.title?.icon}
          <FormattedMessage id={menu.title.message.id} defaultMessage={menu.title.message.default} />
        </div>
      } className={classes.sideMenu}>
        {menu.children.map(renderItem)}
      </SubMenu>
    );
  };

  const renderItem = item => {
    if (item.roles && !hasRole(user, item.roles)) {
      return null;
    }

    return (
      <Menu.Item key={item.key}>
        <NavLink to={item.key} onClick={() => {
          if (onClose) {
            onClose();
          }
        }}>
          {item?.title?.icon}
          <FormattedMessage id={item.title.message.id} defaultMessage={item.title.message.default} />
        </NavLink>
      </Menu.Item>
    );
  };

  return (
    <React.Fragment>
      <div>
        <div style={{ display: 'flex' }}>
          <a href="/" style={{ flex: '1 1 auto' }} className="logo">
            <Logo />
            <h1>GBIF Registry</h1>
          </a>
          {!collapsed && onClose && <button style={{ flex: '0 0 auto', background: 'none', border: 'none', color: 'white', width: 48 }} onClick={() => onClose()}>
            <CloseOutlined />
          </button>}
        </div>
      </div>
      <Menu
        defaultSelectedKeys={[location.pathname.split('/')[1]]}
        selectedKeys={[location.pathname.split('/')[1], `/${location.pathname.split('/')[1]}/search`, location.pathname]}
        defaultOpenKeys={!collapsed ? [location.pathname.split('/')[1]] : null}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
      >
        {renderMenu()}
      </Menu>
    </React.Fragment>
  );
};

BasicMenu.propTypes = {
  collapsed: PropTypes.bool
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(withRouter(injectSheet(styles)(BasicMenu)));