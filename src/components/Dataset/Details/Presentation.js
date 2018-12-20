import React from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedDate, FormattedMessage, FormattedRelative } from 'react-intl';
import { Badge } from 'antd';
import injectSheet from 'react-jss';

import { PresentationItem } from '../../widgets';
import { prettifyLicense } from '../../helpers';
import { dateTimeFormat } from '../../../config/config';

const styles = {
  modalPresentation: {
    paddingTop: '4px',
    '& .ant-row > div': {
      marginBottom: '15px',
    }
  }
};

const DatasetPresentation = ({ dataset, classes }) => (
  <div>
    {dataset && (
      <dl className={classes.modalPresentation}>
        <PresentationItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
          <FormattedMessage id={dataset.type}/>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="subtype" defaultMessage="Subtype"/>}>
          {dataset.subtype}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="external" defaultMessage="External?"/>}>
          <Badge status={dataset.external ? 'success' : 'error'} text={`${dataset.external}`}/>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="license" defaultMessage="License"/>} required>
          {prettifyLicense(dataset.license)}
        </PresentationItem>
        <PresentationItem
          label={<FormattedMessage id="lockAutoUpdates" defaultMessage="Lock auto updates"/>}>
          <Badge status={dataset.lockedForAutoUpdate ? 'success' : 'error'} text={`${dataset.lockedForAutoUpdate}`}/>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="title" defaultMessage="Title"/>} required>
          {dataset.title}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="doi" defaultMessage="Digital Object Identifier"/>} required>
          {dataset.doi}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
          {dataset.description}
        </PresentationItem>
        <PresentationItem
          label={<FormattedMessage id="publishingOrganization" defaultMessage="Publishing organization"/>} required>
          <NavLink to={`/organization/${dataset.publishingOrganizationKey}`}>
            {dataset.publishingOrganization.title}
          </NavLink>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="installation" defaultMessage="Installation"/>} required>
          <NavLink to={`/installation/${dataset.installationKey}`}>
            {dataset.installation.title}
          </NavLink>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="parentDataset" defaultMessage="Parent dataset"/>}>
          {dataset.parentDataset && (
            <NavLink to={`/dataset/${dataset.parentDatasetKey}`}>
              {dataset.parentDataset.title}
            </NavLink>
          )}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="duplicateDataset" defaultMessage="Duplicate dataset"/>}>
          {dataset.duplicateDataset && (
            <NavLink to={`/dataset/${dataset.duplicateDatasetKey}`}>
              {dataset.duplicateDataset.title}
            </NavLink>
          )}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
          <a href={dataset.homepage} target="_blank" rel="noopener noreferrer">{dataset.homepage}</a>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>}>
          {dataset.logoUrl}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="language" defaultMessage="Language"/>} required>
          {dataset.language}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="updateFrequency" defaultMessage="Update frequency"/>}>
          {dataset.maintenanceUpdateFrequency}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="alias" defaultMessage="Alias"/>}>
          {dataset.alias}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="abbreviation" defaultMessage="Abbreviation"/>}>
          {dataset.abbreviation}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="citation" defaultMessage="Citation"/>}>
          {dataset.citation.text}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="citationIdentifier" defaultMessage="Citation identifier"/>}>
          {dataset.citation.identifier}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="rights" defaultMessage="Rights"/>}>
          {dataset.rights}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="created" defaultMessage="Created"/>}>
          <FormattedRelative value={dataset.created}/>
          <FormattedDate value={dataset.created} {...dateTimeFormat}/>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="createdBy" defaultMessage="Created by"/>}>
          {dataset.createdBy}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="modified" defaultMessage="Modified"/>}>
          <FormattedRelative value={dataset.modified}/>
          <FormattedDate value={dataset.modified} {...dateTimeFormat}/>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="modifiedBy" defaultMessage="Modified by"/>}>
          {dataset.modifiedBy}
        </PresentationItem>
      </dl>
    )}
  </div>
);

export default injectSheet(styles)(DatasetPresentation);