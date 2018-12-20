import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedDate, FormattedMessage, FormattedRelative } from 'react-intl';

import { PresentationItem } from '../../widgets';
import { prettifyLicense } from '../../helpers';
import { dateTimeFormat } from '../../../config/formats';
import { Badge } from 'antd';

class DatasetPresentation extends Component {
  render() {
    const { dataset } = this.props;
    return (
      <div>
        {dataset &&
        <dl>
          <PresentationItem label={<FormattedMessage id="title" defaultMessage="Title"/>}>
            {dataset.title}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="datasetType" defaultMessage="Dataset type"/>}>
            {dataset.type}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="datasetSubtype" defaultMessage="Dataset subtype"/>}>
            {dataset.subtype}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="doi" defaultMessage="Digital Object Identifier"/>}>
            {dataset.doi}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="isExternal" defaultMessage="Is external?"/>}>
            <Badge status={dataset.external ? 'success' : 'error'} text={`${dataset.external}`} />
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="datasetLicense" defaultMessage="Dataset license"/>}>
            {prettifyLicense(dataset.license)}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="lockedForAutoUpdate" defaultMessage="Is locked for auto updating"/>}>
            <Badge status={dataset.lockedForAutoUpdate ? 'success' : 'error'} text={`${dataset.lockedForAutoUpdate}`} />
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            {dataset.description}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="publishingOrganization" defaultMessage="Publishing organization"/>}>
            <NavLink to={`/organization/${dataset.publishingOrganizationKey}`}>
              {dataset.publishingOrganization.title}
            </NavLink>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="servingInstallation" defaultMessage="Serving installation"/>}>
            <NavLink to={`/installation/${dataset.installationKey}`}>
              {dataset.installation.title}
            </NavLink>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            <a href={dataset.homepage} target="_blank" rel="noopener noreferrer">{dataset.homepage}</a>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>}>
            {dataset.logoUrl}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="language" defaultMessage="Language"/>}>
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
        }
      </div>
    );
  }
}

export default DatasetPresentation;