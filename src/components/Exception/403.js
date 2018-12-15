import React from 'react';
import Exception from './Exception';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

const Exception403 = props => (
  <Exception
    type="403"
    desc={props.intl.formatMessage({ id: 'exception.description.403' })}
    linkElement={Link}
    backText={props.intl.formatMessage({ id: 'exception.back' })}
  />
);

export default injectIntl(Exception403);
