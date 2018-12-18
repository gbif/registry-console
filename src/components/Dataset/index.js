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
  createIdentifier,
  createMachineTag,
  createTag,
  deleteComment,
  deleteEndpoint,
  deleteIdentifier,
  deleteMachineTag,
  deleteTag
} from '../../api/dataset';
import { ItemMenu } from '../widgets';
import Exception404 from '../exception/404';
import DatasetDetails from './Details';
import { ContactList, EndpointList, IdentifierList, TagList, MachineTagList, CommentList } from '../common';
import ConstituentsDataset from './ConstituentsDataset';
import MenuConfig from './MenuConfig';
import withContext from '../hoc/withContext';
import { BreadCrumbs } from '../widgets';
import { getSubMenu } from '../../api/util/helpers';

//load dataset and provide via props to children. load based on route key.
//provide children with way to update root.

class Dataset extends React.Component {
  state = {
    loading: true,
    data: null,
    counts: {}
  };

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
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
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
    const listName = intl.formatMessage({ id: 'datasets', defaultMessage: 'Datasets' });
    const title = data ? data.dataset.title : intl.formatMessage({ id: 'newDataset', defaultMessage: 'New dataset' });
    const submenu = getSubMenu(this.props);

    return (
      <DocumentTitle
        title={
          data || loading ?
            intl.formatMessage({ id: 'title.dataset', defaultMessage: 'Dataset | GBIF Registry' }) :
            intl.formatMessage({ id: 'title.newDataset', defaultMessage: 'New dataset | GBIF Registry' })
        }
      >
        <React.Fragment>
          {!loading && <BreadCrumbs listType={[listName]} title={title} submenu={submenu}/>}

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
                    title={data.dataset.title}
                  />
                }/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    data={data.dataset.endpoints}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    update={this.updateCounts}
                    title={data.dataset.title}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    data={data.dataset.identifiers}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    update={this.updateCounts}
                    title={data.dataset.title}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    data={data.dataset.tags}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    update={this.updateCounts}
                    title={data.dataset.title}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    data={data.dataset.machineTags}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    update={this.updateCounts}
                    title={data.dataset.title}
                  />
                }/>

                <Route path={`${match.path}/comment`} render={() =>
                  <CommentList
                    data={data.dataset.comments}
                    createComment={data => createComment(key, data)}
                    deleteComment={itemKey => deleteComment(key, itemKey)}
                    update={this.updateCounts}
                    title={data.dataset.title}
                  />
                }/>

                <Route path={`${match.path}/constituents`} render={() =>
                  <ConstituentsDataset datasetKey={key} title={data.dataset.title}/>
                }/>

                <Route component={Exception404}/>
              </Switch>
            </ItemMenu>
          )}
          />}

          {loading && <Spin size="large"/>}
        </React.Fragment>
      </DocumentTitle>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(Dataset)));