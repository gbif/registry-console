import React from 'react';
import { Select, Spin } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

class ItemControl extends React.Component {
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
      items: [],
      fetching: false,
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
        () => this.searchItem(value),
        delay
      );
    } else {
      this.searchItem(value);
    }
  };

  searchItem = value => {
    if (!value) {
      this.setState({ items: [] });
      return;
    }

    this.setState({ items: [], fetching: true });

    this.props.api({ q: value }).then(response => {
      this.setState({ items: response.data, fetching: false });
    });
  };

  handleChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  };

  render() {
    const { value, items, fetching } = this.state;
    const { placeholder } = this.props;

    return (
      <React.Fragment>
        <Select
          showSearch
          optionFilterProp="children"
          placeholder={placeholder}
          filterOption={false}
          notFoundContent={fetching ? <Spin size="small"/> : <FormattedMessage id="notFound" defaultMessage="Not Found"/>}
          onSelect={this.handleChange}
          onSearch={this.handleSearch}
          defaultValue={value || undefined}
          allowClear={true}
        >
          {items.map(item => (
            <Select.Option value={JSON.stringify(item)} key={item.key}>
              {item.title}
            </Select.Option>
          ))}
        </Select>
      </React.Fragment>
    );
  }
}

ItemControl.propsTypes = {
  api: PropTypes.func.isRequired, // an API method which will be called to get list of suggested items
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  value: PropTypes.string, // a value from field decorator
  onChange: PropTypes.func, // a callback to been invoke when user selects value
  delay: PropTypes.number // optional delay while user inputs data before invoking search callback
};

export default ItemControl;

