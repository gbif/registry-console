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
class Suggest extends React.Component {
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
    this.handleUpdate(this.state.value);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.handleUpdate(this.props.value);
    }
  }

  handleUpdate = value => {
    if (typeof this.props.value !== 'undefined' && this.props.value !== null) {
      this.setState({ error: undefined });
      this.props.resolveKey(this.props.value)
        .then(response => {
          this.setState({ value, items: [response.data] });
        })
        .catch(err => {
          console.log(err);
          this.setState({ error: 'Invalid value' });
        })
    }
  }

  handleSearch = value => {
    clearTimeout(this.timer);
    const { delay } = this.props;

    if (!('value' in this.props)) {
      this.setState({ value, items: [] });
    }

    if (delay) {
      this.timer = setTimeout(
        () => this.search(value), delay
      );
    } else {
      this.search(value);
    }
  };

  search = value => {
    this.setState({ loading: true });
    this.props.search(value)
      .then(response => {
        this.setState({ loading: false, items: response.data });
      })
      .catch(err => {
        this.setState({ loading: false, items: [] })
      });
  }

  handleChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  };

  render() {
    const { intl, placeholder, titleField = 'title', value, style = { width: '100%' } } = this.props;
    const { items, loading } = this.state;

    const notFoundMessage = intl ? intl.formatMessage({
      id: 'notFound',
      defaultMessage: 'Not found'
    }) : 'Not found';

    return (
      <React.Fragment>
        <Select
          showSearch
          optionFilterProp="children"
          placeholder={placeholder}
          filterOption={false}
          // value={value}
          loading={loading}
          notFoundContent={loading ? <Spin size="small" /> : <span>{notFoundMessage}</span>}
          onSelect={this.handleChange}
          onSearch={this.handleSearch}
          onChange={this.handleChange}
          defaultValue={value || undefined}
          allowClear={true}
          style={style}
        >
          {items && items.map(item => (
            <Select.Option value={item.key} key={item.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap', overflow: 'hidden', width: '100%' }}>
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', flex: '1 1 100%', marginRight: '5px' }}>
                  {item[titleField]}
                </span>
                <small style={{ whiteSpace: 'nowrap', flex: '0 0 auto' }}>{item.code}</small>
              </div>
            </Select.Option>
          ))}
        </Select>
        {this.state.error && <div style={{marginTop: 10, color: 'tomato'}}>{this.state.error}</div>}
      </React.Fragment>
    );
  }
}

Suggest.propTypes = {
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  value: PropTypes.string, // a value from field decorator
  onChange: PropTypes.func, // a callback to been invoke when user selects value
  search: PropTypes.func.isRequired, // a callback to been invoke on search/filter
  resolveKey: PropTypes.func.isRequired, // a boolean value to display
  delay: PropTypes.number, // optional delay while user inputs data before invoking search callback
};

export default Suggest;