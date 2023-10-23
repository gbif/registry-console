import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import injectSheet from 'react-jss';

import withWidth, { MEDIUM } from '../../hoc/Width';

const styles = {
  modal: {
    '& i': {
      display: 'none'
    },
    '& .ant-modal-confirm-content': {
      marginLeft: 0
    }
  }
};

const IngestionActions = ({ width, classes, intl }) => {
  const showModal = () => {
    Modal.info({
      content: "A list of downloads. Running downloads can be deleted.",
      width: width > MEDIUM ? '624px' : 'auto',
      className: classes.modal
    });
  };

  return (
    <div>
      <Button htmlType="button" type="primary" onClick={showModal}>
        <FormattedMessage id="about" defaultMessage="About"/>
      </Button>
    </div>
  );
};

export default withWidth()(injectSheet(styles)(injectIntl(IngestionActions)));