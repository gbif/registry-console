import React from 'react';
import injectSheet from 'react-jss';
import { Tooltip, Icon, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';
import withWidth, { MEDIUM } from 'react-width';
import PropTypes from 'prop-types';

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
    lineHeight: '32px',
    display: 'block',
    whiteSpace: 'nowrap',
    color: 'rgba(0, 0, 0, 0.85)',
    paddingRight: '8px',
    '&:after': {
      content: '":"',
      margin: '0 8px 0 2px',
      position: 'relative',
      top: '-0.5px'
    }
  },
  tip: {
    color: 'rgba(0,0,0,.45)',
    marginLeft: '4px',
  },
  icon: {
    marginTop: '4px'
  },
  required: {
    display: 'inline-block',
    marginRight: '4px',
    content: '*',
    fontFamily: 'SimSun',
    lineHeight: '32px',
    fontSize: '14px',
    color: '#f5222d'
  },
  content: {
    wordBreak: 'break-word',
    lineHeight: '32px'
  },
  noContent: {
    wordBreak: 'break-word',
    lineHeight: '32px',
    color: '#999',
    fontSize: '12px'
  }
});

const PresentationItem = ({ classes, children, label, helpText, required, width }) => {
  const getValue = () => {
    let value = (
      <dd className={classes.noContent}>
        <FormattedMessage id="noInformation" defaultMessage="No information"/>
      </dd>
    );

    if (Array.isArray(children) && children.length > 0) {
      value = children.map((item, i) => (<dd className={classes.content} key={i}>{item}</dd>));
    } else if (children) {
      value = <dd className={classes.content}>{children}</dd>;
    }

    return value;
  };

  return (
      <Row className={classes.formItem}>
        <Col sm={24} md={8} style={width < MEDIUM ? {marginBottom: 0} : {}}>
          <div>
            <dt className={classes.label} style={width > MEDIUM ? {textAlign: 'right'} : {}}>
              {required && <span className={classes.required}>*</span>}
              {label}
              {helpText && (
                <em className={classes.tip}>
                  <Tooltip title={helpText}>
                    <Icon type="info-circle-o" className={classes.icon}/>
                  </Tooltip>
                </em>
              )}
            </dt>
          </div>
        </Col>
        <Col sm={24} md={16} style={width < MEDIUM ? {marginBottom: 0} : {}}>
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
