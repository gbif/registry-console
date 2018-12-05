import React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Badge } from 'antd';

import PresentationItem from '../../PresentationItem';

const OrganizationPresentation = ({ organization }) => (
  <div>
    {organization ?
      <dl>
        <PresentationItem label={<FormattedMessage id="title" defaultMessage="Title"/>}>
          {organization.title}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="abbreviation" defaultMessage="Abbreviation"/>}>
          {organization.abbreviation}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
          {organization.description}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="endorsingNode" defaultMessage="Endorsing node"/>}>
          <NavLink to={`/node/${organization.endorsingNodeKey}`}>
            {organization.endorsingNode.title}
          </NavLink>
          {organization.endorsementApproved ? <Badge count="Approved" style={{ backgroundColor: '#52c41a' }}/> : null}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
          {organization.homepage.map(((item, i) => (
            <a href={item} key={i} target="_blank">{item}</a>
          )))}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>}>
          {organization.logoUrl}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="language" defaultMessage="Language"/>}>
          {organization.language}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="address" defaultMessage="Address"/>}>
          {organization.address}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="city" defaultMessage="City"/>}>
          {organization.city}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="province" defaultMessage="Province"/>}>
          {organization.province}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
          {organization.country}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
          {organization.postalCode}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
          {organization.email}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="phone" defaultMessage="Phone"/>}>
          {organization.phone}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="latitude" defaultMessage="Latitude"/>}>
          {organization.latitude}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="longitude" defaultMessage="Longitude"/>}>
          {organization.longitude}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="created" defaultMessage="Created"/>}>
          <FormattedDate value={organization.created}/>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="createdBy" defaultMessage="Created by"/>}>
          {organization.createdBy}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="modified" defaultMessage="Modified"/>}>
          <FormattedDate value={organization.modified}/>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="modifiedBy" defaultMessage="Modified by"/>}>
          {organization.modifiedBy}
        </PresentationItem>
      </dl>
      : null}
  </div>
);

export default OrganizationPresentation;