import React from 'react';
import injectSheet from 'react-jss';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';

import Help from './Help';

// Wrappers
import withWidth, { MEDIUM } from '../hoc/Width';


const styles = {
  formItem: {
    paddingBottom: 0,
    width: '100%',
    clear: 'both',
    marginTop: 24,
  }
};

const FormGroupHeader = ({ title, helpText, width, classes }) => {
  return (
    <Row className={classes.formItem}>
      <Col sm={24} md={8} style={width < MEDIUM ? {marginBottom: 0} : {}}></Col>
      <Col sm={24} md={16} style={width < MEDIUM ? {marginBottom: 0} : {}}>
        <h3 className={classes.header}>
          {title}
          <Help title={helpText} />
        </h3>
      </Col>
    </Row>
  );
};

FormGroupHeader.propTypes = {
  title: PropTypes.object.isRequired,
  helpText: PropTypes.object
};

export default withWidth()(injectSheet(styles)(FormGroupHeader));