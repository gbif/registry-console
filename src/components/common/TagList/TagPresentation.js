import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

import { PresentationItem } from '../../widgets';

const TagPresentation = ({ visible, onCancel, data }) => (
  <Modal
    visible={visible}
    title={<FormattedMessage id="tagDetails" defaultMessage="Tag details"/>}
    destroyOnClose={true}
    maskClosable={false}
    closable={false}
    footer={<Button key="submit" type="primary" onClick={onCancel}>OK</Button>}
  >
    <dl>
      <PresentationItem label={<FormattedMessage id="value" defaultMessage="Value"/>}>
        {data.value}
      </PresentationItem>
    </dl>
  </Modal>
);

export default TagPresentation;