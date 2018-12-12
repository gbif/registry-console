import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Row } from 'antd';

const DatasetMenu = (props) => {
  const { children, dataset, match, constituents } = props;
  const { contacts, identifiers, tags } = dataset;

  return (
    <div className="item-container">
      <Row type="flex" justify="start">
        <Menu
          // onClick={this.handleClick}
          defaultSelectedKeys={[match.params.section || 'details']}
          mode="inline"
        >
          <Menu.Item key="details"><NavLink to={`/dataset/${match.params.key}`}>Overview</NavLink></Menu.Item>
          <Menu.Item key="contact"><NavLink to={`/dataset/${match.params.key}/contact`}>Contacts
            ({contacts.length})</NavLink></Menu.Item>
          <Menu.Item key="identifier"><NavLink to={`/dataset/${match.params.key}/identifier`}>Identifiers
            ({identifiers.length})</NavLink></Menu.Item>
          <Menu.Item key="tag"><NavLink to={`/dataset/${match.params.key}/tag`}>Tags
            ({tags.length})</NavLink></Menu.Item>
          <Menu.Item key="constituents"><NavLink to={`/dataset/${match.params.key}/constituents`}>Constituents datasets
            ({constituents.count})</NavLink></Menu.Item>
        </Menu>
        <div className="item-content">
          {children}
        </div>
      </Row>
    </div>
  );
};

export default withRouter(DatasetMenu);