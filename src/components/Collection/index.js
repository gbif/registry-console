import React, { Component, useState, useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

// APIs
import {
  getCollectionOverview,
  getCollection,
  addContact,
  deleteContact,
  createIdentifier,
  deleteIdentifier,
  createTag,
  deleteTag,
  createMachineTag,
  deleteMachineTag,
} from '../../api/collection';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import PageWrapper from '../hoc/PageWrapper';
import withContext from '../hoc/withContext';
// Components
import { ItemMenu, ItemHeader, CreationFeedback } from '../common';
import CollectionDetails from './Details';
import { PersonList, IdentifierList, TagList, MachineTagList } from '../common/subtypes';
import Exception404 from '../exception/404';
import Actions from './collection.actions';
// Helpers
import { getSubMenu } from '../util/helpers';
import { roles } from '../auth/enums';

class Collection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      collection: null,
      counts: {},
      status: 200,
      isNew: false
    };
  }

  componentDidMount() {
    this.checkRouterState();
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    if (this.props.match.params.key) {
      this.getData();
    } else {
      this.setState({
        data: null,
        loading: false
      });
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getData() {
    this.setState({ loading: true });

    getCollectionOverview(this.props.match.params.key).then(data => {
      // If user lives the page, request will return result anyway and tries to set in to a state
      // which will cause an error
      if (this._isMount) {
        this.setState({
          collection: data,
          loading: false,
          counts: {
            contacts: data.contacts.length,
            identifiers: data.identifiers.length,
            tags: data.tags.length,
            machineTags: data.machineTags.length,
          }
        });
      }
    }).catch(error => {
      // Important for us due to the case of requests cancellation on unmount
      // Because in that case the request will be marked as cancelled=failed
      // and catch statement will try to update a state of unmounted component
      // which will throw an exception
      if (this._isMount) {
        this.setState({ status: error.response.status, loading: false });
        if (![404, 500, 523].includes(error.response.status)) {
          this.props.addError({ status: error.response.status, statusText: error.response.data });
        }
      }
    });
  }

  refresh = key => {
    if (key) {
      this.props.history.push(key, { isNew: true });
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

  update(error) {
    // If component was unmounted interrupting changes
    if (!this._isMount) {
      return;
    }

    if (error) {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
      return;
    }

    this.getData();
  }

  checkRouterState() {
    const { history } = this.props;
    // If we set router state previously, we'll update component's state and reset router's state
    if (history.location && history.location.state && history.location.state.isNew) {
      this.setState({ isNew: true });
      const state = { ...history.location.state };
      delete state.isNew;
      history.replace({ ...history.location, state });
    }
  }

  getTitle = () => {
    const { intl } = this.props;
    const { collection, loading } = this.state;

    if (collection) {
      return collection.name;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newCollection', defaultMessage: 'New collection' });
    }

    return '';
  };

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { collection, loading, counts, status, isNew } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'collections', defaultMessage: 'Collections' });
    const submenu = getSubMenu(this.props);
    const pageTitle = collection || loading ?
      intl.formatMessage({ id: 'title.collection', defaultMessage: 'Collection | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newCollection', defaultMessage: 'New collection | GBIF Registry' });
    const title = this.getTitle();

    return (
      <React.Fragment>
        <ItemHeader
          listType={[listName]}
          title={title}
          submenu={submenu}
          pageTitle={pageTitle}
          status={status}
          loading={loading}
          usePaperWidth
        >
          {collection && (
            <Actions collection={collection} onChange={error => this.update(error)}/>
          )}
        </ItemHeader>

        {isNew && !loading && (
          <CreationFeedback
            title={<FormattedMessage
              id="beenCreated.collection.title"
              defaultMessage="Collection has been created successfully!"
            />}
          />
        )}

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={collection === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <CollectionDetails
                    collection={collection}
                    refresh={key => this.refresh(key)}
                  />
                }/>

                <Route path={`${match.path}/contact`} render={() =>
                  <PersonList
                    persons={collection.contacts}
                    permissions={{roles: [roles.GRSCICOLL_ADMIN]}}
                    addPerson={data => addContact(key, data)}
                    deletePerson={itemKey => deleteContact(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    identifiers={collection.identifiers}
                    permissions={{roles: [roles.GRSCICOLL_ADMIN]}}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    tags={collection.tags}
                    permissions={{roles: [roles.GRSCICOLL_ADMIN]}}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                    <MachineTagList
                    machineTags={collection.machineTags}
                    permissions={{roles: [roles.GRSCICOLL_ADMIN]}}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route component={Exception404}/>
              </Switch>
            </ItemMenu>
          )}
          />
        </PageWrapper>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(Collection)));

export function CollectionLink({uuid, ...props}) {
  const [collection, setCollection] = useState(uuid);

  useEffect(() => {
    const fetchData = async () => {
        const response = await getCollection(uuid);
        setCollection(response.data);
    };

   fetchData();
  }, [uuid])

  return <a href={`/collection/${uuid}`} {...props}>{collection.name || uuid}</a>
}