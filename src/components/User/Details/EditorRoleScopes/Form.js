import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Select, Spin, Tag } from 'antd';
import { FormattedMessage } from 'react-intl';
import injectSheet from 'react-jss';
import { NavLink } from 'react-router-dom';


// APIs
import { getNodeSuggestions } from '../../../../api/node';
import { getNetworkSuggestions } from '../../../../api/network';
import { getOrgSuggestions } from '../../../../api/organization';
import { getDatasetSuggestions } from '../../../../api/dataset';
import { getSuggestedInstitutions } from '../../../../api/institution';
import { getSuggestedCollections } from '../../../../api/collection';
import { getSuggestedInstallations } from '../../../../api/installation';

// Components
import { FormItem } from '../../../common';

const styles = {
  select: {
    width: '100%'
  },
  tagContainer: {
    marginTop: '15px',
    '& > *': {
      margin: '5px'
    }
  },
  textContent: {
    maxWidth: '98%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    float: 'left',
    padding: '0 3px',
    borderRight: '1px solid #ccc',
    '& > a:hover': {
      textDecoration: 'underline',
    }
  },
  tagType: {
    maxWidth: '98%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    float: 'left',
    paddingRight: '3px',
    borderRight: '1px solid #ccc',
    '&:hover': {
      textDecoration: 'underline',
    }
  }
};

class EditorRoleScopeForm extends Component {
  state = {
    nodes: [],
    organizations: [],
    networks: [],
    datasets: [],
    institutions: [],
    collections: [],
    installations: [],
    fetchingInstallations: false,
    fetchingDatasets: false,
    fetchingNodes: false,
    fetchingOrganizations: false,
    fetchingNetworks: false,
    fetchingInstitutions: false,
    fetchingCollections: false
  };

  handleNodeSearch = value => {
    if (!value) {
      this.setState({ nodes: [] });
      return;
    }

    this.setState({ fetchingNodes: true });

    getNodeSuggestions({ q: value }).then(response => {
      this.setState({
        nodes: response.data,
        fetchingNodes: false
      });
    });
  };

  handleNetworkSearch = value => {
    if (!value) {
      this.setState({ networks: [] });
      return;
    }

    this.setState({ fetchingNetworks: true });

    getNetworkSuggestions({ q: value }).then(response => {
      this.setState({
        networks: response.data,
        fetchingNetworks: false
      });
    });
  };

  handleOrganizationSearch = value => {
    if (!value) {
      this.setState({ organizations: [] });
      return;
    }

    this.setState({ fetchingOrganizations: true });

    getOrgSuggestions({ q: value }).then(response => {
      this.setState({
        organizations: response.data,
        fetchingOrganizations: false
      });
    });
  };

  handleDatasetSearch = value => {
    if (!value) {
      this.setState({ datasets: [] });
      return;
    }

    this.setState({ fetchingDatasets: true });

    getDatasetSuggestions({ q: value }).then(response => {
      this.setState({
        datasets: response.data,
        fetchingDatasets: false
      });
    });
  };

  handleInstitutionSearch = value => {
    if (!value) {
      this.setState({ institutions: [] });
      return;
    }

    this.setState({ fetchingInstitutions: true });

    getSuggestedInstitutions({ q: value }).then(response => {
      this.setState({
        institutions: response.data,
        fetchingInstitutions: false
      });
    });
  };

  handleCollectionSearch = value => {
    if (!value) {
      this.setState({ collections: [] });
      return;
    }

    this.setState({ fetchingCollections: true });

    getSuggestedCollections({ q: value }).then(response => {
      this.setState({
        collections: response.data,
        fetchingCollections: false
      });
    });
  };

  handleInstallationSearch = value => {
    if (!value) {
      this.setState({ installations: [] });
      return;
    }

    this.setState({ fetchingInstallations: true });

    getSuggestedInstallations({ q: value }).then(response => {
      this.setState({
        installations: response.data,
        fetchingInstallations: false
      });
    });
  };


  handleSelect = (key, type) => {
    let list = this.state.nodes;
    if (type === 'DATASET') list = this.state.datasets;
    if (type === 'ORGANIZATION') list = this.state.organizations;
    if (type === 'NETWORK') list = this.state.networks;
    if (type === 'COLLECTION') list = this.state.collections;
    if (type === 'INSTITUTION') list = this.state.institutions;
    if (type === 'INSTALLATION') list = this.state.installations;

    const item = list.find(item => item.key === key);
    this.props.onAdd({ ...item, type });
  };

  handleClose = key => {
    this.props.onRemove(key);
  };

  render() {
    const { fetchingInstallations, installations, collections, fetchingCollections, institutions, fetchingInstitutions, datasets, fetchingDatasets, nodes, organizations, networks, fetchingNodes, fetchingOrganizations, fetchingNetworks } = this.state;
    const { scopes, classes } = this.props;

    return (
      <React.Fragment>
        <FormItem label={<FormattedMessage id="scopes.node" defaultMessage="Node scopes"/>}>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={false}
            placeholder={<FormattedMessage id="select.node" defaultMessage="Select a node"/>}
            notFoundContent={
              fetchingNodes ? <Spin size="small"/> : <FormattedMessage id="notFound" defaultMessage="Not Found"/>
            }
            onSelect={key => this.handleSelect(key, 'NODE')}
            onSearch={this.handleNodeSearch}
            allowClear={true}
            className={classes.select}
          >
            {nodes.map(node => (
              <Select.Option value={node.key} key={node.key}>
                {node.title}
              </Select.Option>
            ))}
          </Select>
        </FormItem>

        <FormItem label={<FormattedMessage id="scopes.organization" defaultMessage="Organization scopes"/>}>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={false}
            placeholder={<FormattedMessage id="select.organization" defaultMessage="Select an organization"/>}
            notFoundContent={
              fetchingOrganizations ? <Spin size="small"/> :
                <FormattedMessage id="notFound" defaultMessage="Not Found"/>
            }
            onSelect={key => this.handleSelect(key, 'ORGANIZATION')}
            onSearch={this.handleOrganizationSearch}
            allowClear={true}
            className={classes.select}
          >
            {organizations.map(organization => (
              <Select.Option value={organization.key} key={organization.key}>
                {organization.title}
              </Select.Option>
            ))}
          </Select>
        </FormItem>

        <FormItem label={<FormattedMessage id="scopes.dataset" defaultMessage="Dataset scopes"/>}>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={false}
            placeholder={<FormattedMessage id="select.dataset" defaultMessage="Select a dataset"/>}
            notFoundContent={
              fetchingDatasets ? <Spin size="small"/> :
                <FormattedMessage id="notFound" defaultMessage="Not Found"/>
            }
            onSelect={key => this.handleSelect(key, 'DATASET')}
            onSearch={this.handleDatasetSearch}
            allowClear={true}
            className={classes.select}
          >
            {datasets.map(dataset => (
              <Select.Option value={dataset.key} key={dataset.key}>
                {dataset.title}
              </Select.Option>
            ))}
          </Select>
        </FormItem>

        <FormItem label={<FormattedMessage id="scopes.network" defaultMessage="Network scopes"/>}>
          <Select
              showSearch
              optionFilterProp="children"
              filterOption={false}
              placeholder={<FormattedMessage id="select.network" defaultMessage="Select a network"/>}
              notFoundContent={
                fetchingNetworks ? <Spin size="small"/> :
                    <FormattedMessage id="notFound" defaultMessage="Not Found"/>
              }
              onSelect={key => this.handleSelect(key, 'NETWORK')}
              onSearch={this.handleNetworkSearch}
              allowClear={true}
              className={classes.select}
          >
            {networks.map(network => (
                <Select.Option value={network.key} key={network.key}>
                  {network.title}
                </Select.Option>
            ))}
          </Select>
        </FormItem>

        <FormItem label={<FormattedMessage id="scopes.institution" defaultMessage="Institution scopes"/>}>
          <Select
              showSearch
              optionFilterProp="children"
              filterOption={false}
              placeholder={<FormattedMessage id="select.institution" defaultMessage="Select an institution"/>}
              notFoundContent={
                fetchingInstitutions ? <Spin size="small"/> :
                    <FormattedMessage id="notFound" defaultMessage="Not Found"/>
              }
              onSelect={key => this.handleSelect(key, 'INSTITUTION')}
              onSearch={this.handleInstitutionSearch}
              allowClear={true}
              className={classes.select}
          >
            {institutions.map(institution => (
                <Select.Option value={institution.key} key={institution.key}>
                  {institution.name}
                </Select.Option>
            ))}
          </Select>
        </FormItem>

        <FormItem label={<FormattedMessage id="scopes.collection" defaultMessage="Collection scopes"/>}>
          <Select
              showSearch
              optionFilterProp="children"
              filterOption={false}
              placeholder={<FormattedMessage id="select.collection" defaultMessage="Select a collection"/>}
              notFoundContent={
                fetchingCollections ? <Spin size="small"/> :
                    <FormattedMessage id="notFound" defaultMessage="Not Found"/>
              }
              onSelect={key => this.handleSelect(key, 'COLLECTION')}
              onSearch={this.handleCollectionSearch}
              allowClear={true}
              className={classes.select}
          >
            {collections.map(collection => (
                <Select.Option value={collection.key} key={collection.key}>
                  {collection.name}
                </Select.Option>
            ))}
          </Select>
        </FormItem>

        <FormItem label={<FormattedMessage id="scopes.installation" defaultMessage="Installation scopes"/>}>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={false}
            placeholder={<FormattedMessage id="select.installation" defaultMessage="Select an installation"/>}
            notFoundContent={
              fetchingInstallations ? <Spin size="small"/> :
                <FormattedMessage id="notFound" defaultMessage="Not Found"/>
            }
            onSelect={key => this.handleSelect(key, 'INSTALLATION')}
            onSearch={this.handleInstallationSearch}
            allowClear={true}
            className={classes.select}
          >
            {installations.map(installation => (
              <Select.Option value={installation.key} key={installation.key}>
                {installation.title}
              </Select.Option>
            ))}
          </Select>
        </FormItem>

        <Row type="flex">
          <Col span={24} className={classes.tagContainer}>
            {scopes && scopes.map(scope => (
              <Tag closable onClose={() => this.handleClose(scope.key)} key={scope.key} style={{whiteSpace: 'break-spaces'}}>
                {scope.type && <>
                <span className={classes.textContent}><FormattedMessage id={`scopes.type.${scope.type}`}/></span>
                <span className={classes.textContent}>
                  <NavLink to={`/${scope.type.toLowerCase()}/${scope.key}`}>
                    {scope.title || scope.name}
                  </NavLink>
                </span>
                </>}
              </Tag>
            ))}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

EditorRoleScopeForm.propTypes = {
  scopes: PropTypes.array,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default injectSheet(styles)(EditorRoleScopeForm);
