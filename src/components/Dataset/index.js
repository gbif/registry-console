import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Spin } from 'antd';

import {
  getDatasetOverview,
  updateContact,
  deleteContact,
  createContact,
  createComment,
  createEndpoint,
  createIdentifier, createMachineTag,
  createTag, deleteComment,
  deleteEndpoint,
  deleteIdentifier, deleteMachineTag,
  deleteTag
} from '../../api/dataset';
import DatasetMenu from './DatasetMenu';
import NotFound from '../NotFound';
import DatasetDetails from './Details';
import ContactList from '../common/ContactList';
import connect from 'react-redux/es/connect/connect';
import EndpointList from '../common/EndpointList';
import IdentifierList from '../common/IdentifiersList';
import TagList from '../common/TagList';
import MachineTagList from '../common/MachineTagList';
import CommentList from '../common/CommentList';
import ConstituentsDataset from './ConstituentsDataset';

//load dataset and provide via props to children. load based on route key.
//provide children with way to update root.

class Dataset extends React.Component {
  constructor(props) {
    super(props);

    this.getData = this.getData.bind(this);

    this.state = {
      loading: true,
      error: false,
      data: null,
      counts: {
        contacts: 0,
        endpoints: 0,
        identifiers: 0,
        tags: 0,
        machineTags: 0,
        comments: 0
      }
    };
  }

  componentWillMount() {
    if (this.props.match.params.key !== 'create') {
      this.getData();
    } else {
      this.setState({ loading: false });
    }
  }

  getData() {
    this.setState({
      loading: true,
      error: false
    });

    getDatasetOverview(this.props.match.params.key).then(data => {
      this.setState({
        data,
        loading: false,
        error: false,
        counts: {
          contacts: data.dataset.contacts.length,
          endpoints: data.dataset.endpoints.length,
          identifiers: data.dataset.identifiers.length,
          tags: data.dataset.tags.length,
          machineTags: data.dataset.machineTags.length,
          comments: data.dataset.comments.length
        }
      });
    })
      .catch(() => {
        this.setState({
          error: true
        });
      });
  }

  refresh = key => {
    if (key) {
      this.props.history.push(key);
    }

    this.getData();
  };

  updateCounts = (key, value) => {
    this.setState(state => {
      return {
        counts: {
          ...state.counts,
          [key]: value
        }
      };
    });
  };

  render() {
    const { match, user } = this.props;
    const key = match.params.key;
    const { data, loading, counts } = this.state;

    return (
      <React.Fragment>
        {!loading && <Route path="/:type?/:key?/:section?" render={() => (
          <DatasetMenu constituents={data ? data.constituents.count : 0} counts={counts}>
            <Switch>
              <Route exact path={`${match.path}`} render={() =>
                <DatasetDetails
                  dataset={data ? data.dataset : null}
                  refresh={key => this.refresh(key)}
                />
              }/>

              <Route path={`${match.path}/contact`} render={() =>
                <ContactList
                  data={data.dataset.contacts}
                  createContact={itemKey => createContact(key, itemKey)}
                  updateContact={data => updateContact(key, data)}
                  deleteContact={data => deleteContact(key, data)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/endpoint`} render={() =>
                <EndpointList
                  data={data.dataset.endpoints}
                  createEndpoint={data => createEndpoint(key, data)}
                  deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/identifier`} render={() =>
                <IdentifierList
                  data={data.dataset.identifiers}
                  createIdentifier={data => createIdentifier(key, data)}
                  deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/tag`} render={() =>
                <TagList
                  data={data.dataset.tags}
                  createTag={data => createTag(key, data)}
                  deleteTag={itemKey => deleteTag(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/machineTag`} render={() =>
                <MachineTagList
                  data={data.dataset.machineTags}
                  createMachineTag={data => createMachineTag(key, data)}
                  deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/comment`} render={() =>
                <CommentList
                  data={data.dataset.comments}
                  createComment={data => createComment(key, data)}
                  deleteComment={itemKey => deleteComment(key, itemKey)}
                  user={user}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/constituents`} render={() =>
                <ConstituentsDataset datasetKey={key}/>
              }/>

              <Route component={NotFound}/>
            </Switch>
          </DatasetMenu>
        )}
        />}

        {loading && <Spin size="large"/>}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withRouter(Dataset));