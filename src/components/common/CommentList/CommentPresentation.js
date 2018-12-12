import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

import PresentationItem from '../../PresentationItem';

const CommentPresentation = ({ visible, onCancel, data }) => (
  <Modal
    visible={visible}
    title={<FormattedMessage id="commentDetails" defaultMessage="Comment details"/>}
    destroyOnClose={true}
    maskClosable={false}
    closable={false}
    footer={<Button key="submit" type="primary" onClick={onCancel}>OK</Button>}
  >
    <dl>
      <PresentationItem label={<FormattedMessage id="content" defaultMessage="Content"/>}>
        {data.content}
      </PresentationItem>
    </dl>
  </Modal>
);

export default CommentPresentation;