import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import {
  getInstitutionOverview,
  updateContact,
  deleteContact,
  createContact,
  createIdentifier,
  deleteIdentifier,
  createTag,
  deleteTag
} from '../../api/grbio.institution';
import { ItemHeader, ItemMenu } from '../widgets';
import InstitutionDetails from './Details';
import { ContactList, IdentifierList, TagList } from '../common';
import Exception404 from '../exception/404';
import MenuConfig from './menu.config';
import { getSubMenu } from '../helpers';
import Collections from './Collections';
import withContext from '../hoc/withContext';
import PageWrapper from '../hoc/PageWrapper';

class Institution extends Component {
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

    getInstitutionOverview(this.props.match.params.key).then(data => {

      this.setState({
        data: data,
        loading: false,
        counts: {
          contacts: data.institution.contacts.length,
          identifiers: data.institution.identifiers.length,
          tags: data.institution.tags.length,
          collections: data.collections.count
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

    if (data && data) {
      return data.institution.name;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newInstitution', defaultMessage: 'New institution' });
    }

    return '';
  };

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { data, loading, counts, status } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'institutions', defaultMessage: 'Institutions' });
    const submenu = getSubMenu(this.props);
    const pageTitle = data || loading ?
      intl.formatMessage({ id: 'title.institution', defaultMessage: 'Institution | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newInstitution', defaultMessage: 'New institution | GBIF Registry' });
    const title = this.getTitle();

    return (
      <PageWrapper status={status} loading={loading}>
        <ItemHeader listType={[listName]} title={title} submenu={submenu} pageTitle={pageTitle}/>

        <Route path="/:parent?/:type?/:key?/:section?" render={() => (
          <ItemMenu counts={counts} config={MenuConfig} isNew={data === null}>
            <Switch>
              <Route exact path={`${match.path}`} render={() =>
                <InstitutionDetails
                  institution={data ? data.institution : null}
                  refresh={key => this.refresh(key)}
                />
              }/>

              <Route path={`${match.path}/contact`} render={() =>
                <ContactList
                  data={data.institution.contacts}
                  uid={[]}
                  createContact={data => createContact(key, data)}
                  updateContact={data => updateContact(key, data)}
                  deleteContact={itemKey => deleteContact(key, itemKey)}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/identifier`} render={() =>
                <IdentifierList
                  data={data.institution.identifiers}
                  uid={[]}
                  createIdentifier={data => createIdentifier(key, data)}
                  deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/tag`} render={() =>
                <TagList
                  data={data.institution.tags}
                  uid={[]}
                  createTag={data => createTag(key, data)}
                  deleteTag={itemKey => deleteTag(key, itemKey)}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/collection`} render={() =>
                <Collections institutionKey={match.params.key}/>
              }/>

              <Route component={Exception404}/>
            </Switch>
          </ItemMenu>
        )}
        />
      </PageWrapper>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(Institution)));