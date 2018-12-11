import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Modal, Button, Row } from 'antd';
import { FormattedRelative, FormattedMessage } from 'react-intl';

import TagCreateForm from './TagCreateForm';
import TagPresentation from './TagPresentation';

class TagList extends React.Component {
  state = {
    list: this.props.data || [],
    editVisible: false,
    detailsVisible: false,
    selectedItem: null
  };

  showModal = () => {
    this.setState({ editVisible: true });
  };

  showDetails = item => {
    this.setState({
      selectedItem: item,
      detailsVisible: true
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  handleCancel = () => {
    this.setState({
      editVisible: false,
      detailsVisible: false,
      selectedItem: null
    });
  };

  handleDelete = item => {
    Modal.confirm({
      title: <FormattedMessage id="deleteTitle.tag" defaultMessage="Do you want to delete this tag?"/>,
      content: <FormattedMessage id="deleteMessage.tag" defaultMessage="Are you really want to delete tag?"/>,
      onOk: () => this.deleteTag(item),
      onCancel() {
      }
    });
  };

  deleteTag = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteTag(item.key).then(() => {
        // Updating endpoints list
        const list = this.state.list;
        this.setState({
          list: list.filter(el => el.key !== item.key)
        });
        this.props.update('tags', list.length - 1);

        resolve();
      }).catch(reject);
    }).catch(() => console.log('Oops errors!'));
  };

  handleSave = () => {
    const form = this.formRef.props.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.props.createTag(values).then(response => {
        form.resetFields();

        const list = this.state.list;
        list.unshift({
          ...values,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName
        });
        this.props.update('tags', list.length);

        this.setState({
          visible: false,
          list
        });
      });
    });
  };

  render() {
    const { list, editVisible, detailsVisible, selectedItem } = this.state;
    const user = this.props.user;

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <h1><FormattedMessage id="organizationTags" defaultMessage="Organization tags"/></h1>
          {user ?
            <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Button>
            : null}
        </Row>

        <List
          itemLayout="horizontal"
          dataSource={list}
          renderItem={item => (
            <List.Item actions={user ? [
              <Button htmlType="button" onClick={() => this.showDetails(item)} className="btn-link" type="primary" ghost={true}>
                <FormattedMessage id="details" defaultMessage="Details"/>
              </Button>,
              <Button htmlType="button" onClick={() => this.handleDelete(item)} className="btn-link" type="primary" ghost={true}>
                <FormattedMessage id="delete" defaultMessage="Delete"/>
              </Button>
            ] : [
              <Button htmlType="button" onClick={() => this.showDetails(item)} className="btn-link" type="primary" ghost={true}>
                <FormattedMessage id="details" defaultMessage="Details"/>
              </Button>
            ]}>
              <Skeleton title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={<strong className="item-title">{item.value}</strong>}
                  description={
                    <React.Fragment>
                      <FormattedMessage
                        id="createdByRow"
                        defaultMessage={`Created {date} by {author}`}
                        values={{ date: <FormattedRelative value={item.created}/>, author: item.createdBy }}
                      />
                    </React.Fragment>
                  }
                />
              </Skeleton>
            </List.Item>
          )}
        />

        {editVisible && <TagCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={editVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleSave}
        />}

        {detailsVisible && <TagPresentation
          visible={detailsVisible}
          onCancel={this.handleCancel}
          data={selectedItem}
        />}
      </React.Fragment>
    );
  }
}

TagList.propTypes = {
  data: PropTypes.array.isRequired,
  createTag: PropTypes.func.isRequired,
  deleteTag: PropTypes.func.isRequired,
  user: PropTypes.object,
  update: PropTypes.func.isRequired
};

export default TagList;