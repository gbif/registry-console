import React from 'react';
import Exception from './Exception';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

const Exception404 = props => (
  <Exception
    type="404"
    desc={props.intl.formatMessage({ id: 'exception.description.404' })}
    linkElement={Link}
    backText={props.intl.formatMessage({ id: 'exception.back' })}
  />
);

export default injectIntl(Exception404);
