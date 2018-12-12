import React from 'react';
import { Modal, Form, Input, Tooltip, Tag, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

class TagCreateForm extends React.Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: ''
  };

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);

    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }

    this.setState({
      tags,
      inputVisible: false,
      inputValue: ''
    });
  };

  saveInputRef = input => this.input = input;

  render() {
    const { visible, onCancel, onCreate } = this.props;
    const { tags, inputVisible, inputValue } = this.state;

    return (
      <Modal
        visible={visible}
        title={<FormattedMessage id="createNewTag" defaultMessage="Create a new tag"/>}
        okText={<FormattedMessage id="create" defaultMessage="Create"/>}
        onCancel={onCancel}
        onOk={() => onCreate(tags)}
        destroyOnClose={true}
        maskClosable={false}
        closable={false}
      >
        <p className="help">
          <small>
            <FormattedMessage
              id="extra.tagValue"
              defaultMessage="The value for the tag (e.g. Arthropod pitfall trap)."
            />
          </small>
        </p>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable={index !== 0} afterClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            <Icon type="plus"/> New Tag
          </Tag>
        )}
      </Modal>
    );
  }
}

export default TagCreateForm;