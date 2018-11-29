import React from 'react'
import { FormattedMessage } from 'react-intl'

const Home = () => {
  return (
    <div style={{ padding: 24, background: 'white' }}>
      <h2><FormattedMessage id="welcome" defaultMessage="Dashboard" /></h2>
      <p>
        What should the homepage show. Perhaps as the current links to search types. We could add recently visited resources.
      </p>
      <p>
        If logged in it could also show a dashboard: missing endorsements. failing dataset crawls.
      </p>

    </div>
  )
}

export default Home