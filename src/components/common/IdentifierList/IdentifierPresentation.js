import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

import PresentationItem from '../../widgets/PresentationItem';

const IdentifierPresentation = ({ visible, onCancel, data }) => (
  <Modal
    visible={visible}
    title={<FormattedMessage id="identifierDetails" defaultMessage="Identifier details"/>}
    destroyOnClose={true}
    maskClosable={false}
    closable={false}
    footer={<Button key="submit" type="primary" onClick={onCancel}>OK</Button>}
  >
    <dl>
      <PresentationItem label={<FormattedMessage id="identifier" defaultMessage="Identifier"/>}>
        {data.identifier}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
        {data.type}
      </PresentationItem>
    </dl>
  </Modal>
);

export default IdentifierPresentation;