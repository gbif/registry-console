import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import SimilarTag from '../../common/SimilarTag';

// Components
import { PresentationItem, BooleanValue, PresentationGroupHeader, ShowMoreContent } from '../../common';
import MetaData from '../../common/MetaData';
import { collectionSearch } from '../../../api/collection';

const CollectionPresentation = ({ collection }) => {
  if (!collection) return null;
  const { address = {}, mailingAddress = {} } = collection;
  const country = address.country || mailingAddress.country;
  const city = address.city || mailingAddress.city;

  return <div>
    {collection.code && country && <SimilarTag fn={collectionSearch}
      query={{ code: collection.code, country }}
      color="red"
      to={`/collection/search`}
    >Same code + same country</SimilarTag>}
    {collection.code && <SimilarTag fn={collectionSearch}
      query={{ code: collection.code }}
      color="orange"
      to={`/collection/search`}
    >Same code</SimilarTag>}
    {city && <SimilarTag fn={collectionSearch}
      query={{ fuzzyName: collection.name, city }}
      color="orange"
      to={`/collection/search`}
    >Similar name + same city</SimilarTag>}

    <dl>
      <PresentationItem label={<FormattedMessage id="name" defaultMessage="Name" />}>
        {collection.name}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description" />}>
        {collection.description && (
          <ShowMoreContent content={collection.description} />
        )}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="contentTypes" defaultMessage="Content Types" />}>
        {collection.contentTypes && collection.contentTypes.map(type =>
          <FormattedMessage key={type} id={`collectionContentType.${type}`} />
        )}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="code" defaultMessage="Code" />}>
        {collection.code}
      </PresentationItem>

      <PresentationItem label={<FormattedMessage id="alternativeCodes" defaultMessage="Alternative codes" />}>
        {collection.alternativeCodes && collection.alternativeCodes.map((x, i) => {
          return <div key={`${x.code}_${i}`} style={{ marginBottom: 12 }}><div>{x.code}</div><div style={{ color: '#aaa' }}>{x.description}</div></div>;
        })}
      </PresentationItem>

      <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage" />}>
        {collection.homepage && (
          <a href={collection.homepage} target="_blank" rel="noopener noreferrer">{collection.homepage}</a>
        )}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="catalogUrl" defaultMessage="Catalog URL" />}>
        {collection.catalogUrl && (
          <a href={collection.catalogUrl} target="_blank" rel="noopener noreferrer">{collection.catalogUrl}</a>
        )}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="apiUrl" defaultMessage="API URL" />}>
        {collection.apiUrl && (
          <a href={collection.apiUrl} target="_blank" rel="noopener noreferrer">{collection.apiUrl}</a>
        )}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="institution" defaultMessage="Institution" />}>
        {collection.institution && (
          <NavLink to={`/institution/${collection.institutionKey}`}>
            {collection.institution.name}
          </NavLink>
        )}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="phone" defaultMessage="Phone" />}>
        {collection.phone && collection.phone.length > 0 ? collection.phone : null}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="email" defaultMessage="Email" />}>
        {collection.email && collection.email.length > 0 ? collection.email : null}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="preservationTypes" defaultMessage="Preservation type" />}>
        {collection.preservationTypes && collection.preservationTypes.map(type =>
          <FormattedMessage key={type} id={`preservationType.${type}`} />
        )}
      </PresentationItem>

      <PresentationItem label={<FormattedMessage id="taxonomicCoverage" defaultMessage="Taxonomic coverage" />}>
        {collection.taxonomicCoverage}
      </PresentationItem>

      <PresentationItem label={<FormattedMessage id="geography" defaultMessage="Geography" />}>
        {collection.geography}
      </PresentationItem>

      <PresentationItem label={<FormattedMessage id="notes" defaultMessage="Notes" />}>
        {collection.notes}
      </PresentationItem>

      <PresentationItem label={<FormattedMessage id="incorporatedCollections" defaultMessage="Incorporated collections" />}>
        {collection.incorporatedCollections && collection.incorporatedCollections.length > 0 ? collection.incorporatedCollections : null}
      </PresentationItem>

      <PresentationItem label={<FormattedMessage id="importantCollectors" defaultMessage="Important collectors" />}>
        {collection.importantCollectors && collection.importantCollectors.length > 0 ? collection.importantCollectors : null}
      </PresentationItem>

      <PresentationItem label={<FormattedMessage id="accessionStatus" defaultMessage="Accession status" />}>
        {collection.accessionStatus && <FormattedMessage id={`accessionStatus.${collection.accessionStatus}`} />}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="active" defaultMessage="Active" />}>
        <BooleanValue value={collection.active} />
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="personalCollection" defaultMessage="Personal collection" />}>
        <BooleanValue value={collection.personalCollection} />
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="displayOnNHCPortal" defaultMessage="Display on NHC portal" />}>
        <BooleanValue value={collection.displayOnNHCPortal} />
      </PresentationItem>
      {/* <PresentationItem label={<FormattedMessage id="doi" defaultMessage="Digital Object Identifier"/>}>
            {collection.doi}
          </PresentationItem> */}
    </dl>
    <dl>
      <PresentationGroupHeader
        title={<FormattedMessage id="mailingAddress" defaultMessage="Mailing address" />}
        helpText={<FormattedMessage id="help.mailingAddress" defaultMessage="An address to send emails" />}
      />
      <PresentationItem label={<FormattedMessage id="address" defaultMessage="Address" />}>
        {collection.mailingAddress && collection.mailingAddress.address}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="city" defaultMessage="City" />}>
        {collection.mailingAddress && collection.mailingAddress.city}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="province" defaultMessage="Province" />}>
        {collection.mailingAddress && collection.mailingAddress.province}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country" />}>
        {collection.mailingAddress && collection.mailingAddress.country && (
          <FormattedMessage id={`country.${collection.mailingAddress.country}`} />
        )}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}>
        {collection.mailingAddress && collection.mailingAddress.postalCode}
      </PresentationItem>
    </dl>
    <dl>
      <PresentationGroupHeader
        title={<FormattedMessage id="physicalAddress" defaultMessage="Physical address" />}
        helpText={<FormattedMessage id="help.physicalAddress" defaultMessage="An address of a building" />}
      />
      <PresentationItem label={<FormattedMessage id="address" defaultMessage="Address" />}>
        {collection.address && collection.address.address}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="city" defaultMessage="City" />}>
        {collection.address && collection.address.city}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="province" defaultMessage="Province" />}>
        {collection.address && collection.address.province}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country" />}>
        {collection.address && collection.address.country && (
          <FormattedMessage id={`country.${collection.address.country}`} />
        )}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}>
        {collection.address && collection.address.postalCode}
      </PresentationItem>
    </dl>
    <MetaData item={collection} />
  </div>
}

CollectionPresentation.propTypes = {
  collection: PropTypes.object
};

export default CollectionPresentation;