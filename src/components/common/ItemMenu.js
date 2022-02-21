import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';
import { Col, Menu, Row } from 'antd';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

// Wrappers
import withWidth, { SMALL } from '../hoc/Width';
import withContext from '../hoc/withContext';
// Components
import GBIFLink from './GBIFLink';
import { hasPermission } from '../auth';

const styles = theme => ({
  container: {
    background: '#fff',
    maxWidth: theme.paperWidth,
    margin: '16px auto'
  },
  row: {
    overflow: 'hidden'
  },
  menuColumn: {
    borderLeft: '1px solid #e8e8e8',
    marginRight: '-1px',
    marginLeft: '-1px'
  },
  content: {
    padding: '16px',
    boxSizing: 'border-box'
  },
  menu: {
    height: '100%'
  },
  link: {
    '& span + span': {
      margin: '0 5px',
      '&:before': {
        content: '"("'
      },
      '&:after': {
        content: '")"'
      }
    }
  },
  icon: {
    transform: 'rotateZ(45deg)',
    margin: '0 5px'
  },
  gbifLink: {
    border: '1px solid rgb(232, 232, 232)',
    display: 'inline-block !important',
    lineHeight: 1,
    padding: '7px 5px 7px 15px',
    borderRadius: '3px'
  },
  counter: {
    margin: '0 5px',
    display: 'inline-block'
  }
});

/**
 * Component responsible for a subtype menu generation base on parameters mentioned in a config
 * and current user's permissions
 * @param props
 * @returns {*}
 * @constructor
 */
const ItemMenu = ({ children, counts, match, width, config, uuids, isNew, classes, user }) => {
  /**
   * Checking whether user has required roles or not
   * @param roles - list of required roles
   * @returns {boolean|ItemMenu.props.user|*}
   */
  const isAuthorised = authItem => {
    return !authItem || hasPermission(user, {
      roles: authItem.roles, 
      uuids: authItem.useItemUUID ? uuids : authItem.uuids,
      rights: authItem.rights
    });
  };

  /**
   * Rendering whole menu at a time
   * Reason: Ant Menu Component does not support dynamical additions of items after it renders itself
   * @returns {*}
   */
  const renderMenu = () => {
    const submenu = match.params.section || match.params.type || match.params.subType || match.params.subTypeSection ;

    return (
      <Menu
        defaultSelectedKeys={[submenu]}
        mode={width <= SMALL ? 'horizontal' : 'inline'}
        className={classes.menu}
      >
        {config.menu.filter(item => {
          return isAuthorised(item.auth) && (!isNew || !item.hideOnNew);
        }).map(item => (
          <Menu.Item key={item.key}>
            <NavLink to={getURL(item)} className={classes.link}>
              <FormattedMessage id={item.title.id} defaultMessage={item.title.default}/>
              {item.subtype && item.count ?
                <span className={classes.counter}><FormattedNumber value={counts[item.count] || 0}/></span>
                : null}
            </NavLink>
          </Menu.Item>
        ))}
        {!isNew && config.settings && config.settings.link && (
          <Menu.Item key="gbif">
            <GBIFLink link={config.settings.link} uuid={match.params.key} className={classes.gbifLink}>
              <FormattedMessage id="viewOnGBIF" defaultMessage="View on GBIF.org"/>
              <LinkOutlined className={classes.icon} />
            </GBIFLink>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  /**
   * Creating a link for menu link based on configuration of given item
   * @param item
   * @returns {string}
   */
  const getURL = item => {
    if (typeof item.to === 'function') {
      return item.to({params: match.params});
    }
    let url = `${item.to}${match.params.key}`;
    if (item.subtype) {
      url += `/${item.subtype}${match.params.subTypeKey ? ('/'+ match.params.subTypeKey) : ''}`;
    }
    if (item.subtype && item.subTypeSection){
      url += `/${item.subTypeSection}`
    }

    return url;
  };

  return (
    <div className={classes.container}>
      <Row type="flex" justify="start" className={classes.row}>
        <Col style={{ width: width <= SMALL ? '100%' : '270px' }} className={classes.menuColumn}>
          {renderMenu()}
        </Col>
        <Col className={classes.content} style={{ width: width <= SMALL ? '100%' : 'calc(100% - 270px)' }}>
          {children}
        </Col>
      </Row>
    </div>
  );
};

ItemMenu.propTypes = {
  counts: PropTypes.object.isRequired, // count of subtypes to display next to subtype title
  config: PropTypes.object.isRequired, // config for a specific item type to generate menu based on it
  key: PropTypes.string, // key if any
  isNew: PropTypes.bool.isRequired // additional option to display some of subtypes during item creation or not
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(withRouter(withWidth()(injectSheet(styles)(ItemMenu))));