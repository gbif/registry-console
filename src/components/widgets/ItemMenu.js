import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Col, Menu, Row } from 'antd';
import { FormattedMessage } from 'react-intl';
import withWidth, { SMALL } from 'react-width';

import withContext from '../hoc/withContext';

const ItemMenu = props => {
  const { children, counts, match, location, width, config, isNew } = props;

  const isAuthorised = roles => {
    const { user } = props;

    return !roles || (user && user.roles.some(role => roles.includes(role)));
  };

  const renderMenu = () => {
    return (
      <Menu
        defaultSelectedKeys={[location.pathname.split('/')[1]]}
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
      </Menu>
    );
  };

  const getURL = item => {
    let url = `${item.to}${match.params.key}`;
    if (item.subtype) {
      url += `/${item.subtype}`
    }

    return url;
  };

  return (
    <div style={{ background: '#fff' }}>
      <Row type="flex" justify="start">
        <Col xs={24} sm={24} md={8} lg={8} style={{ borderRight: '1px solid #e8e8e8' }}>{renderMenu()}</Col>
        <Col xs={24} sm={24} md={16} lg={16} style={{ padding: '16px', boxSizing: 'border-box' }}>
          {children}
        </Col>
      </Row>
    </div>
  );
};

const mapContextToProps = ({ user }) => ({ user });

export default withContext(mapContextToProps)(withRouter(withWidth()(ItemMenu)));