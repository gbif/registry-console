import React from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import injectSheet from 'react-jss';

import { stringToArray } from '../util/helpers';
import VocabularySelect from './VocabularySelect';
import { FormattedMessage } from 'react-intl';
import ConceptValue from './ConceptValue';

const styles = {
  newTag: {
    margin: '0 4px',
    background: '#fff',
    borderStyle: 'dashed'
  }
};

/**
 * A custom Ant form control built as it shown in the official documentation
 * https://ant.design/components/form/#components-form-demo-customized-form-controls
 * Based on built-in Tag https://ant.design/components/tag/#components-tag-demo-control
 */
class VocabularyTagControl extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component
    if ('value' in nextProps) {
      let value = stringToArray(nextProps.value);

      return { tags: value };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      tags: stringToArray(props.value),
      inputVisible: false,
      inputValue: ''
    };
  }

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);

    this.setState({ tags });
    this.triggerChange(tags);
  };

  showInput = () => {
    // this.setState({ inputVisible: true });
    this.setState({ inputVisible: true }, () => {
      this.input?.current?.focus()
    });
  };

  handleInputChange = value => {
    let tags = this.state.tags;
    if (value && tags.indexOf(value) === -1) {
      tags = [...tags, value];
    }
    this.setState({
      tags,
      inputVisible: false,
    });
    this.triggerChange(tags);
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  };

  saveInputRef = input => this.input = input?.ref;

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    const { classes, vocabulary, label, removeAll, disabled, id } = this.props;

    return (
      <div id={id}>
        {tags.map((tag, index) => {
          return <Tag key={tag} closable={!disabled && (removeAll || index !== 0)} onClose={() => this.handleClose(tag)}>
            <ConceptValue name={tag} vocabulary={vocabulary} />
          </Tag>;
        })}
        {inputVisible && (
          <VocabularySelect
            style={{ width: 150 }}
            disabled={disabled}
            size="small"
            onChange={this.handleInputChange}
            ref={this.saveInputRef}
            placeholder={<FormattedMessage
              id="select.institution"
              defaultMessage="Select an institution"
            />}
            vocabulary={vocabulary}
          />
        )}
        {!disabled && !inputVisible && (
          <Tag onClick={this.showInput} className={classes.newTag}>
            <PlusOutlined /> <ConceptValue name={label} vocabulary={vocabulary} />
          </Tag>
        )}
      </div>
    );
  }
}

VocabularyTagControl.propTypes = {
  vocabulary: PropTypes.string.isRequired, // vocabulary name
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired, // text label
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // value passed from form field decorator
  onChange: PropTypes.func.isRequired, // callback to been called on any data change
  removeAll: PropTypes.bool // optional flag, to allow remove all tags or not
};

export default injectSheet(styles)(VocabularyTagControl);