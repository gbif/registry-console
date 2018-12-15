import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Menu, Icon } from 'antd';
import { connect } from 'react-redux';

import Logo from './Logo';
import MenuConfig from '../../config/menu.config';

const SubMenu = Menu.SubMenu;

class BasicMenu extends Component {
  renderMenu = () => {
    return MenuConfig.map(el => {
      if (el.type === 'submenu') {
        return this.renderSubmenu(el);
      }

      return this.renderItem(el);
    });
  };

  renderSubmenu = menu => {
    if (!this.isAuthorised(menu.authority)) {
      return null;
    }

    return (
      <SubMenu key={menu.key} title={
        <div>
          {menu.title.icon && <Icon type={menu.title.icon}/>}
          <FormattedMessage id={menu.title.message.id} defaultMessage={menu.title.message.default}/>
        </div>
      }>
        {menu.children.map(this.renderItem)}
      </SubMenu>
    );
  };

  renderItem = item => {
    if (!this.isAuthorised(item.authority)) {
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

  isAuthorised = authority => {
    const { user } = this.props;

    return !authority || (user && user.roles.some(role => authority.includes(role)));
  };

  render() {
    const { location } = this.props;
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
          inlineCollapsed={this.props.collapsed}
        >
          {this.renderMenu()}
        </Menu>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withRouter(BasicMenu));