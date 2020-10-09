import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import injectSheet from 'react-jss';

const styles = {
  pair: {
    margin: '4px 0'
  },
  input: {
    marginRight: '4px'
  }
};

function objToPairs(obj) {
  if (!obj) return [];
  return Object.keys(obj).map(x => {
    return { key: x, value: obj[x] };
  });
}
/**
 * A custom Ant form control built as it shown in the official documentation
 * https://ant.design/components/form/#components-form-demo-customized-form-controls
 * Based on built-in Tag https://ant.design/components/tag/#components-tag-demo-control
 */
class PairControl extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component
    if ('value' in nextProps) {
      return { pairs: objToPairs(nextProps.value) };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      pairs: objToPairs(props.value)
    };
  }

  onKeyChange = ({ e, index }) => {
    const pairs = [...this.state.pairs];
    pairs[index] = pairs[index] || {};
    pairs[index].key = e.target.value;
    this.triggerChange(pairs);
  };

  onValueChange = ({ e, index }) => {
    const pairs = [...this.state.pairs];
    pairs[index] = pairs[index] || {};
    pairs[index].value = e.target.value;
    this.triggerChange(pairs);
  };

  addPair = () => {
    if (this.state.newKey && this.state.newValue) {
      const pairs = [...this.state.pairs, { key: this.state.newKey, value: this.state.newValue }];
      this.setState({newKey: undefined, newValue: undefined});
      this.triggerChange(pairs);
    }
  }

  triggerChange = pairs => {
    // Should provide an event to pass value to Form
    const onChange = this.props.onChange;
    if (onChange) {
      const newValue = pairs.reduce((prev, curr) => {
        prev[curr.key] = curr.value;
        return prev;
      }, {});
      onChange(newValue);
    }
  };

  render() {
    const { pairs, newKey, newValue } = this.state;
    const { classes, labelKey, labelValue } = this.props;

    return (
      <React.Fragment>
        {pairs.map((pair, index) => {
          return <div className={classes.pair}>
            <Input
              className={classes.input}
              type="text"
              placeholder={labelKey || 'Code'}
              value={pair.key}
              onChange={e => this.onKeyChange({ e, key: pair.key, index })}
              style={{ width: 100 }}
            />
            <Input
              className={classes.input}
              type="text"
              placeholder={labelValue || 'Description'}
              value={pair.value}
              onChange={e => this.onValueChange({ e, key: pair.key, index })}
              style={{ width: 200 }}
            />
          </div>
        })}
        <div className={classes.pair}>
          <Input
            className={classes.input}
            type="text"
            value={newKey}
            placeholder={labelKey || 'Code'}
            onChange={e => this.setState({ newKey: e.target.value })}
            style={{ width: 100 }}
          />
          <Input
            className={classes.input}
            type="text"
            value={newValue}
            placeholder={labelValue || 'Description'}
            onChange={e => this.setState({ newValue: e.target.value })}
            style={{ width: 200 }}
          />
          <Button onClick={this.addPair}>Add</Button>
        </div>
      </React.Fragment>
    );
  }
}

PairControl.propTypes = {
  labelKey: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired, // text label
  labelValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired, // text label
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // value passed from form field decorator
  onChange: PropTypes.func.isRequired, // callback to been called on any data change
};

export default injectSheet(styles)(PairControl);