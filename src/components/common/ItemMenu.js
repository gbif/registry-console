import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Col, Menu, Row } from 'antd';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

// Wrappers
import withWidth, { SMALL } from '../hoc/Width';
import withContext from '../hoc/withContext';
// Components
import GBIFLink from './GBIFLink';
import { hasRole } from '../auth';

const styles = theme => ({
  container: {
    background: '#fff',
    maxWidth: theme.paperWidth,
    margin: '0 auto'
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
  }
});

/**
 * Component responsible for a subtype menu generation base on parameters mentioned in a config
 * and current user's permissions
 * @param props
 * @returns {*}
 * @constructor
 */
const ItemMenu = props => {
  const { children, counts, match, width, config, isNew, classes } = props;

  /**
   * Checking whether user has required roles or not
   * @param roles - list of required roles
   * @returns {boolean|ItemMenu.props.user|*}
   */
  const isAuthorised = roles => {
    const { user } = props;

    return !roles || hasRole(user, roles);
  };

  /**
   * Generating additional link to view selected item on GBIF.org
   * Exists for a limited list of item types
   * @returns {*}
   */
  const getGBIFLink = () => {
    // On GBIF.org we do not have organizations, only publishers
    let type = match.params.type === 'organization' ? 'publisher' : match.params.type;

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
    const { match } = props;
    const submenu = match.params.section || match.params.type;
    return (
      <Menu
        defaultSelectedKeys={[submenu]}
        mode={width <= SMALL ? 'horizontal' : 'inline'}
        className={classes.menu}
      >
        {config.filter(item => {
          return isAuthorised(item.roles) && (!isNew || !item.hideOnNew);
        }).map(item => (
          <Menu.Item key={item.key}>
            <NavLink to={getURL(item)} className={classes.link}>
              <FormattedMessage id={item.title.id} defaultMessage={item.title.default}/>
              {item.subtype ? <FormattedNumber value={counts[item.count] || 0} /> : null}
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
    <div className={classes.container}>
      <Row type="flex" justify="start">
        <Col style={{ width: width <= SMALL ? '100%' : '270px' }}>
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
  config: PropTypes.array.isRequired, // config for a specific item type to generate menu based on it
  isNew: PropTypes.bool.isRequired // additional option to display some of subtypes during item creation or not
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(withRouter(withWidth()(injectSheet(styles)(ItemMenu))));