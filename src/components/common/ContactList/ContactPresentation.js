import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

import PresentationItem from '../../PresentationItem';

const ContactPresentation = ({ visible, onCancel, data }) => (
        <Modal
          visible={visible}
          title={<FormattedMessage id="contactDetails" defaultMessage="Contact details"/>}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
          footer={<Button key="submit" type="primary" onClick={onCancel}>OK</Button>}
        >
          <dl>
            <PresentationItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
              {data.type}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="primary" defaultMessage="Primary"/>}>
              {data.primary}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="firstName" defaultMessage="First name"/>}>
              {data.firstName}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}>
              {data.lastName}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="position" defaultMessage="Position"/>}>
              {data.position}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
              {data.description}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="email" defaultMessage="Email"/>}>
              {data.email}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="phone" defaultMessage="Phone"/>}>
              {data.phone}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
              {data.homepage ? data.homepage.map(((item, i) => (
                <a href={item} key={i} target="_blank" rel="noopener noreferrer">{item}</a>
              ))) : null}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="organization" defaultMessage="Organization"/>}>
              {data.organization}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="address" defaultMessage="Address"/>}>
              {data.address}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="city" defaultMessage="City"/>}>
              {data.city}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="province" defaultMessage="Province"/>}>
              {data.province}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
              {data.country}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
              {data.postalCode}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="userId" defaultMessage="User ID"/>}>
              {data.userId}
            </PresentationItem>
          </dl>
        </Modal>
);

export default ContactPresentation;