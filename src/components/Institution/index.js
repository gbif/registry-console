import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';

// APIs
import {
  getInstitutionOverview,
  addContact,
  deleteContact,
  createIdentifier,
  deleteIdentifier,
  createTag,
  deleteTag
} from '../../api/grbio.institution';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import withContext from '../hoc/withContext';
import PageWrapper from '../hoc/PageWrapper';
// Components
import { ItemHeader, ItemMenu } from '../widgets';
import InstitutionDetails from './Details';
import { PersonList, IdentifierList, TagList } from '../common';
import Exception404 from '../exception/404';
import { Collections } from './institutionSubtypes';
// Helpers
import { getSubMenu } from '../helpers';

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

    getInstitutionOverview(this.props.match.params.key).then(data => {
      // If user lives the page, request will return result anyway and tries to set in to a state
      // which will cause an error
      if (this._isMount) {
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

    if (data && data.institution) {
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
      <React.Fragment>
        <ItemHeader
          listType={[listName]}
          title={title}
          submenu={submenu}
          pageTitle={pageTitle}
          status={status}
          loading={loading}
        />

        <PageWrapper status={status} loading={loading}>
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
                  <PersonList
                    persons={data.institution.contacts}
                    uuids={[]}
                    addPerson={data => addContact(key, data)}
                    deletePerson={itemKey => deleteContact(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    identifiers={data.institution.identifiers}
                    uuids={[]}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    tags={data.institution.tags}
                    uuids={[]}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    updateCounts={this.updateCounts}
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
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(Institution)));