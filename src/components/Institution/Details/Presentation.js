import React from 'react';
import { FormattedMessage, FormattedDate, FormattedRelative } from 'react-intl';
import { Badge } from 'antd';
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

const InstitutionPresentation = ({ institution, classes }) => (
  <div>
    {institution ? (
      <React.Fragment>
        <dl className={classes.modalPresentation}>
          <PresentationItem label={<FormattedMessage id="name" defaultMessage="Name"/>} required>
            {institution.name}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            <a href={institution.homepage} target="_blank" rel="noopener noreferrer">{institution.homepage}</a>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="catalogUrl" defaultMessage="Catalog URL"/>}>
            <a href={institution.catalogUrl} target="_blank" rel="noopener noreferrer">{institution.catalogUrl}</a>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
            {institution.type}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="indexHerbariorumRecord" defaultMessage="Herbariorum record"/>}>
            <Badge status={institution.indexHerbariorumRecord ? 'success' : 'error'} text={`${institution.indexHerbariorumRecord}`} />
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="code" defaultMessage="Code"/>}>
            {institution.code}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="institutionalGovernance" defaultMessage="International governance"/>}>
            {institution.institutionalGovernance}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="created" defaultMessage="Created"/>}>
            <FormattedRelative value={institution.created}/>
            <FormattedDate value={institution.created} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="createdBy" defaultMessage="Created by"/>}>
            {institution.createdBy}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modified" defaultMessage="Modified"/>}>
            <FormattedRelative value={institution.modified}/>
            <FormattedDate value={institution.modified} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modifiedBy" defaultMessage="Modified by"/>}>
            {institution.modifiedBy}
          </PresentationItem>
        </dl>
      </React.Fragment>
    ) : null}
  </div>
);

export default injectSheet(styles)(InstitutionPresentation);