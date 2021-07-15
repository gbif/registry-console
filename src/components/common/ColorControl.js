import React from 'react';
import PropTypes from 'prop-types';
import { TwitterPicker } from 'react-color';
import {Popover, Tag} from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl';

const defaultColor = "#ABB8C3";
/**
 * A custom Ant form control built as it shown in the official documentation
 * https://ant.design/components/form/#components-form-demo-customized-form-controls
 * Based on built-in Tag https://ant.design/components/tag/#components-tag-demo-control
 */
class ColorControl extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component
    if ('value' in nextProps) {

      return { color: nextProps.value || defaultColor, label: nextProps.value || <FormattedMessage id="pickColor" defaultMessage="Pick a color"/>};
    }
    return null;
  }

  constructor(props) {
    super(props)
    this.state = {
      color: this.props.color || defaultColor,
      label: this.props.color || <FormattedMessage id="pickColor" defaultMessage="Pick a color"/>,
      showPicker: false
    };
  }

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  };


  render() {
    const { color, showPicker, label } = this.state;

    return <Popover
    placement="rightTop"
    content={<TwitterPicker triangle="hide" color={color} onChangeComplete={color => {
        if(color){
            this.setState({color: color.hex.toUpperCase()}, 
        () => this.triggerChange(color.hex.toUpperCase()))
        }
    }}/>}
    title={null}
    trigger="click"
    visible={showPicker}
    onVisibleChange={visible => this.setState({showPicker: visible})}
  >
      <Tag color={color}>{label}</Tag>
  </Popover>
    
    
  }
}

ColorControl.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired, // text label
  value: PropTypes.string, // value passed from form field decorator
  onChange: PropTypes.func.isRequired, // callback to been called on any data change
};

export default injectIntl(ColorControl);