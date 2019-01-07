import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Col, Menu, Row } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Wrappers
import withWidth, { SMALL } from '../hoc/Width';
import withContext from '../hoc/withContext';
import Paper from '../search/Paper';
// Components
import GBIFLink from './GBIFLink';

/**
 * Component responsible for a subtype menu generation base on parameters mentioned in a config
 * and current user's permissions
 * @param props
 * @returns {*}
 * @constructor
 */
const ItemMenu = props => {
  const { children, counts, match, location, width, config, isNew, classes } = props;

  /**
   * Checking whether user has required roles or not
   * @param roles - list of required roles
   * @returns {boolean|ItemMenu.props.user|*}
   */
  const isAuthorised = roles => {
    const { user } = props;

    return !roles || (user && user.roles.some(role => roles.includes(role)));
  };

  /**
   * Parsing URL to highlight correct lint in a menu
   * @returns {*|string}
   */
  const getSubMenu = () => {
    const keys = location.pathname.slice(1).split('/');

    if (keys[0] === 'grbio') {
      return keys[3] || keys[1];
    }

    return keys[2] || keys[0];
  };

  /**
   * Generating additional link to view selected item on GBIF.org
   * Exists for a limited list of item types
   * @returns {*}
   */
  const getGBIFLink = () => {
    // On GBIF.org we do not have organizations, only publishers
    let type = match.params.type === 'organization' ? 'publisher' : match.params.type;
    // For GRBIO types
    if (match.params.parent) {
      type = `${match.params.parent}/${type}`;
    }

    return (
      <Menu.Item key="gbif">
        <GBIFLink type={type} uuid={match.params.key}/>
      </Menu.Item>
    );
  };

  /**
   * Rendering whole menu at a time
   * Reason: Ant Menu Component does not support dynamical additions of items after it renders itself
   * @returns {*}
   */
  const renderMenu = () => {
    const submenu = getSubMenu();

    return (
      <Menu
        defaultSelectedKeys={[submenu]}
        mode={width <= SMALL ? 'horizontal' : 'inline'}
      >
        {config.filter(item => {
          return isAuthorised(item.roles) && (!isNew || !item.hideOnNew);
        }).map(item => (
          <Menu.Item key={item.key}>
            <NavLink to={getURL(item)}>
              <FormattedMessage id={item.title.id} defaultMessage={item.title.default}/>
              <span className={classes.counter}>{item.subtype ? `(${counts[item.count] || 0})` : null}</span>
            </NavLink>
          </Menu.Item>
        ))}
        {!isNew && getGBIFLink()}
      </Menu>
    );
  };

  /**
   * Creating a link for menu link based on configuration of given item
   * @param item
   * @returns {string}
   */
  const getURL = item => {
    let url = `${item.to}${match.params.key}`;
    if (item.subtype) {
      url += `/${item.subtype}`;
    }

    return url;
  };

  return (
    <Paper>
      <Row type="flex" justify="start">
        <Col style={{ width: width <= SMALL ? '100%' : '200px' }}>
          {renderMenu()}
        </Col>
        <Col style={{ width: width <= SMALL ? '100%' : 'calc(100% - 200px)', padding: '16px', boxSizing: 'border-box' }}>
          {children}
        </Col>
      </Row>
    </Paper>
  );
};

ItemMenu.propTypes = {
  counts: PropTypes.object.isRequired, // count of subtypes to display next to subtype title
  config: PropTypes.array.isRequired, // config for a specific item type to generate menu based on it
  isNew: PropTypes.bool.isRequired // additional option to display some of subtypes during item creation or not
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(withRouter(withWidth()(ItemMenu)));