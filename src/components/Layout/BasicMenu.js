import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Menu, Icon } from 'antd';

import Logo from './Logo';
import MenuConfig from './menu.config';
import withContext from '../hoc/withContext';

const SubMenu = Menu.SubMenu;

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
    if (!isAuthorised(menu.authority)) {
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
    if (!isAuthorised(item.authority)) {
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

  const isAuthorised = authority => {
    return !authority || (user && user.roles.some(role => authority.includes(role)));
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
        defaultOpenKeys={[location.pathname.split('/')[1]]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
      >
        {renderMenu()}
      </Menu>
    </React.Fragment>
  );
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(withRouter(BasicMenu));