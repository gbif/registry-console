import React from 'react';
import { Icon, Tooltip, Form } from 'antd';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

// Wrappers
import withWidth, { MEDIUM } from '../hoc/Width';
import { BlockPicker } from 'react-color';

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
    color: '#eb9e0f'
  },
  error: {
    marginTop: '4px',
    color: '#b94a48'
  },
  previously: {
    lineHeight: '1em',
    background: '#555',
    color: 'white',
    padding: '12px',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'visible',
    marginTop: '16px',
    paddingTop: '16px',
    '&:before': {
      content: '"Previously"',
      position: 'absolute',
      display: 'inline-block',
      top: '-10px',
      color: 'black',
      background: 'white',
      border: '1px solid #888',
      borderRadius: '5px',
      fontSize: '12px',
      padding: '2px 5px'
    }
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
const FormItem = ({ lockedByMasterSource, label, helpText, warning, isNew, children, originalValue, classes, width }) => {
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
          md: { span: 16 }
        },
        style: {
          paddingBottom: 0,
          minHeight: '32px',
          display: 'flex',
          flexDirection: width > MEDIUM ? 'row' : 'column'
        }
      }}
      label={
        <React.Fragment>
          {label}

          {helpText && (
            <em className={classes.tip} style={width < MEDIUM ? { marginRight: '2px', marginLeft: '2px' } : {}}>
              <Tooltip title={helpText}>
                <Icon type="question-circle-o" className={classes.icon}/>
              </Tooltip>
            </em>
          )}

          {lockedByMasterSource && <em className={classes.tip} style={width < MEDIUM ? { marginRight: '2px', marginLeft: '2px' } : {}}>
            <Tooltip title="Controlled by master source">
              <Icon type="lock" theme="filled" className={classes.error} />
            </Tooltip>
          </em>}
          

          {warning && !isNew && (
            <em className={classes.tip} style={width < MEDIUM ? { marginRight: '2px', marginLeft: '2px' } : {}}>
              <Tooltip title={warning}>
                <Icon type="exclamation-circle" theme="filled" className={classes.warning}/>
              </Tooltip>
            </em>
          )}
        </React.Fragment>
      }
    >
        {children}
      {typeof originalValue !== 'undefined' && <pre className={classes.previously}>{JSON.stringify(originalValue, null, 2)}</pre>}
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