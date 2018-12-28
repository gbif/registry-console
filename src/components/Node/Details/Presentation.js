import React from 'react';
import { FormattedMessage, FormattedDate, FormattedRelative } from 'react-intl';
import PropTypes from 'prop-types';

// Configuration
import { dateTimeFormat } from '../../../config/config';
// Components
import { PresentationItem } from '../../widgets';

const NodePresentation = ({ node }) => (
  <div>
    {node && (
      <React.Fragment>
        <dl>
          <PresentationItem
            label={<FormattedMessage id="title" defaultMessage="Title"/>}
            helpText={
              <FormattedMessage
                id="extra.nodeTitle"
                defaultMessage="Enter an accurate node title as it is used in many key places."
              />
            }
          >
            {node.title}
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="type" defaultMessage="Type"/>}
            helpText={
              <FormattedMessage
                id="extra.nodeType"
                defaultMessage="Please verify IMS is the same"
              />
            }
          >
            {node.type && <FormattedMessage id={`nodeType.${node.type}`}/>}
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="participantStatus" defaultMessage="Participant status"/>}
            helpText={
              <FormattedMessage
                id="extra.nodeStatus"
                defaultMessage="This is used for reporting purposes (e.g. occurrence counts in ad hoc reporting)"
              />
            }
          >
            {node.participationStatus && <FormattedMessage id={`participationStatus.${node.participationStatus}`}/>}
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="gbifRegion" defaultMessage="GBIF Region"/>}
            helpText={
              <FormattedMessage
                id="extra.nodeRegion"
                defaultMessage="This is used for reporting purposes"
              />
            }
          >
            {node.gbifRegion && <FormattedMessage id={`region.${node.gbifRegion}`}/>}
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="continent" defaultMessage="Continent"/>}
            helpText={
              <FormattedMessage
                id="extra.nodeContinent"
                defaultMessage="This is used for reporting purposes"
              />
            }
          >
            {node.continent && <FormattedMessage id={`continent.${node.continent}`}/>}
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="country" defaultMessage="Country"/>}
            helpText={
              <FormattedMessage
                id="extra.nodeCountry"
                defaultMessage="This is used for reporting purposes"
              />
            }
          >
            {node.country && <FormattedMessage id={`country.${node.country}`}/>}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="created" defaultMessage="Created"/>}>
            <FormattedRelative value={node.created}/>
            <FormattedDate value={node.created} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="createdBy" defaultMessage="Created by"/>}>
            {node.createdBy}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modified" defaultMessage="Modified"/>}>
            <FormattedRelative value={node.modified}/>
            <FormattedDate value={node.modified} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modifiedBy" defaultMessage="Modified by"/>}>
            {node.modifiedBy}
          </PresentationItem>
        </dl>
      </React.Fragment>
    )}
  </div>
);

NodePresentation.propTypes = {
  node: PropTypes.object.isRequired
};

export default NodePresentation;