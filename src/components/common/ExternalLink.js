import React from 'react';
import PropTypes from 'prop-types';

import { safeHref } from '../util/helpers';

/**
 * Link to a stored, external URL that opens in a new tab.
 * If the URL isn't a plain http(s) URL it is shown as text instead of a link.
 */
const ExternalLink = ({ url, children }) => {
  const href = safeHref(url);
  const content = children || url;
  if (!href) return <span>{content}</span>;
  return <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>;
};

ExternalLink.propTypes = {
  url: PropTypes.string,
  children: PropTypes.node
};

export default ExternalLink;
