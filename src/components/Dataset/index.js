import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';

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
import ItemMenu from '../widgets/ItemMenu';
import Exception404 from '../Exception/404';
import DatasetDetails from './Details';
import { ContactList, EndpointList, IdentifierList, TagList, MachineTagList, CommentList } from '../common';
import ConstituentsDataset from './ConstituentsDataset';
import withCommonItemMethods from '../hoc/withCommonItemMethods';
import MenuConfig from './MenuConfig';

//load dataset and provide via props to children. load based on route key.
//provide children with way to update root.

class Dataset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: null,
      counts: {}
    };
  }

  componentWillMount() {
    if (this.props.match.params.key) {
      this.getData();
    } else {
      this.setState({ loading: false });
    }
  }

  getData() {
    this.setState({ loading: true });

    getDatasetOverview(this.props.match.params.key).then(data => {
      this.setState({
        data,
        loading: false,
        counts: {
          contacts: data.dataset.contacts.length,
          endpoints: data.dataset.endpoints.length,
          identifiers: data.dataset.identifiers.length,
          tags: data.dataset.tags.length,
          machineTags: data.dataset.machineTags.length,
          comments: data.dataset.comments.length,
          constituents: data.constituents.count
        }
      });
    }).catch(() => {
      this.props.showNotification(
        'error',
        this.props.intl.formatMessage({ id: 'error.message', defaultMessage: 'Error' }),
        this.props.intl.formatMessage({
          id: 'error.description',
          defaultMessage: 'Something went wrong. Please, keep calm and repeat your action again.'
        })
      );
    });
  }

  refresh = key => {
    if (key) {
      this.props.history.push(key);
    } else {
      this.getData();
    }
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
    const { match, intl } = this.props;
    const key = match.params.key;
    const { data, loading, counts } = this.state;

    return (
      <React.Fragment>
        <DocumentTitle
          title={
            data || loading ?
              intl.formatMessage({ id: 'title.dataset', defaultMessage: 'Dataset | GBIF Registry' }) :
              intl.formatMessage({ id: 'title.newDataset', defaultMessage: 'New dataset | GBIF Registry' })
          }
        >
          {!loading && <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={data === null}>
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
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    data={data.dataset.endpoints}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    data={data.dataset.identifiers}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    data={data.dataset.tags}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    data={data.dataset.machineTags}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/comment`} render={() =>
                  <CommentList
                    data={data.dataset.comments}
                    createComment={data => createComment(key, data)}
                    deleteComment={itemKey => deleteComment(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/constituents`} render={() =>
                  <ConstituentsDataset datasetKey={key}/>
                }/>

                <Route component={Exception404}/>
              </Switch>
            </ItemMenu>
          )}
          />}
        </DocumentTitle>

        {loading && <Spin size="large"/>}
      </React.Fragment>
    );
  }
}

export default withRouter(withCommonItemMethods(injectIntl(Dataset)));