import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { PresentationItem } from '../../../../common';
import MetaData from '../../../../common/MetaData';

const ConceptPresentation = ({ concept }) => (
  <div>
    {concept ?
      <React.Fragment>
        <dl>
          <PresentationItem
            label={<FormattedMessage id="name" defaultMessage="Name"/>}
            helpText={
              <FormattedMessage
                id="help.conceptName"
                defaultMessage="Enter an accurate concept name as it is used in many key places."
              />
            }
            required
          >
            {concept.name}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="namespace" defaultMessage="Namespace"/>}>
            {concept.namespace}
          </PresentationItem>
          
        </dl>
        <MetaData item={concept} />
      </React.Fragment>
      : null}
  </div>
);

ConceptPresentation.propTypes = {
  concept: PropTypes.object
};

export default ConceptPresentation;