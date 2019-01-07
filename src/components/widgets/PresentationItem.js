import React from 'react';
import injectSheet from 'react-jss';
import { Tooltip, Icon, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Wrappers
import withWidth, { MEDIUM } from '../hoc/Width';

const styles = () => ({
  formItem: {
    paddingBottom: 0,
    width: '100%',
    clear: 'both',
    '& > div': {
      minHeight: '32px',
      marginBottom: '15px'
    }
  },
  label: {
    lineHeight: '39.9999px',
    display: 'block',
    whiteSpace: 'nowrap',
    color: 'rgba(0, 0, 0, 0.85)',
    '&:after': {
      content: '":"',
      margin: '0 8px 0 2px',
      position: 'relative',
      top: '-0.5px'
    }
  },
  tip: {
    color: 'rgba(0,0,0,.45)',
    margin: '0 4px',
  },
  icon: {
    marginTop: '4px'
  },
  required: {
    display: 'inline-block',
    marginRight: '4px',
    content: '*',
    fontFamily: 'SimSun',
    lineHeight: '39.9999px',
    fontSize: '14px',
    color: '#f5222d'
  },
  content: {
    wordBreak: 'break-word',
    lineHeight: '39.9999px',
    marginBottom: 0
  },
  noContent: {
    wordBreak: 'break-word',
    lineHeight: '39.9999px',
    color: '#999',
    fontSize: '12px',
    marginBottom: 0
  }
});

/**
 * Component responsible for data display in a read mode
 * @param label - label text
 * @param helpText - text to be displayed as a tip
 * @param required - boolean option to draw red asterisk or not
 * @param classes - passed from injectSheet wrapper, CSS styles from styles object above
 * @param children - wrapped content
 * @param width - passed from withWidth wrapper, data about current page size
 * @returns {*}
 * @constructor
 */
const PresentationItem = ({ label, helpText, required, classes, children, width }) => {
  const getValue = () => {
    let value = (
      <dd className={classes.noContent}>
        <FormattedMessage id="noInformation" defaultMessage="No information"/>
      </dd>
    );

    if (Array.isArray(children) && children.length > 0) {
      value = children.map((item, i) => (<dd className={classes.content} key={i}>{item}</dd>));
    } else if (!Array.isArray(children) && children) {
      value = <dd className={classes.content}>{children}</dd>;
    }

    return value;
  };

  return (
      <Row className={classes.formItem} type="flex">
        <Col sm={24} md={9} style={width < MEDIUM ? {marginBottom: 0} : {}}>
          <div>
            <dt className={classes.label} style={width > MEDIUM ? {display: 'flex', justifyContent: 'flex-end'} : {}}>
              {required && <span className={classes.required}>*</span>}
              {label}
              {helpText && (
                <em className={classes.tip}>
                  <Tooltip title={helpText}>
                    <Icon type="question-circle-o" className={classes.icon}/>
                  </Tooltip>
                </em>
              )}
            </dt>
          </div>
        </Col>
        <Col sm={24} md={15} style={width < MEDIUM ? {marginBottom: 0} : {}}>
          {getValue()}
        </Col>
      </Row>
    );
};

PresentationItem.propTypes = {
  label: PropTypes.object.isRequired,
  helpText: PropTypes.object,
  required: PropTypes.bool
};

export default withWidth()(injectSheet(styles)(PresentationItem));
