
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Menu, Icon } from 'antd';
import Logo from './Logo'

const SubMenu = Menu.SubMenu;

class BasicMenu extends Component {
  render() {
    const {location, history} = this.props;
    return (
      <React.Fragment>
        <div className="logo">
          <a href="/">
            <Logo />
            <h1>GBIF Registry</h1>
          </a>
        </div>
        <Menu
          onClick={(e) => {history.push(e.key)}} 
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={[location.pathname.split('/')[1]]}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.props.collapsed}
        >
          <SubMenu key="organization" title={<span><Icon type="share-alt" /><span><FormattedMessage id="menu.organization" defaultMessage="Organizations" /></span></span>}>
            <Menu.Item key="/organization/search">
              <FormattedMessage id="menu.search" defaultMessage="Search" />
            </Menu.Item>
            <Menu.Item key="/organization/deleted">
              <FormattedMessage id="menu.deleted" defaultMessage="Deleted" />
            </Menu.Item>
            <Menu.Item key="/organization/nonPublishing">
              <FormattedMessage id="menu.organization_nonPublishing" defaultMessage="Non publishing organizations" />
            </Menu.Item>
          </SubMenu>

          <SubMenu key="dataset" title={<span><Icon type="table" /><span><FormattedMessage id="menu.dataset" defaultMessage="Datasets" /></span></span>}>
            <Menu.Item key="/dataset/search">
              <FormattedMessage id="menu.search" defaultMessage="Search" />
            </Menu.Item>
            <Menu.Item key="/dataset/deleted">
              <FormattedMessage id="menu.deleted" defaultMessage="Deleted" />
            </Menu.Item>
            <Menu.Item key="/dataset/duplicate">
              <FormattedMessage id="menu.duplicate" defaultMessage="Duplicate" />
            </Menu.Item>
            <Menu.Item key="/dataset/withNoEndpoint">
              <FormattedMessage id="menu.WithNoEndpoint" defaultMessage="With no endpoint" />
            </Menu.Item>
          </SubMenu>

          <SubMenu key="installation" title={<span><Icon type="hdd" /><span><FormattedMessage id="menu.installation" defaultMessage="Installations" /></span></span>}>
            <Menu.Item key="/installation/search">
              <FormattedMessage id="menu.search" defaultMessage="Search" />
            </Menu.Item>
            <Menu.Item key="/installation/deleted">
              <FormattedMessage id="menu.deleted" defaultMessage="Deleted" />
            </Menu.Item>
            <Menu.Item key="/installation/nonPublishing">
              <FormattedMessage id="menu.installation_nonPublishing" defaultMessage="Serving no datasets" />
            </Menu.Item>
          </SubMenu>

          <SubMenu key="grbio" title={<span><Icon type="api" /><span><FormattedMessage id="menu.grbio" defaultMessage="GRBIO" /></span></span>}>
            <Menu.Item key="/grbio/collection/search">
              <FormattedMessage id="menu.collection" defaultMessage="Collections" />
            </Menu.Item>
            <Menu.Item key="/grbio/institution/search">
              <FormattedMessage id="menu.institution" defaultMessage="Institutions" />
            </Menu.Item>
            <Menu.Item key="/grbio/person/search">
              <FormattedMessage id="menu.person" defaultMessage="Persons" />
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="/node/search">
            <Icon type="mail" /><FormattedMessage id="menu.node" defaultMessage="Nodes" />
          </Menu.Item>

          <Menu.Item key="/user/search">
            <Icon type="user" /><FormattedMessage id="menu.user" defaultMessage="Users" />
          </Menu.Item>

        </Menu>
      </React.Fragment>
    );
  }
}

export default withRouter(BasicMenu)