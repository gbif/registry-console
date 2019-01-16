import React from 'react';
import { Select, Spin } from 'antd';
import PropTypes from 'prop-types';

// API
import { getOrgSuggestions } from '../../api/organization';
// Helpers
import { getPermittedOrganizations } from '../helpers';

class SuggestedOrganizations extends React.Component {
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
      organizations: props.organizations,
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
        () => this.searchOrganizations(value),
        delay
      );
    } else {
      this.searchOrganizations(value);
    }
  };

  searchOrganizations = value => {
    if (!value) {
      return;
    }

    this.setState({ organizations: [], fetching: true });

    getOrgSuggestions({ q: value }).then(response => {
      this.setState({
        organizations: getPermittedOrganizations(this.props.user, response.data),
        fetching: false
      });
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
    const { value, organizations, fetching } = this.state;
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
          {organizations.map(item => (
            <Select.Option value={item.key} key={item.key}>
              {item.title}
            </Select.Option>
          ))}
        </Select>
      </React.Fragment>
    );
  }
}

SuggestedOrganizations.propTypes = {
  organizations: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  value: PropTypes.string, // a value from field decorator
  onChange: PropTypes.func, // a callback to been invoke when user selects value
  delay: PropTypes.number // optional delay while user inputs data before invoking search callback
};

export default SuggestedOrganizations;