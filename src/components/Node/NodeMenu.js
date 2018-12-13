import React from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, Row } from 'antd';
import { FormattedMessage } from 'react-intl';

const NodeMenu = (props) => {
  const {
    children,
    counts,
    pending,
    organizations,
    datasets,
    installations,
    match,
    location,
    history
  } = props;

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
          <Menu.Item key={`/node/${match.params.key}`}>
            <FormattedMessage id="overview" defaultMessage="Overview"/>
          </Menu.Item>
          <Menu.Item key={`/node/${match.params.key}/contact`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="contacts" defaultMessage="Contacts"/> ({counts.contacts})
          </Menu.Item>
          <Menu.Item key={`/node/${match.params.key}/endpoint`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="endpoints" defaultMessage="Endpoints"/> ({counts.endpoints})
          </Menu.Item>
          <Menu.Item key={`/node/${match.params.key}/identifier`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="identifiers" defaultMessage="Identifiers"/> ({counts.identifiers})
          </Menu.Item>
          <Menu.Item key={`/node/${match.params.key}/tag`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="tags" defaultMessage="Tags"/> ({counts.tags})
          </Menu.Item>
          <Menu.Item key={`/node/${match.params.key}/machineTag`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="machineTags" defaultMessage="Machine Tags"/> ({counts.machineTags})
          </Menu.Item>
          <Menu.Item key={`/node/${match.params.key}/comment`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="comments" defaultMessage="Comments"/> ({counts.comments})
          </Menu.Item>
          <Menu.Item key={`/node/${match.params.key}/pending`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="pendingEndorsements" defaultMessage="Pending endorsements"/> ({pending})
          </Menu.Item>
          <Menu.Item key={`/node/${match.params.key}/organization`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="endorsedOrganizations" defaultMessage="Endorsed organizations"/> ({organizations})
          </Menu.Item>
          <Menu.Item key={`/node/${match.params.key}/dataset`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="endorsedDatasets" defaultMessage="Endorsed datasets"/> ({datasets})
          </Menu.Item>
          <Menu.Item key={`/node/${match.params.key}/installation`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="installations" defaultMessage="Installations"/> ({installations})
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