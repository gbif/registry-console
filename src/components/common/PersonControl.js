import React from 'react';
import { Select, Spin } from 'antd';
import PropTypes from 'prop-types';

// API
import { getPerson, personSearch } from '../../api/grbioPerson';
// Helpers
import { isUUID } from '../helpers';

class PersonControl extends React.Component {
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
      persons: [],
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
        () => this.searchPerson(value),
        delay
      );
    } else {
      this.searchPerson(value);
    }
  };

  searchPerson = async value => {
    if (!value) {
      return;
    }

    this.setState({ persons: [], fetching: true });

    if (isUUID(value)) {
      const person = (await getPerson(value)).data;
      this.setState({ persons: [person], fetching: false });
    } else {
      const persons = (await personSearch({ q: value })).data.results;
      this.setState({ persons, fetching: false });
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
    const { value, persons, fetching } = this.state;
    const { placeholder } = this.props;

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
          {persons.map(item => (
            <Select.Option value={JSON.stringify(item)} key={item.key}>
              <span title={`${item.firstName} ${item.email ? `(${item.email})` : ''}`}>
                {item.firstName} {item.email && (
                  <code>({item.email})</code>
              )}
              </span>
            </Select.Option>
          ))}
        </Select>
      </React.Fragment>
    );
  }
}

PersonControl.propTypes = {
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  value: PropTypes.string, // a value from field decorator
  onChange: PropTypes.func, // a callback to been invoke when user selects value
  delay: PropTypes.number // optional delay while user inputs data before invoking search callback
};

export default PersonControl;