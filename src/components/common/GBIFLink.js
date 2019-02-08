import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';

// Configuration
import config from '../../api/util/config';

const GBIFLink = ({ link, uuid, tooltip, children, ...rest }) => {
  const getLink = () => (
    <a href={`${config.gbifUrl}/${link}/${uuid}`} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );

  return (
    tooltip ? (
      <Tooltip
        placement="top"
        title={<FormattedMessage id="viewOnGBIF" defaultMessage="View on GBIF.org"/>}
      >
        {getLink()}
      </Tooltip>
    ) : getLink()

  );
};

GBIFLink.propTypes = {
  link: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  tooltip: PropTypes.bool
};

export default GBIFLink;