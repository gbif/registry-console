import React, { Component } from 'react'
import { ThemeProvider } from 'react-jss'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import { DatasetSearch, DatasetDeleted, DatasetDuplicate, DatasetWithNoEndpoint } from './search/datasetSearch'
import { OrganizationSearch, OrganizationDeleted, OrganizationNonPublishing } from './search/organizationSearch'
import { InstallationSearch, InstallationDeleted, InstallationNonPublishing } from './search/installationSearch'
import { CollectionSearch, InstitutionSearch, PersonSearch } from './search/grbio'
import { NodeSearch } from './search/nodeSearch'
import { UserSearch } from './search/userSearch'

import Home from './Home'
import Dataset from './Dataset'
import NotFound from './NotFound'

import Layout from './Layout'

import BlockingLoader from './BlockingLoader'
import Errors from './Errors'
import './App.css'

// translation of the Antd components - not all languages supported. to support more do pull requests for antd
import { LocaleProvider } from 'antd';

// load the locales needed - notice that this is only for formatting. 
// The messages need of course to be loaded as well. These are placed in the public folder and loaded on demand. 
// English is default and should have its own file so that it isn't in code only (as defaultMessage)
import { IntlProvider, addLocaleData } from 'react-intl'
import da from 'react-intl/locale-data/da'
import en from 'react-intl/locale-data/en'
import kk from 'react-intl/locale-data/kk'
addLocaleData([...da, ...en, ...kk])

const theme = {
  colorPrimary: 'deepskyblue'
}

class App extends Component {
  render() {
    return (
      <IntlProvider locale={this.props.locale.locale} messages={this.props.locale.messages}>
        <LocaleProvider locale={this.props.locale.antLocale}>
          <ThemeProvider theme={theme}>
            <React.Fragment>
              {this.props.locale.loading && <BlockingLoader />}
              <Errors />
              <Layout>
                <Switch>
                  <Route exact path="/" component={Home} />

                  <Route exact path="/organization/search" component={OrganizationSearch} />
                  <Route exact path="/organization/deleted" component={OrganizationDeleted} />
                  <Route exact path="/organization/nonPublishing" component={OrganizationNonPublishing} />

                  <Route exact path="/dataset/search" component={DatasetSearch} />
                  <Route exact path="/dataset/deleted" component={DatasetDeleted} />
                  <Route exact path="/dataset/duplicate" component={DatasetDuplicate} />
                  <Route exact path="/dataset/withNoEndpoint" component={DatasetWithNoEndpoint} />
                  <Route path="/dataset/:key" component={Dataset} />

                  <Route exact path="/installation/search" component={InstallationSearch} />
                  <Route exact path="/installation/deleted" component={InstallationDeleted} />
                  <Route exact path="/installation/nonPublishing" component={InstallationNonPublishing} />

                  <Route exact path="/grbio/collection/search" component={CollectionSearch} />
                  <Route exact path="/grbio/institution/search" component={InstitutionSearch} />
                  <Route exact path="/grbio/person/search" component={PersonSearch} />

                  <Route exact path="/node/search" component={NodeSearch} />
                  <Route exact path="/user/search" component={UserSearch} />

                  <Route component={NotFound} />
                </Switch>
              </Layout>
            </React.Fragment>
          </ThemeProvider>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}

const mapStateToProps = state => ({
  locale: state.locale
})

export default connect(mapStateToProps)(App);