import React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { NavLink } from 'react-router-dom';

import PresentationItem from '../../PresentationItem';

const OrganizationPresentation = ({ organization }) => (
  <div>
    {organization ?
      <dl>
        <PresentationItem label={<FormattedMessage id="title" defaultMessage="Title"/>}>
          {organization.title}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
          {organization.description}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="endorsingNode" defaultMessage="Endorsing node"/>}>
          <NavLink to={`/node/${organization.endorsingNodeKey}`}>
            {organization.endorsingNode.title}
          </NavLink>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="language" defaultMessage="Language"/>}>
          {organization.language}
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