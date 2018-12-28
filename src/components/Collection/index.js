import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';

// APIs
import {
  getCollectionOverview,
  updateContact,
  deleteContact,
  createContact,
  createIdentifier,
  deleteIdentifier,
  createTag,
  deleteTag
} from '../../api/grbio.collection';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import PageWrapper from '../hoc/PageWrapper';
import withContext from '../hoc/withContext';
// Components
import { ItemMenu, ItemHeader } from '../widgets';
import CollectionDetails from './Details';
import { ContactList, IdentifierList, TagList } from '../common';
import Exception404 from '../exception/404';
// Helpers
import { getSubMenu } from '../helpers';

class Collection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: null,
      counts: {},
      status: 200
    };
  }

  componentDidMount() {
    if (this.props.match.params.key) {
      this.getData();
    } else {
      this.setState({
        data: null,
        loading: false
      });
    }
  }

  getData() {
    this.setState({ loading: true });

    getCollectionOverview(this.props.match.params.key).then(data => {

      this.setState({
        data,
        loading: false,
        counts: {
          contacts: data.contacts.length,
          identifiers: data.identifiers.length,
          tags: data.tags.length
        }
      });
    }).catch(error => {
      if (error.response.status === 404 || error.response.status === 500) {
        this.setState({ status: error.response.status });
      } else {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      }
    }).finally(() => {
      this.setState({ loading: false });
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

  getTitle = () => {
    const { intl } = this.props;
    const { data, loading } = this.state;

    if (data) {
      return data.name;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newCollection', defaultMessage: 'New collection' });
    }

    return '';
  };

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { data, loading, counts, status } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'collections', defaultMessage: 'Collections' });
    const submenu = getSubMenu(this.props);
    const pageTitle = data || loading ?
      intl.formatMessage({ id: 'title.collection', defaultMessage: 'Collection | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newCollection', defaultMessage: 'New collection | GBIF Registry' });
    const title = this.getTitle();

    return (
      <React.Fragment>
        <ItemHeader listType={[listName]} title={title} submenu={submenu} pageTitle={pageTitle} loading={loading}/>

        <PageWrapper status={status} loading={loading}>
          <Route path="/:parent?/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={data === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <CollectionDetails
                    collection={data}
                    refresh={key => this.refresh(key)}
                  />
                }/>

                <Route path={`${match.path}/contact`} render={() =>
                  <ContactList
                    data={data.contacts}
                    uid={[]}
                    createContact={data => createContact(key, data)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={itemKey => deleteContact(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    data={data.identifiers}
                    uid={[]}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    data={data.tags}
                    uid={[]}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    update={this.updateCounts}
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