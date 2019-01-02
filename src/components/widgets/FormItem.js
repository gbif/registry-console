import React from 'react';
import { Icon, Tooltip, Form } from 'antd';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

// Form layout configuration (custom styles, Ant Cols responsive settings)
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
 * @param modal - boolean parameter to mark if a field is used on modal and use different CSS styles (probably)
 * @param children
 * @param classes
 * @returns {*}
 * @constructor
 */
const FormItem = ({ label, helpText, warning, modal, children, classes }) => {
  return (
    <Form.Item
      {...formItemLayout(modal)}
      label={
        <span>
          {label}
          {helpText && (
            <em className={classes.tip}>
              <Tooltip title={helpText}>
                <Icon type="question-circle-o" className={classes.icon}/>
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
  warning: PropTypes.object,
  modal: PropTypes.bool
};

export default injectSheet(styles)(FormItem);