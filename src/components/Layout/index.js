import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Layout, Icon, Drawer } from 'antd';

// Wrappers
import withWidth, { MEDIUM, EXTRA_LARGE } from '../hoc/Width';
// Components
import BasicMenu from './BasicMenu';
import SelectLang from './SelectLang';
import UserMenu from './UserMenu';
import Logo from './Logo';

import './menu.css';
import { FormattedMessage } from 'react-intl';
import withContext from "../hoc/withContext";

// Currently no support for rtl in Ant https://github.com/ant-design/ant-design/issues/4051
const styles = {
  sider: {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed'
  }
};

const { Header, Sider, Content, Footer } = Layout;
const menuWidth = 256;
const menuCollapsedWidth = 80;

class SiteLayout extends Component {
  constructor(props) {
    super(props);
    this.state = { false: true };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { width, classes, isRTL } = this.props;
    const collapsed = typeof this.state.collapsed === 'boolean'
      ? this.state.collapsed
      : width < EXTRA_LARGE;
    const isMobile = width < MEDIUM;

    let contentMargin = collapsed ? menuCollapsedWidth : menuWidth;
    if (isMobile) {
      contentMargin = 0;
    }

    const sideMenu = <React.Fragment>
      {!isMobile && <Sider
        className={classes.sider}
        style={{ left: 0 }}
        width={menuWidth}
        trigger={null}
        reverseArrow={true}
        collapsible
        collapsedWidth={menuCollapsedWidth}
        breakpoint="lg"
        collapsed={collapsed}
      >
        <BasicMenu collapsed={collapsed} />
      </Sider>
      }

      {isMobile && <Drawer
        placement="left"
        closable={false}
        onClose={() => {
          this.setState({ collapsed: true });
        }}
        visible={!collapsed}
        className="mainMenu__drawer"
      >
        <BasicMenu />
      </Drawer>
      }
    </React.Fragment>;

    return (

      <Layout style={{ minHeight: '100vh', direction: isRTL ? 'rtl' : 'ltr' }}>
        {sideMenu}
        <Layout style={{ marginLeft: contentMargin + 'px' }}>

          <Header style={{ background: '#fff', padding: 0, display: 'flex' }}>
            {isMobile && <div className="headerLogo"><Logo style={{ height: '100px', flex: '0 0 auto' }} /></div>}
            <Icon
              style={{ flex: '0 0 auto' }}
              className="menu-trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div style={{ flex: '1 1 auto' }} />
            <div className="header__secondary" style={{ flex: '0 0 auto' }}>
              <UserMenu />
              <SelectLang />
            </div>
          </Header>
          <Content style={{ overflow: 'initial', margin: '5px 16px 24px 16px', minHeight: 280 }}>
            {this.props.children}
          </Content>
          <Footer className="text-center">
            <FormattedMessage
              id="copyrights"
              defaultMessage="This site is affiliated to GBIF | Global Biodiversity Information Facility."
            /> <a href="https://www.gbif.org/terms/privacy-policy" target="_blank" rel="noopener noreferrer">
              <FormattedMessage id="cookieAndPolicy" defaultMessage="Cookie and privacy policy."/>
            </a>
            <div>
              <a href="https://github.com/gbif/registry-console" target="_blank" rel="noopener noreferrer">
                <FormattedMessage id="githubRepo" defaultMessage="GitHub Repository"/>
              </a> | <a href="https://github.com/gbif/registry-console/issues" target="_blank" rel="noopener noreferrer">
                <FormattedMessage id="issuesTracker" defaultMessage="Issues tracker"/>
              </a>
            </div>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

const mapContextToProps = ({ isRTL }) => ({ isRTL });

export default withContext(mapContextToProps)(injectSheet(styles)(withWidth()(SiteLayout)));