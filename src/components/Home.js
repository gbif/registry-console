import React from 'react';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';
import Dashboard from './Dashboard';

const Home = ({ intl }) => {
  return (
    <DocumentTitle title={intl.formatMessage({ id: 'title.dashboard', defaultMessage: 'Dashboard | GBIF Registry' })}>
      <React.Fragment>
        <Dashboard />
      </React.Fragment>
    </DocumentTitle>
  );
};

export default injectIntl(Home);