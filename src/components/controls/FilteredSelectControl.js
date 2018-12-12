import React from 'react';
import { Select, Spin } from 'antd';
import PropTypes from 'prop-types';

class FilteredSelectControl extends React.Component {
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
    const { placeholder, fetching, items } = this.props;
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
          defaultValue={value}
        >
          {items.map(item => (
            <Select.Option value={item.key} key={item.key}>{item.title}</Select.Option>
          ))}
        </Select>
      </React.Fragment>
    );
  }
}

FilteredSelectControl.propTypes = {
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  search: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired
};

export default FilteredSelectControl;