import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';

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
import { ItemMenu } from '../widgets';
import CollectionDetails from './Details';
import { ContactList, IdentifierList, TagList } from '../common';
import Exception404 from '../exception/404';
import MenuConfig from './menu.config';
import withContext from '../hoc/withContext';
import BreadCrumbs from '../widgets/BreadCrumbs';
import { getSubMenu } from '../../api/util/helpers';

class Collection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: null,
      counts: {}
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
    const listName = intl.formatMessage({ id: 'collections', defaultMessage: 'Collections' });
    const title = data ?
      data.name :
      intl.formatMessage({ id: 'newCollection', defaultMessage: 'New collection' });
    const submenu = getSubMenu(this.props);

    return (
      <DocumentTitle
        title={
          data || loading ?
            intl.formatMessage({ id: 'title.collection', defaultMessage: 'Collection | GBIF Registry' }) :
            intl.formatMessage({ id: 'title.newCollection', defaultMessage: 'New collection | GBIF Registry' })
        }
      >
        <React.Fragment>
          {!loading && <BreadCrumbs listType={[listName]} title={title} submenu={submenu}/>}

          {!loading && <Route path="/:type?/:key?/:section?" render={() => (
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
                    data={data}
                    createContact={data => createContact(key, data)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={itemKey => deleteContact(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    data={data}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    data={data}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    update={this.updateCounts}
                  />
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

export default withContext(mapContextToProps)(withRouter(injectIntl(Collection)));