import React from 'react';
import { Icon, Tooltip, Form } from 'antd';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

// Wrappers
import withWidth, { MEDIUM } from '../hoc/Width';

// Custom CSS styles
const styles = {
  tip: {
    color: 'rgba(0,0,0,.45)',
    marginRight: '4px',
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
 * @param isNew - boolean parameter to indicate if it is user creates or edits (no need to show warnings on create)
 * @param children
 * @param classes
 * @param width
 * @returns {*}
 * @constructor
 */
const FormItem = ({ label, helpText, warning, isNew, children, classes, width }) => {
  return (
    <Form.Item
      {...{
        labelCol: {
          sm: { span: 24 },
          md: { span: 8 },
          style: {
            fontWeight: 500,
            display: 'inline-flex',
            justifyContent: width > MEDIUM ? 'flex-end' : 'flex-start'
          }
        },
        wrapperCol: {
          sm: { span: 24 },
          md: { span: 16 },
        },
        style: {
          paddingBottom: 0,
          minHeight: '32px',
          display: 'flex'
        }
      }}
      label={
        <span>
          {label}
          {helpText && (
            <em className={classes.tip} style={width < MEDIUM ? { marginRight: '2px', marginLeft: '2px' } : {}}>
              <Tooltip title={helpText}>
                <Icon type="question-circle-o" className={classes.icon}/>
              </Tooltip>
            </em>
          )}
          {warning && !isNew && (
            <em className={classes.tip} style={width < MEDIUM ? { marginRight: '2px', marginLeft: '2px' } : {}}>
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
  isNew: PropTypes.bool
};

export default withWidth()(injectSheet(styles)(FormItem));