import React from 'react';
import { withRouter } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Menu, Row } from 'antd';

const DatasetMenu = (props) => {
  const { children, counts, match, constituents } = props;

  return (
    <div style={{ background: 'white' }}>
      <Row type="flex" justify="start">
        <Menu
          // onClick={this.handleClick}
          style={{ width: 256 }}
          defaultSelectedKeys={[match.params.section || 'details']}
          mode="inline"
        >
          <Menu.Item key="details">
            <NavLink to={`/dataset/${match.params.key}`}>Overview</NavLink>
          </Menu.Item>
          <Menu.Item key="contact" disabled={match.params.key === 'create'}>
            <NavLink to={`/dataset/${match.params.key}/contact`}>Contacts ({counts.contacts})</NavLink>
          </Menu.Item>
          <Menu.Item key="endpoint" disabled={match.params.key === 'create'}>
            <NavLink to={`/dataset/${match.params.key}/endpoint`}>Endpoints ({counts.endpoints})</NavLink>
          </Menu.Item>
          <Menu.Item key="identifier" disabled={match.params.key === 'create'}>
            <NavLink to={`/dataset/${match.params.key}/identifier`}>Identifiers ({counts.identifiers})</NavLink>
          </Menu.Item>
          <Menu.Item key="tag" disabled={match.params.key === 'create'}>
            <NavLink to={`/dataset/${match.params.key}/tag`}>Tags ({counts.tags})</NavLink>
          </Menu.Item>
          <Menu.Item key="machineTag" disabled={match.params.key === 'create'}>
            <NavLink to={`/dataset/${match.params.key}/machineTag`}>Machine tags ({counts.machineTags})</NavLink>
          </Menu.Item>
          <Menu.Item key="comment" disabled={match.params.key === 'create'}>
            <NavLink to={`/dataset/${match.params.key}/comment`}>Comments ({counts.comments})</NavLink>
          </Menu.Item>
          <Menu.Item key="constituents" disabled={match.params.key === 'create'}>
            <NavLink to={`/dataset/${match.params.key}/constituents`}>Constituents datasets ({constituents})</NavLink>
          </Menu.Item>
        </Menu>
        <div style={{ padding: 16, width: 'calc(100% - 256px)' }}>
          {children}
        </div>
      </Row>
    </div>
  );
};

export default withRouter(DatasetMenu);