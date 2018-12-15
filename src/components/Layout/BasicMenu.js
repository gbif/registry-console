import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Menu, Icon } from 'antd';
import Logo from './Logo';

const SubMenu = Menu.SubMenu;

class BasicMenu extends Component {
  render() {
    const { location, history } = this.props;
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
          onClick={(e) => {
            history.push(e.key);
          }}
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={[location.pathname.split('/')[1]]}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.props.collapsed}
        >
          <SubMenu key="organization" title={
            <div>
              <Icon type="share-alt"/>
              <FormattedMessage id="menu.organization" defaultMessage="Organizations"/>
            </div>
          }>
            <Menu.Item key="/organization/search">
              <FormattedMessage id="menu.search" defaultMessage="Search"/>
            </Menu.Item>
            <Menu.Item key="/organization/deleted">
              <FormattedMessage id="menu.deleted" defaultMessage="Deleted"/>
            </Menu.Item>
            <Menu.Item key="/organization/pending">
              <FormattedMessage id="menu.pending" defaultMessage="Pending"/>
            </Menu.Item>
            <Menu.Item key="/organization/nonPublishing">
              <FormattedMessage id="menu.organizationNonPublishing" defaultMessage="Non publishing organizations"/>
            </Menu.Item>
            <Menu.Item key="/organization/create">
              <FormattedMessage id="menu.createOrganization" defaultMessage="Create new organization"/>
            </Menu.Item>
          </SubMenu>

          <SubMenu key="dataset" title={
            <div>
              <Icon type="table"/>
              <FormattedMessage id="menu.dataset" defaultMessage="Datasets"/>
            </div>
          }>
            <Menu.Item key="/dataset/search">
              <FormattedMessage id="menu.search" defaultMessage="Search"/>
            </Menu.Item>
            <Menu.Item key="/dataset/deleted">
              <FormattedMessage id="menu.deleted" defaultMessage="Deleted"/>
            </Menu.Item>
            <Menu.Item key="/dataset/duplicate">
              <FormattedMessage id="menu.duplicate" defaultMessage="Duplicate"/>
            </Menu.Item>
            <Menu.Item key="/dataset/constituent">
              <FormattedMessage id="menu.constituent" defaultMessage="Constituent"/>
            </Menu.Item>
            <Menu.Item key="/dataset/withNoEndpoint">
              <FormattedMessage id="menu.withNoEndpoint" defaultMessage="With no endpoint"/>
            </Menu.Item>
            <Menu.Item key="/dataset/create">
              <FormattedMessage id="menu.createDataset" defaultMessage="Create new dataset"/>
            </Menu.Item>
          </SubMenu>

          <SubMenu key="installation" title={
            <div>
              <Icon type="hdd"/>
              <FormattedMessage id="menu.installation" defaultMessage="Installations"/>
            </div>
          }>
            <Menu.Item key="/installation/search">
              <FormattedMessage id="menu.search" defaultMessage="Search"/>
            </Menu.Item>
            <Menu.Item key="/installation/deleted">
              <FormattedMessage id="menu.deleted" defaultMessage="Deleted"/>
            </Menu.Item>
            <Menu.Item key="/installation/nonPublishing">
              <FormattedMessage id="menu.installationNoDataset" defaultMessage="Serving no datasets"/>
            </Menu.Item>
            <Menu.Item key="/installation/create">
              <FormattedMessage id="menu.createInstallation" defaultMessage="Create new installation"/>
            </Menu.Item>
          </SubMenu>

          <SubMenu key="grbio" title={
            <div>
              <Icon type="api"/>
              <FormattedMessage id="menu.grbio" defaultMessage="GRBIO"/>
            </div>
          }>
            <Menu.Item key="/grbio/collection/search">
              <FormattedMessage id="menu.collection" defaultMessage="Collections"/>
            </Menu.Item>
            <Menu.Item key="/grbio/institution/search">
              <FormattedMessage id="menu.institution" defaultMessage="Institutions"/>
            </Menu.Item>
            <Menu.Item key="/grbio/person/search">
              <FormattedMessage id="menu.person" defaultMessage="Persons"/>
            </Menu.Item>
          </SubMenu>

          <SubMenu key="node" title={
            <div>
              <Icon type="mail"/>
              <FormattedMessage id="menu.node" defaultMessage="Nodes"/>
            </div>
          }>
            <Menu.Item key="/node/search">
              <FormattedMessage id="menu.search" defaultMessage="Search"/>
            </Menu.Item>
            <Menu.Item key="/node/create">
              <FormattedMessage id="menu.createNode" defaultMessage="Create new node"/>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="/user/search">
            <Icon type="user"/><FormattedMessage id="menu.user" defaultMessage="Users"/>
          </Menu.Item>

        </Menu>
      </React.Fragment>
    );
  }
}

export default withRouter(BasicMenu);