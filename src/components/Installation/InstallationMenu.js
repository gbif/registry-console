import React from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, Row } from 'antd';
import { FormattedMessage } from 'react-intl';

const InstallationMenu = (props) => {
  const { children, match, location, history, counts, servedDataset, syncHistory } = props;

  return (
    <div className="item-container">
      <Row type="flex" justify="start">
        <Menu
          onClick={(e) => {
            history.push(e.key);
          }}
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={[location.pathname.split('/')[1]]}
          mode="inline"
        >
          <Menu.Item key={`/installation/${match.params.key}`}>
            <FormattedMessage id="overview" defaultMessage="Overview"/>
          </Menu.Item>
          <Menu.Item key={`/installation/${match.params.key}/contact`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="contacts" defaultMessage="Contacts"/> ({counts.contacts})
          </Menu.Item>
          <Menu.Item key={`/installation/${match.params.key}/endpoint`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="endpoints" defaultMessage="Endpoints"/> ({counts.endpoints})
          </Menu.Item>
          <Menu.Item key={`/installation/${match.params.key}/machineTag`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="tags" defaultMessage="Tags"/> ({counts.machineTags})
          </Menu.Item>
          <Menu.Item key={`/installation/${match.params.key}/comment`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="comments" defaultMessage="Comments"/> ({counts.comments})
          </Menu.Item>
          <Menu.Item key={`/installation/${match.params.key}/servedDatasets`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="servedDatasets" defaultMessage="Served datasets"/> ({servedDataset})
          </Menu.Item>
          <Menu.Item
            key={`/installation/${match.params.key}/synchronizationHistory`}
            disabled={match.params.key === 'create'}
          >
            <FormattedMessage id="synchronizationHistory" defaultMessage="Synchronization history"/> ({syncHistory})
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