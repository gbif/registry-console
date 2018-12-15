import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Menu, Row } from 'antd';
import { FormattedMessage } from 'react-intl';

const InstallationMenu = (props) => {
  const { children, match, location, counts, servedDataset, syncHistory } = props;

  return (
    <div className="item-container">
      <Row type="flex" justify="start">
        <Menu
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={[location.pathname.split('/')[1]]}
          mode="inline"
        >
          <Menu.Item key="installation">
            <NavLink to={`/installation/${match.params.key}`}>
              <FormattedMessage id="overview" defaultMessage="Overview"/>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="contact" disabled={match.params.key === 'create'}>
            <NavLink to={`/installation/${match.params.key}/contact`}>
              <FormattedMessage id="contacts" defaultMessage="Contacts"/> ({counts.contacts})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="endpoint" disabled={match.params.key === 'create'}>
            <NavLink to={`/installation/${match.params.key}/endpoint`}>
              <FormattedMessage id="endpoints" defaultMessage="Endpoints"/> ({counts.endpoints})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="machineTag" disabled={match.params.key === 'create'}>
            <NavLink to={`/installation/${match.params.key}/machineTag`}>
              <FormattedMessage id="tags" defaultMessage="Tags"/> ({counts.machineTags})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="comment" disabled={match.params.key === 'create'}>
            <NavLink to={`/installation/${match.params.key}/comment`}>
              <FormattedMessage id="comments" defaultMessage="Comments"/> ({counts.comments})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="servedDatasets" disabled={match.params.key === 'create'}>
            <NavLink to={`/installation/${match.params.key}/servedDatasets`}>
              <FormattedMessage id="servedDatasets" defaultMessage="Served datasets"/> ({servedDataset})
            </NavLink>
          </Menu.Item>
          <Menu.Item key="synchronizationHistory" disabled={match.params.key === 'create'}>
            <NavLink to={`/installation/${match.params.key}/synchronizationHistory`}>
              <FormattedMessage id="synchronizationHistory" defaultMessage="Synchronization history"/> ({syncHistory})
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

export default withRouter(InstallationMenu);