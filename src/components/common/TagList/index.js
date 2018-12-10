import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Modal, Button, Row } from 'antd';
import { FormattedRelative, FormattedMessage } from 'react-intl';

import { prepareData } from '../../../api/util/helpers';
import TagCreateForm from './TagCreateForm';

// TODO think about CSSinJS for styles
const formButton = {
  type: 'primary',
  ghost: true,
  style: {
    border: 'none',
    padding: 0,
    height: 'auto',
    boxShadow: 'none'
  }
};

class TagList extends React.Component {
  state = {
    list: this.props.data || [],
    visible: false
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  deleteEndpoint = item => {
    // I have never liked assigning THIS to SELF (((
    const self = this;

    Modal.confirm({
      title: <FormattedMessage id="titleDeleteTag" defaultMessage="Do you want to delete this tag?"/>,
      content: <FormattedMessage id="deleteTagMessage" defaultMessage="Are you really want to delete tag?"/>,
      onOk() {
        return new Promise((resolve, reject) => {
          self.props.deleteTag(item.key).then(() => {
            // Updating endpoints list
            const list = self.state.list;
            self.setState({
              list: list.filter(el => el.key !== item.key)
            });
            self.props.update('tags', list.length - 1);

            resolve();
          }).catch(reject);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
      }
    });
  };

  handleSave = () => {
    const form = this.formRef.props.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const preparedData = prepareData(values);

      this.props.createTag(preparedData).then(response => {
        form.resetFields();

        const list = this.state.list;
        list.unshift({
          ...preparedData,
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
    const { list, visible } = this.state;
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
              <Button htmlType="button" onClick={() => this.deleteEndpoint(item)} {...formButton}>
                <FormattedMessage id="delete" defaultMessage="Delete"/>
              </Button>
            ] : []}>
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

        {visible && <TagCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleSave}
        />}
      </React.Fragment>
    );
  }
}

TagList.propTypes = {
  data: PropTypes.array.isRequired,
  createTag: PropTypes.func.isRequired,
  deleteTag: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired
};

export default TagList;