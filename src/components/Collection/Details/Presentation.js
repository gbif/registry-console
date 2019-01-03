import React from 'react';
import { FormattedMessage, FormattedDate, FormattedRelative } from 'react-intl';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import ShowMoreText from 'react-show-more-text';

// Configuration
import { dateTimeFormat } from '../../../config/config';
// Components
import { PresentationItem, BooleanValue } from '../../widgets';

const CollectionPresentation = ({ collection }) => (
  <div>
    {collection ? (
      <React.Fragment>
        <dl>
          <PresentationItem label={<FormattedMessage id="name" defaultMessage="Name"/>} required>
            {collection.name}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            {collection.description && (
              <ShowMoreText
                lines={5}
                more={<FormattedMessage id="button.showMore" defaultMessage="Show more"/>}
                less={<FormattedMessage id="button.showLess" defaultMessage="Show less"/>}
              >
                {collection.description}
              </ShowMoreText>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="contentTypes" defaultMessage="Content Types"/>}>
            {collection.contentTypes && collection.contentTypes.map(type =>
              <FormattedMessage key={type} id={`collectionContentType.${type}`}/>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="code" defaultMessage="Code"/>}>
            {collection.code}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            {collection.homepage && (
              <a href={collection.homepage} target="_blank" rel="noopener noreferrer">{collection.homepage}</a>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="catalogUrl" defaultMessage="Catalog URL"/>}>
            {collection.catalogUrl && (
              <a href={collection.catalogUrl} target="_blank" rel="noopener noreferrer">{collection.catalogUrl}</a>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="apiUrl" defaultMessage="API URL"/>}>
            {collection.apiUrl && (
              <a href={collection.apiUrl} target="_blank" rel="noopener noreferrer">{collection.apiUrl}</a>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="institution" defaultMessage="Institution"/>} required>
            {collection.institution && (
              <NavLink to={`/grbio/institution/${collection.institutionKey}`}>
                {collection.institution.name}
              </NavLink>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="preservationType" defaultMessage="Preservation type"/>}>
            {collection.preservationType && <FormattedMessage id={`preservationType.${collection.preservationType}`}/>}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="accessionStatus" defaultMessage="Accession status"/>}>
            {collection.accessionStatus && <FormattedMessage id={`accessionStatus.${collection.accessionStatus}`}/>}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="active" defaultMessage="Active"/>}>
            <BooleanValue value={collection.active}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="personalCollection" defaultMessage="Personal collection"/>}>
            <BooleanValue value={collection.personalCollection}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="doi" defaultMessage="Digital Object Identifier"/>} required>
            {collection.doi}
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

CollectionPresentation.propTypes = {
  collection: PropTypes.object.isRequired
};

export default CollectionPresentation;