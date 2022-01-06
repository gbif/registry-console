import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Select, Tooltip } from 'antd';
import injectSheet from 'react-jss';
import { injectIntl, FormattedMessage } from 'react-intl';

// Wrappers
import withContext from '../hoc/withContext';

const { Option } = Select;

const styles = {
  pair: {
    margin: '4px 0'
  },
  input: {
    marginRight: '4px'
  }
};

/**
 * A custom Ant form control built as it shown in the official documentation
 * https://ant.design/components/form/#components-form-demo-customized-form-controls
 * Based on built-in Tag https://ant.design/components/tag/#components-tag-demo-control
 */
class UserIds extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component
    if ('value' in nextProps) {
      return { pairs: nextProps.value };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      pairs: props.value
    };
  }

  onIdChange = ({ e, index }) => {
    const pairs = [...this.state.pairs];
    pairs[index] = pairs[index] || {};
    pairs[index].id = e.target.value;
    this.triggerChange(pairs);
  };

  onTypeChange = ({ index, type }) => {
    const pairs = [...this.state.pairs];
    pairs[index] = pairs[index] || {};
    pairs[index].type = type;
    this.triggerChange(pairs);
  };

  addEmptyPair = () => {
    const pairs = [...this.state.pairs, { type: 'OTHER', id: undefined }];
    // this.setState({ newId: undefined, newType: undefined });
    this.triggerChange(pairs);
  }

  removePair = (index) => {
    const pairs = [...this.state.pairs];
    pairs.splice(index, 1);
    this.triggerChange(pairs);
  }

  triggerChange = pairs => {
    // Should provide an event to pass value to Form
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(pairs);
    }
  };

  render() {
    const { pairs } = this.state;
    const { classes, intl, idTypes } = this.props;

    const idText = intl.formatMessage({ id: 'userId', defaultMessage: 'User ID' });

    return (
      <React.Fragment>
        {pairs && pairs.map((pair, index) => {
          return <div className={classes.pair} key={index}>
            <Input.Group compact>
              <Select 
                defaultValue={pair.type} 
                style={{ width: 150 }} 
                dropdownMatchSelectWidth={false}
                onChange={(value) => this.onTypeChange({ index, value })}
                >
                {idTypes.map(type => <Option key={type} value={type}><FormattedMessage id={`idType.${type}`} defaultMessage={type} /></Option>)}
              </Select>
              <Input
                style={{ width: 134 }}
                className={classes.input}
                type="text"
                placeholder={idText}
                value={pair.id}
                onChange={e => this.onIdChange({ e, index })}
              />
              <Tooltip title={<FormattedMessage id="remove" defaultMessage="Remove"/>}>
                <Button icon="delete" onClick={e => this.removePair(index)}/>
              </Tooltip>
            </Input.Group>
          </div>
        })}
        <div className={classes.pair}>
          <Tooltip title={<FormattedMessage id="add" defaultMessage="Add" />}>
            <Button icon="plus" onClick={this.addEmptyPair} />
          </Tooltip>
        </div>
      </React.Fragment>
    );
  }
}

UserIds.propTypes = {
  // labelKey: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired, // text label
  // labelValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired, // text label
  value: PropTypes.oneOfType([PropTypes.array]), // value passed from form field decorator
  onChange: PropTypes.func.isRequired, // callback to been called on any data change
};

const mapContextToProps = ({ idTypes }) => ({ idTypes });

export default injectSheet(styles)(injectIntl(withContext(mapContextToProps)(UserIds)));