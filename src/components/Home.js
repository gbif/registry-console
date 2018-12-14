import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';

const Home = ({ intl }) => {
  return (
    <DocumentTitle title={intl.formatMessage({ id: 'title.dashboard', defaultMessage: 'Dashboard | GBIF Registry' })}>
      <div style={{ padding: 24, background: 'white' }}>
        <h2><FormattedMessage id="welcome" defaultMessage="Dashboard"/></h2>
        <p>
          <FormattedMessage
            id="dashboard.message1"
            defaultMessage="What should the homepage show. Perhaps as the current links to search types. We could add recently visited resources."
          />
        </p>
        <p>
          <FormattedMessage
            id="dashboard.message2"
            defaultMessage="If logged in it could also show a dashboard: missing endorsements. failing dataset crawls."
          />
        </p>

      </div>
    </DocumentTitle>
  );
};

export default injectIntl(Home);