import React from 'react';
import config from '../../api/util/config';
import { Link } from 'react-router-dom'
import _get from 'lodash/get';
import injectSheet from 'react-jss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Alert, Row, Col, Card, Badge } from 'antd';

import { search as organizationSearch } from '../../api/organization';
import { searchDatasets, searchDatasetsWithNoEndpoint } from '../../api/dataset';
import { search as searchInstallations } from '../../api/installation';
import { search as searchNodes, getPendingEndorsement } from '../../api/node';
import CountMessage from '../common/CountMessage'
import FormattedRelativeDate from '../common/FormattedRelativeDate';
import { HasRole, roles } from '../auth';

const { Meta } = Card;
const styles = {
  card: { width: 300, marginTop: 16 },
  link: {
    color: 'inherit',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  col: {
    marginBottom: 10
  }
};

class Overview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    this.fetchData();
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  async fetchData() {
    this.setState({
      loading: true,
      error: false
    });

    try {
      const results = await Promise.all([
        organizationSearch({ limit: 1 }),
        getPendingEndorsement(config.secretariatNode, { limit: 0 }),
        searchDatasets({ limit: 1 }),
        searchDatasetsWithNoEndpoint({ limit: 0 }),
        searchInstallations({ limit: 1 }),
        searchNodes({ limit: 1 }),
      ]);
      if (this._isMount) {
        this.setState({
          error: false,
          loading: false,
          totalOrganizations: _get(results[0], 'data.count'),
          latestOrganization: _get(results[0], 'data.results[0]'),
          pendingOrganizationCount: results[1].data.count,
          totalDatasets: _get(results[2], 'data.count'),
          latestDataset: _get(results[2], 'data.results[0]'),
          withoutEndpointCount: results[3].data.count,
          totalInstallations: _get(results[4], 'data.count'),
          latestInstallation: _get(results[4], 'data.results[0]'),
          totalNodes: _get(results[5], 'data.count'),
          latestNode: _get(results[5], 'data.results[0]'),
        });
      }
    } catch (err) {
      if (this._isMount) {
        this.setState({
          error: true,
          loading: false
        });
      }
    }
  }

  OverviewCard = ({ icon, title, titleLink, total, lastCreated, lastLink, warning, warningLink }, { link, col }) => {
    if (this.state.loading) {
      return (
        <Col xs={24} sm={24} md={12} lg={6} className={col}>
          <Card loading={this.state.loading} />
        </Col>
      );
    }
    const lastMessage = <FormattedMessage
      id="dashboard.lastCreatedAgo"
      defaultMessage={'Last added {timeAgo}'}
      values={{ timeAgo: <FormattedRelativeDate value={lastCreated} /> }}
    />;
    const desc = (
      <div>
        <div><CountMessage id="dashboard.xInTotal" count={total} /></div>
        <div><Link className={link} to={lastLink}>{lastMessage}</Link></div>
        {warning && <HasRole roles={roles.REGISTRY_ADMIN}><Badge
          status="error"
          text={<Link className={link} to={warningLink}>{warning}</Link>}
        /></HasRole>}
      </div>
    );
    return (
      <Col xs={24} sm={24} md={12} lg={6} className={col}>
        <Card>
          <Meta
            avatar={<LegacyIcon type={icon} />}
            title={<Link className={link} to={titleLink}>{title}</Link>}
            description={desc} />
        </Card>
      </Col>
    );
  };

  render() {
    const org = {
      icon: 'share-alt',
      title: <FormattedMessage id="menu.organization" defaultMessage="Organizations" />,
      titleLink: '/organization/search',
      total: this.state.totalOrganizations,
      lastCreated: _get(this.state.latestOrganization, 'created'),
      lastLink: `organization/${_get(this.state.latestOrganization, 'key')}`,
      warning: <CountMessage id="dashboard.xPending" count={this.state.pendingOrganizationCount} />,
      warningLink: `node/${config.secretariatNode}/pending`
    };
    const dataset = {
      icon: 'table',
      title: <FormattedMessage id="menu.dataset" defaultMessage="Datasets" />,
      titleLink: '/dataset/search',
      total: this.state.totalDatasets,
      lastCreated: _get(this.state.latestDataset, 'created'),
      lastLink: `dataset/${_get(this.state.latestDataset, 'key')}`,
      warning: <CountMessage id="dashboard.xWithoutEndpoint" count={this.state.withoutEndpointCount} />,
      warningLink: `dataset/withNoEndpoint`
    };
    const installation = {
      icon: 'hdd',
      title: <FormattedMessage id="menu.installation" defaultMessage="Installations" />,
      titleLink: '/installation/search',
      total: this.state.totalInstallations,
      lastCreated: _get(this.state.latestInstallation, 'created'),
      lastLink: `installation/${_get(this.state.latestInstallation, 'key')}`,
    };
    const node = {
      icon: 'fork',
      title: <FormattedMessage id="menu.node" defaultMessage="Nodes" />,
      titleLink: '/node/search',
      total: this.state.totalNodes,
      lastCreated: _get(this.state.latestNode, 'created'),
      lastLink: `node/${_get(this.state.latestNode, 'key')}`,
    };
    return (
      <React.Fragment>
        {this.state.error && <Alert message="Error Text" type="error" />}
        {!this.state.error && <Row gutter={16}>
          {this.OverviewCard(org, this.props.classes)}
          {this.OverviewCard(dataset, this.props.classes)}
          {this.OverviewCard(installation, this.props.classes)}
          {this.OverviewCard(node, this.props.classes)}
        </Row>}
      </React.Fragment>
    );
  }
}

export default injectSheet(styles)(injectIntl(Overview));
