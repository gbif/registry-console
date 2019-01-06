import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Menu, Icon } from 'antd';
import PropTypes from 'prop-types';

// Config
import MenuConfig from './menu.config';
// Wrappers
import withContext from '../hoc/withContext';
// Components
import Logo from './Logo';
// Helpers
import { canCreateItem } from '../helpers';

const SubMenu = Menu.SubMenu;

/**
 * A Basic/Main menu
 * @param user - a current user object taken from a ContextProvider
 * @param location - a current user object taken from a withRouter wrapper
 * @param collapsed
 * @returns {*}
 * @constructor
 */
const BasicMenu = ({ user, location, collapsed }) => {
  const renderMenu = () => {
    return MenuConfig.map(el => {
      if (el.type === 'submenu') {
        return renderSubmenu(el);
      }

      return renderItem(el);
    });
  };

  const renderSubmenu = menu => {
    if (!isAuthorised(menu.roles, menu.key)) {
      return null;
    }

    return (
      <SubMenu key={menu.key} title={
        <div>
          {menu.title.icon && <Icon type={menu.title.icon}/>}
          <FormattedMessage id={menu.title.message.id} defaultMessage={menu.title.message.default}/>
        </div>
      }>
        {menu.children.map(renderItem)}
      </SubMenu>
    );
  };

  const renderItem = item => {
    if (!isAuthorised(item.roles, item.key)) {
      return null;
    }

    return (
      <Menu.Item key={item.key}>
        <NavLink to={item.key}>
          {item.title.icon && <Icon type={item.title.icon}/>}
          <FormattedMessage id={item.title.message.id} defaultMessage={item.title.message.default}/>
        </NavLink>
      </Menu.Item>
    );
  };

  const isAuthorised = (roles, key) => {
    if (!roles || (user && user.roles.includes('REGISTRY_ADMIN'))) {
      return true;
    }

    // User should be able to work with a link only if he has required role(s)
    if (user && hasRequiredRoles(roles, user)) {
      return canCreateItem(user.editorRoleScopeItems, key.split('/')[1]);
    }

    return false;
  };

  const hasRequiredRoles = (roles, user) => {
    return roles.some(role => user.roles.includes(role));
  };

  return (
    <React.Fragment>
      <div className="logo">
        <a href="/">
          <Logo/>
          <h1>
            <FormattedMessage id="orgName" defaultMessage="GBIF Registry"/>
          </h1>
        </a>
      </div>
      <Menu
        defaultSelectedKeys={[location.pathname]}
        selectedKeys={[location.pathname]}
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

export default withContext(mapContextToProps)(withRouter(BasicMenu));