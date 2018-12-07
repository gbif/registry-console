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
    console.log(match.path);

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
              <Route path={`${match.path}/identifier`} component={() => <IdentifierList user={user}/>}/>
              <Route path={`${match.path}/tag`} component={() => <h1>Tags</h1>}/>
              <Route path={`${match.path}/machineTag`} component={() => <h1>Machine Tags</h1>}/>
              <Route path={`${match.path}/comment`} component={() => <h1>Comments</h1>}/>
              <Route path={`${match.path}/publishedDataset`} component={() => <h1>Published Datasets</h1>}/>
              <Route path={`${match.path}/hostedDataset`} component={() => <h1>Hosted Datasets</h1>}/>
              <Route path={`${match.path}/installation`} component={() => <h1>Installations</h1>}/>
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