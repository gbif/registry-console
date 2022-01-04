import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Switch } from 'antd';
import injectSheet from 'react-jss';
import { injectIntl, FormattedMessage } from 'react-intl';

const TextArea = Input.TextArea;

const styles = {
  inputWrapper: {
    position: 'relative'
  },
  actionBar: {
  },
  inputArea: {
  },
  invalid: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'tomato',
    padding: '5px',
    margin: '0',
    lineHeight: '1em'
  }
};

/**
 * A custom Ant form control built as it shown in the official documentation
 * https://ant.design/components/form/#components-form-demo-customized-form-controls
 * Based on built-in Tag https://ant.design/components/tag/#components-tag-demo-control
 */
class JsonFormField extends React.Component {
  // static getDerivedStateFromProps(nextProps) {
  //   // Should be a controlled component
  //   if ('value' in nextProps) {
  //     return { val: JSON.stringify(nextProps.value, null, 2) };
  //   }
  //   return null;
  // }

  constructor(props) {
    super(props);

    this.state = {
      val: JSON.stringify(props.value, null, 2)
    };
  }

  triggerChange = () => {
    // Should provide an event to pass value to Form
    const onChange = this.props.onChange;
    if (onChange) {
      try {
        const parsed = JSON.parse(this.state.val);
        onChange(parsed);
        this.setState({ isEditMode: false });
      } catch (err) {
        this.setState({ invalidJson: true })
      }
    }
  };

  handleChange = (event) => {
    const newValue = event.target.value;
    try {
      JSON.parse(newValue);
      this.setState({
        val: newValue,
        invalidJson: false
      });
    } catch (err) {
      this.setState({
        val: newValue,
        invalidJson: true
      });
    }
  };

  render() {
    const { val, isEditMode } = this.state;
    const { classes, style, value } = this.props;

    return (
      <div>
        {!isEditMode && <Switch
          style={{ float: 'right', zIndex: 100 }}
          size="small"
          checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit" />}
          unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit" />}
          onChange={() => this.setState({ isEditMode: !this.state.isEditMode })}
          checked={this.state.isEditMode}
        />}
        {!isEditMode && <div>
          <pre style={{ lineHeight: '1em', marginTop: '1em', ...style }}>
            {val}
          </pre>
        </div>}
        {isEditMode && <>
          <div className={classes.inputWrapper}>
            <TextArea
              className={classes.inputArea}
              rows={12}
              onChange={this.handleChange}
              value={val}
            />
            {this.state.invalidJson && <div className={classes.invalid}>Invalid</div>}
          </div>
          <div className={classes.actionBar}>
            <Button 
              size="small" 
              onClick={() => this.setState({isEditMode: false, val: JSON.stringify(value, null, 2)})}
              >Cancel</Button>

            {!this.state.invalidJson && <Button size="small" type="primary" onClick={() => {
              this.triggerChange();
            }}>Update field</Button>}
          </div>
        </>}
      </div>
    );
  }
}

JsonFormField.propTypes = {
  // labelKey: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired, // text label
  // labelValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired, // text label
  value: PropTypes.oneOfType([PropTypes.array]), // value passed from form field decorator
  onChange: PropTypes.func.isRequired, // callback to been called on any data change
};

export default injectSheet(styles)(injectIntl(JsonFormField));