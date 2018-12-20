import React from 'react';
import { FormattedMessage, FormattedDate, FormattedRelative } from 'react-intl';
import injectSheet from 'react-jss';

import { dateTimeFormat } from '../../../config/config';
import { PresentationItem } from '../../widgets';

const styles = {
  modalPresentation: {
    paddingTop: '4px',
    '& .ant-row > div': {
      marginBottom: '15px',
    }
  }
};

const NodePresentation = ({ node, classes }) => (
  <div>
    {node ? (
      <React.Fragment>
        <p className="help">
          <FormattedMessage
            id="nodeOverviewInfo"
            defaultMessage="This information appears on the node profile, organization pages, search results, and beyond."
          />
        </p>
        <dl className={classes.modalPresentation}>
          <PresentationItem label={<FormattedMessage id="title" defaultMessage="Title"/>}>
            {node.title}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
            {node.type && <FormattedMessage id={`nodeType.${node.type}`}/>}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="participantStatus" defaultMessage="Participant status"/>}>
            {node.participationStatus && <FormattedMessage id={`participationStatus.${node.participationStatus}`}/>}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="gbifRegion" defaultMessage="GBIF Region"/>}>
            {node.gbifRegion && <FormattedMessage id={`region.${node.gbifRegion}`}/>}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
            {node.country && <FormattedMessage id={`country.${node.country}`}/>}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="continent" defaultMessage="Continent"/>}>
            {node.continent && <FormattedMessage id={`continent.${node.continent}`}/>}
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
    ) : null}
  </div>
);

export default injectSheet(styles)(NodePresentation);