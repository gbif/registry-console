import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

import { PresentationItem } from '../../widgets';

const MachineTagPresentation = ({ visible, onCancel, data }) => (
  <Modal
    visible={visible}
    title={<FormattedMessage id="machineTagDetails" defaultMessage="Machine tag details"/>}
    destroyOnClose={true}
    maskClosable={false}
    closable={false}
    footer={<Button key="submit" type="primary" onClick={onCancel}>OK</Button>}
  >
    <dl>
      <PresentationItem label={<FormattedMessage id="namespace" defaultMessage="Namespace"/>}>
        {data.namespace}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="name" defaultMessage="Name"/>}>
        {data.name}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="value" defaultMessage="Value"/>}>
        {data.value}
      </PresentationItem>
    </dl>
  </Modal>
);

export default MachineTagPresentation;