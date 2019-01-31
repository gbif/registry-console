import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip, Modal } from 'antd';
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

const RecordDetails = ({ crawl, classes, width }) => {
  const showDetails = crawl => {
    Modal.info({
      title: <FormattedMessage id="details" defaultMessage="Details"/>,
      content: (<pre>{JSON.stringify(crawl, null, 2)}</pre>),
      width: width > MEDIUM ? '624px' : 'auto',
      className: classes.modal
    });
  };

  return (
    <Tooltip
      placement="top"
      title={<FormattedMessage id="details" defaultMessage="Details"/>}
    >
      <Icon type="ellipsis" className={classes.icon} onClick={() => showDetails(crawl)}/>
    </Tooltip>
  );
};

RecordDetails.propTypes = {
  crawl: PropTypes.object.isRequired
};

export default withWidth()(injectSheet(styles)(injectIntl(RecordDetails)));