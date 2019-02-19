import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Menu, Icon } from 'antd';
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
const BasicMenu = ({ user, location, collapsed, classes }) => {
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
          {menu.title.icon && <Icon type={menu.title.icon} style={{ marginLeft: '10px' }}/>}
          <FormattedMessage id={menu.title.message.id} defaultMessage={menu.title.message.default}/>
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
        <NavLink to={item.key}>
          {item.title.icon && <Icon type={item.title.icon} style={{ marginLeft: '10px' }}/>}
          <FormattedMessage id={item.title.message.id} defaultMessage={item.title.message.default}/>
        </NavLink>
      </Menu.Item>
    );
  };

  return (
    <React.Fragment>
      <div className="logo">
        <a href="/">
          <Logo/>
          <h1>GBIF Registry</h1>
        </a>
      </div>
      <Menu
        defaultSelectedKeys={[location.pathname.split('/')[1]]}
        selectedKeys={[location.pathname.split('/')[1], `/${location.pathname.split('/')[1]}/search` , location.pathname]}
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