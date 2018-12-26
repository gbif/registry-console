import React from 'react';
import { FormattedMessage, FormattedDate, FormattedRelative } from 'react-intl';
import { NavLink } from 'react-router-dom';

import { dateTimeFormat } from '../../../config/config';
import { PresentationItem, BooleanValue } from '../../widgets';

const CollectionPresentation = ({ collection }) => (
  <div>
    {collection ? (
      <React.Fragment>
        <dl>
          <PresentationItem label={<FormattedMessage id="name" defaultMessage="Name"/>} required>
            {collection.name}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            {collection.homepage && (
              <a href={collection.homepage} target="_blank" rel="noopener noreferrer">{collection.homepage}</a>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="institution" defaultMessage="Institution"/>} required>
            <NavLink to={`/grbio/institution/${collection.institutionKey}`}>
              {collection.institution.name}
            </NavLink>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="accessionStatus" defaultMessage="Accession status"/>}>
            {collection.accessionStatus}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="active" defaultMessage="Active"/>}>
            <BooleanValue value={collection.active}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="code" defaultMessage="Code"/>}>
            {collection.code}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="created" defaultMessage="Created"/>}>
            <FormattedRelative value={collection.created}/>
            <FormattedDate value={collection.created} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="createdBy" defaultMessage="Created by"/>}>
            {collection.createdBy}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modified" defaultMessage="Modified"/>}>
            <FormattedRelative value={collection.modified}/>
            <FormattedDate value={collection.modified} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modifiedBy" defaultMessage="Modified by"/>}>
            {collection.modifiedBy}
          </PresentationItem>
        </dl>
      </React.Fragment>
    ) : null}
  </div>
);

export default CollectionPresentation;