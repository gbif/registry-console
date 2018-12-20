import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

import { PresentationItem } from '../../widgets';

const EndpointPresentation = ({ visible, onCancel, data }) => (
  <Modal
    visible={visible}
    title={<FormattedMessage id="endpointDetails" defaultMessage="Endpoint details"/>}
    destroyOnClose={true}
    maskClosable={false}
    closable={false}
    footer={<Button key="submit" type="primary" onClick={onCancel}>OK</Button>}
  >
    <dl>
      <PresentationItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
        {data.type}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="url" defaultMessage="URL"/>}>
        {data.url}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
        {data.description}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="machineTags" defaultMessage="Machine tags"/>}>
        {data.machineTags.length > 0 ? data.machineTags : <FormattedMessage id="noMachineTags" defaultMessage="No machine tags"/>}
      </PresentationItem>
    </dl>
  </Modal>
);

export default EndpointPresentation;