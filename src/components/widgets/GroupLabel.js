import React from 'react';
import { Col, Icon, Row, Tooltip } from 'antd';
import injectSheet from 'react-jss';

// Wrappers
import withWidth, { MEDIUM } from '../hoc/Width';

const styles = {
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
    fontWeight: 500
  },
  tip: {
    color: 'rgba(0,0,0,.45)',
    marginLeft: '4px',
  },
  icon: {
    marginTop: '4px'
  }
};

const GroupLabel = ({ label, helpText, width, classes }) => {
  return (
    <div>
      <Row className={classes.formItem}>
        <Col sm={24} md={8} style={width < MEDIUM ? {marginBottom: 0} : {}}>
          <div className={classes.label} style={width > MEDIUM ? {textAlign: 'right'} : {}}>
              {label}
              {helpText && (
                <em className={classes.tip}>
                  <Tooltip title={helpText}>
                    <Icon type="question-circle-o" className={classes.icon}/>
                  </Tooltip>
                </em>
              )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withWidth()(injectSheet(styles)(GroupLabel));