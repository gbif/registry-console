import React, { Component } from 'react';
import { ThemeProvider } from 'react-jss';
import { Route, Switch } from 'react-router-dom';
// translation of the Antd components - not all languages supported. to support more do pull requests for antd
import { LocaleProvider } from 'antd';
// load the locales needed - notice that this is only for formatting.
// The messages need of course to be loaded as well. These are placed in the public folder and loaded on demand.
// English is default and should have its own file so that it isn't in code only (as defaultMessage)
import { IntlProvider, addLocaleData } from 'react-intl';
import da from 'react-intl/locale-data/da';
import en from 'react-intl/locale-data/en';
import kk from 'react-intl/locale-data/kk';
import DocumentTitle from 'react-document-title';

import {
  DatasetSearch,
  DatasetDeleted,
  DatasetDuplicate,
  DatasetConstituent,
  DatasetWithNoEndpoint
} from './search/datasetSearch';
import {
  OrganizationSearch,
  OrganizationDeleted,
  OrganizationNonPublishing,
  OrganizationPending
} from './search/organizationSearch';
import { InstallationSearch, InstallationDeleted, InstallationNonPublishing } from './search/installationSearch';
import { CollectionSearch, InstitutionSearch, PersonSearch } from './search/grbio';
import { NodeSearch } from './search/nodeSearch';
import { UserSearch } from './search/userSearch';

import Home from './Home';
import Organization from './Organization';
import Dataset from './Dataset';
import Installation from './Installation';
import NodeItem from './Node';
import User from './User';
import Exception404 from './exception/404';

import Layout from './Layout';

import BlockingLoader from './BlockingLoader';
import './App.css';

import AuthRoute from './AuthRoute';
import withContext from './hoc/withContext';
import Notifications from './Notifications';
import Collection from './Collection';

addLocaleData([...da, ...en, ...kk]);

const theme = {
  colorPrimary: 'deepskyblue'
};

class App extends Component {

  render() {
    const messages = this.props.locale.messages;
    const defaultTitle = messages && messages.orgName;

    return (
      <IntlProvider locale={this.props.locale.locale} messages={this.props.locale.messages}>
        <LocaleProvider locale={this.props.locale.antLocale}>
          <ThemeProvider theme={theme}>

            <React.Fragment>
              {this.props.locale.loading && <BlockingLoader/>}
              <Notifications/>
              <Layout>
                <DocumentTitle title={defaultTitle || 'GBIF Registry'}>
                  <Switch>
                    <Route exact path="/" component={Home}/>

                    <Route exact path="/organization/search" component={OrganizationSearch}/>
                    <Route exact path="/organization/deleted" component={OrganizationDeleted}/>
                    <Route exact path="/organization/pending" component={OrganizationPending}/>
                    <Route exact path="/organization/nonPublishing" component={OrganizationNonPublishing}/>
                    <AuthRoute
                      exact
                      path="/organization/create"
                      key="createOrganization"
                      component={Organization}
                      type={'organization'}
                      roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}
                    />
                    <Route path="/organization/:key" key="overviewOrganization" component={Organization}/>

                    <Route exact path="/dataset/search" component={DatasetSearch}/>
                    <Route exact path="/dataset/deleted" component={DatasetDeleted}/>
                    <Route exact path="/dataset/duplicate" component={DatasetDuplicate}/>
                    <Route exact path="/dataset/constituent" component={DatasetConstituent}/>
                    <Route exact path="/dataset/withNoEndpoint" component={DatasetWithNoEndpoint}/>
                    <AuthRoute
                      exact
                      path="/dataset/create"
                      key="createDataset"
                      component={Dataset}
                      type={'dataset'}
                      roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}
                    />
                    <Route path="/dataset/:key" key="overviewDataset" component={Dataset}/>

                    <Route exact path="/installation/search" component={InstallationSearch}/>
                    <Route exact path="/installation/deleted" component={InstallationDeleted}/>
                    <Route exact path="/installation/nonPublishing" component={InstallationNonPublishing}/>
                    <AuthRoute
                      exact
                      path="/installation/create"
                      key="createInstallation"
                      component={Installation}
                      type={'installation'}
                      roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}
                    />
                    <Route path="/installation/:key" key="overviewInstallation" component={Installation}/>

                    <Route exact path="/grbio/collection/search" component={CollectionSearch}/>
                    <AuthRoute
                      exact
                      path="/grbio/collection/create"
                      key="CollectionDetails"
                      component={Collection}
                      type={'collection'}
                      roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}
                    />
                    {/*<Route exact path="/grbio/collection/create" key="createCollection" component={Collection}/>*/}
                    <Route exact path="/grbio/collection/:key" key="overviewCollection" component={Collection}/>

                    <Route exact path="/grbio/institution/search" component={InstitutionSearch}/>
                    <Route exact path="/grbio/person/search" component={PersonSearch}/>

                    <Route exact path="/node/search" component={NodeSearch}/>
                    <Route path="/node/create" component={Exception404}/>
                    <Route path="/node/:key" key="overviewNode" component={NodeItem}/>

                    <AuthRoute exact path="/user/search" component={UserSearch} roles={['REGISTRY_ADMIN']}/>
                    <AuthRoute path="/user/:key" component={User} roles={['REGISTRY_ADMIN']}/>

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

const mapContextToProps = ({ locale }) => ({ locale });

export default withContext(mapContextToProps)(App);