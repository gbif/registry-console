import React from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';

import { PresentationItem, DateValue, PresentationGroupHeader } from '../../widgets';

const MetaData = ({item}) => {
  return (
    <dl>
      <PresentationGroupHeader
        title={<FormattedMessage id="registryMeta" defaultMessage="Registry meta data"/>}
      />
      <PresentationItem label={<FormattedMessage id="created" defaultMessage="Created"/>}>
        <FormattedRelative value={item.created}/>
        <DateValue value={item.created}/>
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="createdBy" defaultMessage="Created by"/>}>
        {item.createdBy}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="modified" defaultMessage="Modified"/>}>
        <FormattedRelative value={item.modified}/>
        <DateValue value={item.modified}/>
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="modifiedBy" defaultMessage="Modified by"/>}>
        {item.modifiedBy}
      </PresentationItem>
    </dl>
  );
};

export default MetaData;

