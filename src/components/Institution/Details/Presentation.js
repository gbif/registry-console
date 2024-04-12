import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import SimilarTag from '../../common/SimilarTag';

// Components
import { BooleanValue, PresentationItem, PresentationGroupHeader, MapComponent } from '../../common';
import MetaData from '../../common/MetaData';
import { institutionSearch } from '../../../api/institution';
import { prettifyLicense } from '../../util/helpers';
import ConceptValue from '../../common/ConceptValue';

const InstitutionPresentation = ({ institution }) => {
  if (!institution) return null;

  const { address = {}, mailingAddress = {} } = institution;
  const city = address.city || mailingAddress.city;

  return <div>
    <SimilarTag fn={institutionSearch}
      query={{ name: institution.name }}
      color="red"
      to={`/institution/search`}
    >Same name</SimilarTag>
    {institution.code && <SimilarTag fn={institutionSearch}
      query={{ code: institution.code }}
      color="red"
      to={`/institution/search`}
    >Same code</SimilarTag>}
    {city && <SimilarTag fn={institutionSearch}
      query={{ fuzzyName: institution.name, city: address.city || mailingAddress.city }}
      color="orange"
      to={`/institution/search`}
    >Similar name + same city</SimilarTag>}

    <dl>
      <PresentationItem label={<FormattedMessage id="name" defaultMessage="Name" />}>
        {institution.name}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description" />}>
        {institution.description}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="code" defaultMessage="Code" />}>
        {institution.code}
      </PresentationItem>

      <PresentationItem label={<FormattedMessage id="alternativeCodes" defaultMessage="Alternative codes" />}>
        {institution.alternativeCodes && institution.alternativeCodes.map((x, i) => {
          return <div key={`${x.code}_${i}`} style={{ marginBottom: 12 }}><div>{x.code}</div><div style={{ color: '#aaa' }}>{x.description}</div></div>;
        })}
      </PresentationItem>

      <PresentationItem
        label={<FormattedMessage id="type" defaultMessage="Type" />}>
        {institution.types && institution.types.map(name => {
          return <ConceptValue vocabulary="InstitutionType" name={name} />
        })}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="active" defaultMessage="Active" />}>
        <BooleanValue value={institution.active} />
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage" />}>
        {institution.homepage && (
          <a href={institution.homepage} target="_blank" rel="noopener noreferrer">{institution.homepage}</a>
        )}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="phone" defaultMessage="Phone" />}>
        {institution.phone && institution.phone.length > 0 ? institution.phone : null}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="email" defaultMessage="Email" />}>
        {institution.email && institution.email.length > 0 ? institution.email : null}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="catalogUrl" defaultMessage="Catalog URL" />}>
        {institution.catalogUrls && institution.catalogUrls.map(catalogUrl => {
          return <a href={catalogUrl} target="_blank" rel="noopener noreferrer">{catalogUrl}</a>
        })}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="apiUrls" defaultMessage="API URL" />}>
        {institution.apiUrls && institution.apiUrls.map(url => {
          return <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        })}
      </PresentationItem>
      <PresentationItem
        label={<FormattedMessage id="institutionalGovernance" defaultMessage="Institutional governance" />}>
        {institution.institutionalGovernances && institution.institutionalGovernances.map(institutionalGovernance => {
          return <ConceptValue vocabulary="InstitutionalGovernance" name={institutionalGovernance} />
        })}
      </PresentationItem>
      <PresentationItem
        label={<FormattedMessage id="disciplines" defaultMessage="Disciplines" />}>
        {institution.disciplines && institution.disciplines.map(name => {
          return <ConceptValue vocabulary="Discipline" name={name} />
        })}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="latitude" defaultMessage="Latitude" />}>
        {institution.latitude}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="longitude" defaultMessage="Longitude" />}>
        {institution.longitude}
      </PresentationItem>
      <MapComponent
        disabled
        lat={institution.latitude}
        lng={institution.longitude}
        getCoordinates={() => {}}
      />
      <PresentationItem label={<FormattedMessage id="additionalNames" defaultMessage="Additional names" />}>
        {institution.additionalNames}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="foundingDate" defaultMessage="Founding date" />}>
        {institution.foundingDate}
      </PresentationItem>
      <PresentationItem
        label={<FormattedMessage id="geographicDescription" defaultMessage="Geographic description" />}>
        {institution.geographicDescription}
      </PresentationItem>
      <PresentationItem
        label={<FormattedMessage id="taxonomicDescription" defaultMessage="Taxonomic description" />}>
        {institution.taxonomicDescription}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="numberSpecimens" defaultMessage="Number specimens" />}>
        {institution.numberSpecimens}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="indexHerbariorumRecord" defaultMessage="Herbariorum record" />}>
        <BooleanValue value={institution.indexHerbariorumRecord} />
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="logoUrl" defaultMessage="Logo URL" />}>
        {institution.logoUrl}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="citesPermitNumber" defaultMessage="Cites permit number" />}>
        {institution.citesPermitNumber}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="displayOnNHCPortal" defaultMessage="Display on NHC portal" />}>
        <BooleanValue value={institution.displayOnNHCPortal} />
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="featuredImageUrl" defaultMessage="Featured image URL" />}>
        {institution.featuredImageUrl}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="featuredImageLicense" defaultMessage="Featured image license" />}>
        {prettifyLicense(institution.featuredImageLicense)}
      </PresentationItem>
    </dl>
    <dl>
      <PresentationGroupHeader
        title={<FormattedMessage id="mailingAddress" defaultMessage="Mailing address" />}
        helpText={<FormattedMessage id="help.mailingAddress" defaultMessage="An address to send emails" />}
      />
      <PresentationItem label={<FormattedMessage id="address" defaultMessage="Address" />}>
        {institution.mailingAddress && institution.mailingAddress.address}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="city" defaultMessage="City" />}>
        {institution.mailingAddress && institution.mailingAddress.city}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="province" defaultMessage="Province" />}>
        {institution.mailingAddress && institution.mailingAddress.province}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country" />}>
        {institution.mailingAddress && institution.mailingAddress.country && (
          <FormattedMessage id={`country.${institution.mailingAddress.country}`} />
        )}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}>
        {institution.mailingAddress && institution.mailingAddress.postalCode}
      </PresentationItem>
    </dl>
    <dl>
      <PresentationGroupHeader
        title={<FormattedMessage id="physicalAddress" defaultMessage="Physical address" />}
        helpText={<FormattedMessage id="help.physicalAddress" defaultMessage="An address of a building" />}
      />
      <PresentationItem label={<FormattedMessage id="address" defaultMessage="Address" />}>
        {institution.address && institution.address.address}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="city" defaultMessage="City" />}>
        {institution.address && institution.address.city}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="province" defaultMessage="Province" />}>
        {institution.address && institution.address.province}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country" />}>
        {institution.address && institution.address.country && (
          <FormattedMessage id={`country.${institution.address.country}`} />
        )}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code" />}>
        {institution.address && institution.address.postalCode}
      </PresentationItem>
    </dl>
    <MetaData item={institution} />
  </div>
};

InstitutionPresentation.prototype = {
  institution: PropTypes.object
};

export default InstitutionPresentation;