import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spin } from 'antd';

import { getOrganizationOverview } from '../../api/organization';
import OrganizationMenu from './OrganizationMenu';
import OrganizationDetails from './Details';
import ContactList from './ContactList';
import EndpointList from './EnpointList';
import IdentifierList from './IdentifiersList';
import TagList from './TagList';
import MachineTagList from './MachineTagList';
import CommentList from './CommentList';
import PublishedDataset from './PublishedDataset';
import HostedDataset from './HostedDataset';
import Installations from './Installations';

class Organization extends Component {
  constructor(props) {
    super(props);

    this.getData = this.getData.bind(this);

    this.state = {
      loading: true,
      error: false,
      data: undefined
    };
  }

  componentWillMount() {
    this.getData();
  }

  getData() {
    this.setState({
      loading: true,
      error: false
    });

    getOrganizationOverview(this.props.match.params.key).then(data => {
      this.setState({
        data,
        loading: false,
        error: false
      });
    }).catch(() => {
      this.setState({
        error: true
      });
    });
  }

  render() {
    const { match, user } = this.props;
    const { data, loading } = this.state;

    return (
      <React.Fragment>
        {!loading && <Route path="/:type?/:key?/:section?" render={props => (
          <OrganizationMenu
            organization={data.organization}
            publishedDatasets={data.publishedDatasets}
            installations={data.installations}
            hostedDatasets={data.hostedDatasets}
          >
            <Switch>
              <Route
                exact
                path={`${match.path}`}
                render={() => <OrganizationDetails organization={data.organization} refresh={this.getData}/>}
              />
              <Route path={`${match.path}/contact`} render={() => <ContactList user={user}/>}/>
              <Route path={`${match.path}/endpoint`} render={() => <EndpointList user={user}/>}/>
              <Route path={`${match.path}/identifier`} render={() => <IdentifierList user={user}/>}/>
              <Route path={`${match.path}/tag`} render={() => <TagList user={user}/>}/>
              <Route path={`${match.path}/machineTag`} render={() => <MachineTagList user={user}/>}/>
              <Route path={`${match.path}/comment`} render={() => <CommentList user={user}/>}/>
              <Route path={`${match.path}/publishedDataset`} render={() =>
                <PublishedDataset orgKey={match.params.key}/>
              }/>
              <Route path={`${match.path}/hostedDataset`} render={() =>
                <HostedDataset orgKey={match.params.key}/>
              }/>
              <Route path={`${match.path}/installation`} render={() =>
                <Installations orgKey={match.params.key}/>
              }/>
            </Switch>
          </OrganizationMenu>
        )}
        />}

        {loading && <Spin size="large"/>}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(Organization);