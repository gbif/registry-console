import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import injectSheet from 'react-jss';

const styles = {
  link: {
    border: '1px solid rgb(232, 232, 232)',
    display: 'inline-block !important',
    lineHeight: 1,
    padding: '7px 5px 7px 15px',
    borderRadius: '3px'
  },
  icon: {
    transform: 'rotateZ(45deg)',
    marginLeft: '5px'
  }
};

const GBIFLink = ({ type, uid, classes }) => {
  return (
    <a href={`https://www.gbif.org/${type}/${uid}`} target="_blank" rel="noopener noreferrer" className={classes.link}>
      <FormattedMessage id="viewOnGBIF" defaultMessage="View on GBIF.org"/>
      <Icon type="link" className={classes.icon} />
    </a>
  );
};

GBIFLink.propTypes = {
  type: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired
};

export default injectSheet(styles)(GBIFLink);