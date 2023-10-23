import React from 'react';
import PropTypes from 'prop-types';
import { EllipsisOutlined } from '@ant-design/icons';
import { Tooltip, Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import injectSheet from 'react-jss';

import withWidth, { MEDIUM } from '../hoc/Width';

const styles = {
  icon: {
    fontSize: '20px',
    transform: 'rotate(90deg)'
  },
  modal: {
    '& i': {
      display: 'none'
    },
    '& .ant-modal-confirm-content': {
      marginLeft: 0
    }
  }
};

const RecordDetails = ({ crawl, text, classes, width, intl }) => {
  const title = intl.formatMessage({ id: 'details', defaultMessage: 'Details' });
  const showDetails = crawl => {
    Modal.info({
      title: title,
      content: (<pre>{JSON.stringify(crawl, null, 2)}</pre>),
      width: width > MEDIUM ? '624px' : 'auto',
      className: classes.modal,
      maskClosable: true
    });
  };

  return (
    <Tooltip
      placement="top"
      title={<FormattedMessage id="details" defaultMessage="Details" />}
    >
      {text && <span style={{cursor: 'pointer'}} onClick={() => showDetails(crawl)}>{text}</span>}
      {!text && <EllipsisOutlined className={classes.icon} onClick={() => showDetails(crawl)} />}
    </Tooltip>
  );
};

RecordDetails.propTypes = {
  crawl: PropTypes.object.isRequired
};

export default withWidth()(injectSheet(styles)(injectIntl(RecordDetails)));