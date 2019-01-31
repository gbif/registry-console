import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import injectSheet from 'react-jss';

const styles = {
  icon: {
    fontSize: '20px',
    color: 'rgba(0, 0, 0, .87)'
  }
};

const IngestionHistoryLink = ({ uuid, classes }) => {
  return (
    <Tooltip
      placement="top"
      title={<FormattedMessage id="ingestionHistory" defaultMessage="Ingestion history"/>}
    >
      <Link to={`/dataset/${uuid}/process`}>
        <Icon type="line-chart" className={classes.icon}/>
      </Link>
    </Tooltip>
  );
};

IngestionHistoryLink.propTypes = {
  uuid: PropTypes.string.isRequired
};

export default injectSheet(styles)(IngestionHistoryLink);