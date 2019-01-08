import React from 'react';
import { Select, Spin } from 'antd';
import PropTypes from 'prop-types';

/**
 * A custom Ant form control built as it shown in the official documentation
 * https://ant.design/components/form/#components-form-demo-customized-form-controls
 * Based on built-in Select https://ant.design/components/select/#components-select-demo-select-users
 *
 * Contains additional logic to invoke given callbacks on search and set to the form selected data
 */
class FilteredSelectControl extends React.Component {
  static defaultProps = {
    optionValue: 'key',
    optionText: 'name'
  };

  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component
    if ('value' in nextProps) {
      return { ...(nextProps.value || {}) };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.value || null,
      delay: props.delay || null
    };
  }

  componentDidMount() {
    this.timer = null;
  }

  handleSearch = value => {
    clearTimeout(this.timer);
    const { delay } = this.props;

    if (!('value' in this.props)) {
      this.setState({ value });
    }

    if (delay) {
      this.timer = setTimeout(
        () => this.props.search(value),
        delay
      );
    } else {
      this.props.search(value);
    }
  };

  handleChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  };

  render() {
    const { placeholder, fetching, items, optionValue, optionText } = this.props;
    const { value } = this.state;

    return (
      <React.Fragment>
        <Select
          showSearch
          optionFilterProp="children"
          placeholder={placeholder}
          filterOption={false}
          notFoundContent={fetching ? <Spin size="small"/> : null}
          onSelect={this.handleChange}
          onSearch={this.handleSearch}
          defaultValue={value || undefined}
        >
          {items.map(item => (
            <Select.Option value={optionValue ? item[optionValue] : JSON.stringify(item)} key={item.key}>
              {item.title || item[optionText]}
            </Select.Option>
          ))}
        </Select>
      </React.Fragment>
    );
  }
}

FilteredSelectControl.propTypes = {
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  value: PropTypes.string, // a value from field decorator
  onChange: PropTypes.func, // a callback to been invoke when user selects value
  search: PropTypes.func.isRequired, // a callback to been invoke on search/filter
  fetching: PropTypes.bool.isRequired, // a boolean value to display Spin
  items: PropTypes.array.isRequired, // list of items to show in the Select (usually, result of search callback)
  delay: PropTypes.number, // optional delay while user inputs data before invoking search callback,
  optionValue: PropTypes.string, // if you want to specify return value (if empty string, then will return whole object)
  optionText: PropTypes.string // if you want to specify visible text in the dropdown
};

export default FilteredSelectControl;