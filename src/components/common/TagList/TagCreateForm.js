import React from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

import TagControl from '../../controls/TagControl';

class TagCreateForm extends React.Component {
  state = {
    tags: []
  };

  updateTagList = tags => {
    this.setState({ tags });
  };

  render() {
    const { visible, onCancel, onCreate } = this.props;
    const { tags } = this.state;

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

        <TagControl
          label={<FormattedMessage id="newTag" defaultMessage="New tag"/>}
          value={tags}
          onChange={this.updateTagList}
        />
      </Modal>
    );
  }
}

export default TagCreateForm;