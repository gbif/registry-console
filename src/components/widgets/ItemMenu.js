import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Col, Menu, Row } from 'antd';
import { FormattedMessage } from 'react-intl';
import withWidth, { SMALL } from 'react-width';
import PropTypes from 'prop-types';

import withContext from '../hoc/withContext';
import GBIFLink from './GBIFLink';

/**
 * Component responsible for a subtype menu generation base on parameters mentioned in a config
 * and current user's permissions
 * @param props
 * @returns {*}
 * @constructor
 */
const ItemMenu = props => {
  const { children, counts, match, location, width, config, isNew } = props;

  const isAuthorised = roles => {
    const { user } = props;

    return !roles || (user && user.roles.some(role => roles.includes(role)));
  };

  const getSubMenu = () => {
    const keys = location.pathname.slice(1).split('/');

    if (keys[0] === 'grbio') {
      return keys[3] || keys[1];
    }

    return keys[2] || keys[0];
  };

  const getGBIFLink = () => {
    if (!['organization', 'dataset', 'node'].includes(match.params.type)) {
      return null;
    }

    // On GBIF.org we do not have organizations, only publishers
    const type = match.params.type === 'organization' ? 'publisher' : match.params.type;

    return (
      <Menu.Item key="gbif">
        <GBIFLink type={type} uid={match.params.key}/>
      </Menu.Item>
    );
  };

  const renderMenu = () => {
    const submenu = getSubMenu();

    return (
      <Menu
        defaultSelectedKeys={[submenu]}
        mode={width <= SMALL ? 'horizontal' : 'inline'}
        style={{ border: 'none' }}
      >
        {config.filter(item => {
          return isAuthorised(item.roles) && (!isNew || !item.hideOnNew);
        }).map(item => (
          <Menu.Item key={item.key}>
            <NavLink to={getURL(item)}>
              <FormattedMessage id={item.title.id} defaultMessage={item.title.default}/>
              {item.subtype ? ` (${counts[item.count] || 0})` : null}
            </NavLink>
          </Menu.Item>
        ))}
        {!isNew && getGBIFLink()}
      </Menu>
    );
  };

  const getURL = item => {
    let url = `${item.to}${match.params.key}`;
    if (item.subtype) {
      url += `/${item.subtype}`;
    }

    return url;
  };

  return (
    <div style={{ background: '#fff' }}>
      <Row type="flex" justify="start">
        <Col xs={24} sm={24} md={8} lg={8} style={{ borderRight: '1px solid #e8e8e8' }}>
          {renderMenu()}
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} style={{ padding: '16px', boxSizing: 'border-box' }}>
          {children}
        </Col>
      </Row>
    </div>
  );
};

ItemMenu.propTypes = {
  counts: PropTypes.object.isRequired, // count of subtypes to display next to subtype title
  config: PropTypes.object.isRequired, // config for a specific item type to generate menu based on it
  isNew: PropTypes.bool.isRequired // additional option to display some of subtypes during item creation or not
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(withRouter(withWidth()(ItemMenu)));