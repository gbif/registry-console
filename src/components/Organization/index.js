import React, { Component } from 'react';

import { getOrganizationOverview } from '../../api/organization';
import { Spin } from 'antd';
import { Route, Switch } from 'react-router-dom';
import OrganizationMenu from './OrganizationMenu';
import OrganizationDetails from './Details';
import DatasetDetails from '../Dataset/Details';

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
    this.getData(this.state.query);
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
    const { match } = this.props;
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
              <Route path={`${match.path}/contact`} component={() => <h1>Contacts</h1>}/>
              <Route path={`${match.path}/endpoint`} component={() => <h1>Endpoints</h1>}/>
              <Route path={`${match.path}/identifier`} component={() => <h1>Identifiers</h1>}/>
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

export default Organization;