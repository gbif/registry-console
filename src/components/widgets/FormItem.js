import React from 'react';
import { Icon, Tooltip, Form } from 'antd';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

import { formItemLayout } from '../../config/config';

const styles = {
  tip: {
    color: 'rgba(0,0,0,.45)',
    marginLeft: '4px'
  },
  icon: {
    marginTop: '4px'
  },
  warning: {
    marginTop: '4px',
    color: '#b94a48'
  }
};

/**
 * Form Item wrapper with common settings
 * @param label - label text (FormatMessage)
 * @param helpText - tooltip text (FormatMessage)
 * @param warning - additional message-warning text (FormatMessage)
 * @param children
 * @param classes
 * @returns {*}
 * @constructor
 */
const FormItem = ({ label, helpText, warning, children, classes }) => {
  return (
    <Form.Item
      {...formItemLayout}
      label={
        <span>
          {label}
          {helpText && (
            <em className={classes.tip}>
              <Tooltip title={helpText}>
                <Icon type="info-circle-o" className={classes.icon}/>
              </Tooltip>
            </em>
          )}
          {warning && (
            <em className={classes.tip}>
              <Tooltip title={warning}>
                <Icon type="exclamation-circle" theme="filled" className={classes.warning}/>
              </Tooltip>
            </em>
          )}
        </span>
      }
    >
      {children}
    </Form.Item>
  );
};

FormItem.propTypes = {
  label: PropTypes.object.isRequired,
  helpText: PropTypes.object,
  warning: PropTypes.object
};

export default injectSheet(styles)(FormItem);