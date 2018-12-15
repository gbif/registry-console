import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Menu, Row } from 'antd';
import { FormattedMessage } from 'react-intl';

const NodeMenu = (props) => {
  const { children, counts, pending, organizations, datasets, installations, match, location } = props;

  return (
    <div className="item-container">
      <Row type="flex" justify="start">
        <Menu
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={[location.pathname.split('/')[1]]}
          mode="inline"
        >
          <Menu.Item key="node">
            <NavLink to={`/node/${match.params.key}`}>
              <FormattedMessage id="overview" defaultMessage="Overview"/>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="contact" disabled={match.params.key === 'create'}>
            <NavLink to={`/node/${match.params.key}/contact`}>
              <FormattedMessage id="contacts" defaultMessage="Contacts"/> ({counts.contacts})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="endpoint" disabled={match.params.key === 'create'}>
            <NavLink to={`/node/${match.params.key}/endpoint`}>
              <FormattedMessage id="endpoints" defaultMessage="Endpoints"/> ({counts.endpoints})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="identifier" disabled={match.params.key === 'create'}>
            <NavLink to={`/node/${match.params.key}/identifier`}>
              <FormattedMessage id="identifiers" defaultMessage="Identifiers"/> ({counts.identifiers})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="tag" disabled={match.params.key === 'create'}>
            <NavLink to={`/node/${match.params.key}/tag`}>
              <FormattedMessage id="tags" defaultMessage="Tags"/> ({counts.tags})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="machineTag" disabled={match.params.key === 'create'}>
            <NavLink to={`/node/${match.params.key}/machineTag`}>
              <FormattedMessage id="machineTags" defaultMessage="Machine Tags"/> ({counts.machineTags})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="comment" disabled={match.params.key === 'create'}>
            <NavLink to={`/node/${match.params.key}/comment`}>
              <FormattedMessage id="comments" defaultMessage="Comments"/> ({counts.comments})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="pending" disabled={match.params.key === 'create'}>
            <NavLink to={`/node/${match.params.key}/pending`}>
              <FormattedMessage id="pendingEndorsements" defaultMessage="Pending endorsements"/> ({pending})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="organization" disabled={match.params.key === 'create'}>
            <NavLink to={`/node/${match.params.key}/organization`}>
              <FormattedMessage id="endorsedOrganizations" defaultMessage="Endorsed organizations"/> ({organizations})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="dataset" disabled={match.params.key === 'create'}>
            <NavLink to={`/node/${match.params.key}/dataset`}>
              <FormattedMessage id="endorsedDatasets" defaultMessage="Endorsed datasets"/> ({datasets})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="installation" disabled={match.params.key === 'create'}>
            <NavLink to={`/node/${match.params.key}/installation`}>
              <FormattedMessage id="installations" defaultMessage="Installations"/> ({installations})
            </NavLink>
          </Menu.Item>
        </Menu>
        <div className="item-content">
          {children}
        </div>
      </Row>
    </div>
  );
};

export default withRouter(NodeMenu);