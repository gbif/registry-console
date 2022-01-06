import React, { Component } from 'react';
import { ThemeProvider } from 'react-jss';
import { Route, Switch } from 'react-router-dom';
// translation of the Antd components - not all languages supported. to support more do pull requests for antd
import { LocaleProvider } from 'antd';
// load the locales needed - notice that this is only for formatting.
// The messages need of course to be loaded as well. These are placed in the public folder and loaded on demand.
// English is default and should have its own file so that it isn't in code only (as defaultMessage)
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import DocumentTitle from 'react-document-title';

import { JWT_STORAGE_NAME } from '../api/util/axiosInstanceWithCredentials';

import { OrganizationSearch } from './search/organizationSearch';
import { DatasetSearch } from './search/datasetSearch';
import { NetworkSearch } from './search/networkSearch';
import { InstallationSearch } from './search/installationSearch';
import { CollectionSearch } from './search/collectionSearch';
import { InstitutionSearch } from './search/institutionSearch';
import { InstitutionSuggestionSearch } from './search/institutionSuggestionSearch';
import { CollectionSuggestionSearch } from './search/collectionSuggestionSearch';
import { NodeSearch } from './search/nodeSearch';
import { UserSearch } from './search/userSearch';
import { VocabularySearch } from './search/vocabularySearch';
import VocabularyTags from './Vocabulary/Tags'
import { OverIngested, RunningCrawls, RunningIngestions, IngestionHistory } from './monitoring';

import Home from './Home';
import Organization from './Organization';
import Dataset from './Dataset';
import Network from './Network';
import Installation from './Installation';
import NodeItem from './Node';
import User from './User';
import UserProfile from './User/UserProfile';
import Vocabulary from './Vocabulary';
import Concept from './Vocabulary/subtypes/Concept';
import Exception404 from './exception/404';

import Layout from './Layout';

import BlockingLoader from './BlockingLoader';
import './App.css';

import { AuthRoute } from './auth';
import { roles } from './auth';

import withContext from './hoc/withContext';
import Notifications from './Notifications';
import Collection from './Collection';
import Institution from './Institution';
import { getCookie } from './util/helpers';

import { canCreate } from '../api/permissions';

addLocaleData(en);

// Exporting other languages that we potentially have in the app to be able to lazy load them
export const languages = {
  da: import('react-intl/locale-data/da'),
  kk: import('react-intl/locale-data/kk'),
  he: import('react-intl/locale-data/he'),
  fr: import('react-intl/locale-data/fr'),
  es: import('react-intl/locale-data/es'),
};

const theme = {
  paperWidth: '1800px'
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const jwt = getCookie(JWT_STORAGE_NAME);
    // Every time there is an update in APP we should check if the session cookie is still exist
    // If the cookie was removed in another tab but user still exist, we should log user out
    // to avoid showing restricted pages
    if (!jwt && this.props.user) {
      this.props.logout();
    }
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    this.getPermissions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.getPermissions();
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getPermissions = async () => {
    this.setState({ loadingPermissions: true });
    const canCreateOrganization = await canCreate('organization');
    const canCreateDataset = await canCreate('dataset');
    const canCreateInstallation = await canCreate('installation');
    const canCreateNetwork = await canCreate('network');
    const canCreateCollection = await canCreate('grscicoll/collection');
    const canCreateInstitution = await canCreate('grscicoll/institution');
    const canCreateStaff = await canCreate('grscicoll/person');
    if (this._isMount) {
      // update state
      this.setState({ canCreateStaff, canCreateCollection, canCreateInstitution, canCreateNetwork, canCreateOrganization, canCreateDataset, canCreateInstallation });
    };
    //else the component is unmounted and no updates should be made
  }

  render() {
    const { isRTL, locale } = this.props;
    theme.direction = isRTL ? 'rtl' : 'ltr';

    return (
      <IntlProvider locale={locale.locale || 'en'} messages={locale.messages}>
        <LocaleProvider locale={locale.antLocale}>
          <ThemeProvider theme={theme}>

            <React.Fragment>
              {locale.loading && <BlockingLoader/>}
              <Notifications/>
              <Layout>
                <DocumentTitle title={'GBIF Registry'}>
                  <Switch>
                    <Route exact path="/" component={Home}/>

                    <Route exact path="/organization/search" component={OrganizationSearch}/>
                    <AuthRoute
                      exact
                      path="/organization/create"
                      key="createOrganization"
                      component={Organization}
                      hasAccess={this.state.canCreateOrganization}
                    />
                    <Route
                      path="/organization/:key"
                      render={props => <Organization key={props.match.params.key} {...props}/>}
                    />

                    <Route exact path="/dataset/search" component={DatasetSearch}/>
                    <AuthRoute
                      exact
                      path="/dataset/create"
                      key="createDataset"
                      component={Dataset}
                      hasAccess={this.state.canCreateDataset}
                    />
                    <Route path="/dataset/:key" render={props => <Dataset key={props.match.params.key} {...props}/>}/>

                    <Route exact path="/network/search" component={NetworkSearch}/>
                    <AuthRoute
                      exact
                      path="/network/create"
                      key="createNetwork"
                      component={Network}
                      hasAccess={this.state.canCreateNetwork}
                    />
                    <Route path="/network/:key" key="overviewNetwork" component={Network}/>

                    <Route exact path="/installation/search" component={InstallationSearch}/>
                    <AuthRoute
                      exact
                      path="/installation/create"
                      key="createInstallation"
                      component={Installation}
                      hasAccess={this.state.canCreateInstallation}
                    />
                    <Route
                      path="/installation/:key"
                      render={props => <Installation key={props.match.params.key} {...props}/>}
                    />

                    <Route exact path="/collection/search" component={CollectionSearch}/>
                    {/* <AuthRoute
                      exact
                      path="/collection/create"
                      key="createCollection"
                      component={Collection}
                      hasAccess={this.state.canCreateCollection}
                    /> */}
                    <Route
                      exact
                      path="/collection/create"
                      key="createCollection"
                      component={Collection}
                    />
                    <Route
                      path="/collection/:key"
                      render={props => <Collection key={props.match.params.key} {...props}/>}
                    />

                    <Route exact path="/institution/search" component={InstitutionSearch}/>
                    {/* <AuthRoute
                      exact
                      path="/institution/create"
                      key="createInstitution"
                      component={Institution}
                      hasAccess={this.state.canCreateInstitution}
                    /> */}
                    <Route
                      exact
                      path="/institution/create"
                      key="createInstitution"
                      component={Institution}
                    />
                    <Route
                      path="/institution/:key"
                      render={props => <Institution key={props.match.params.key} {...props}/>}
                    />

                    {/* 
                    Dissable the person routes as we do no longer support these, but has replaced them with contacts instead. See https://github.com/gbif/registry-console/issues/420
                    <Route exact path="/person/search" component={PersonSearch}/>
                    <AuthRoute
                      exact
                      path="/person/create"
                      key="createPerson"
                      component={Person}
                      hasAccess={this.state.canCreateStaff}
                    />
                    <Route path="/person/:key" render={props => <Person key={props.match.params.key} {...props}/>}/> */}

                    <Route exact path="/node/search" component={NodeSearch}/>
                    <Route path="/node/create" component={Exception404}/>
                    <Route path="/node/:key" render={props => <NodeItem key={props.match.params.key} {...props}/>}/>

                    <AuthRoute exact path="/user" component={UserSearch} roles={roles.REGISTRY_ADMIN}/>
                    <AuthRoute path="/user/:key" component={User} roles={roles.REGISTRY_ADMIN}/>
                    <AuthRoute path="/who-am-i" component={UserProfile} roles={roles.USER}/>
                    <Route exact path="/vocabulary/search" component={VocabularySearch} />
                    <Route exact path="/vocabularyTags" component={VocabularyTags} />
                    <AuthRoute
                      exact
                      path="/vocabulary/create"
                      key="createVocabulary"
                      component={Vocabulary}
                      roles={[roles.VOCABULARY_ADMIN]}
                    />
                    <Route exact path="/vocabulary/:key/concept/create" component={Concept} />
                    <Route exact path="/vocabulary/:key" component={Vocabulary} />
                    <Route exact path="/vocabulary/:key/concepts" component={Vocabulary} />
                    <Route exact path="/vocabulary/:key/:section/:subTypeKey/:subTypeSection?" component={Concept} />


                    <Route exact path="/monitoring/running-crawls" component={RunningCrawls}/>
                    <Route exact path="/monitoring/running-ingestions" component={RunningIngestions}/>
                    <Route exact path="/monitoring/ingestion-history" component={IngestionHistory}/>
                    <Route exact path="/monitoring/overingested" component={OverIngested}/>

                    <Route exact path="/suggestions/institutions" component={InstitutionSuggestionSearch}/>
                    <Route exact path="/suggestions/collections" component={CollectionSuggestionSearch}/>

                    <Route component={Exception404}/>
                  </Switch>
                </DocumentTitle>
              </Layout>
            </React.Fragment>
          </ThemeProvider>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}

const mapContextToProps = ({ locale, isRTL, user, logout }) => ({ locale, isRTL, user, logout });

export default withContext(mapContextToProps)(App);