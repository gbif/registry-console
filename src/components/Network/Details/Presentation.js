import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { PresentationItem } from '../../common';
import MetaData from '../../common/MetaData';

const NetworkPresentation = ({ network }) => (
  <div>
    {network ?
      <React.Fragment>
        <dl>
          <PresentationItem
            label={<FormattedMessage id="title" defaultMessage="Title"/>}
            helpText={
              <FormattedMessage
                id="help.networkTitle"
                defaultMessage="Enter an accurate network title as it is used in many key places."
              />
            }
            required
          >
            {network.title}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            {network.description}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="language" defaultMessage="Language"/>}>
            {network.language && <FormattedMessage id={`language.${network.language}`}/>}
          </PresentationItem>
        </dl>
        <MetaData item={network} />
      </React.Fragment>
      : null}
  </div>
);

NetworkPresentation.propTypes = {
  network: PropTypes.object
};

export default NetworkPresentation;