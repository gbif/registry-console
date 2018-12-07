import React from 'react';
import { withRouter } from 'react-router-dom';
import { List, Skeleton, Modal, Button, Spin, Row } from 'antd';
import { FormattedRelative, FormattedMessage } from 'react-intl';

import { createComment, deleteComment, getOrganizationComments } from '../../../api/organization';
import { prepareData } from '../../../api/util/helpers';
import CommentCreateForm from './CommentCreateForm';

const confirm = Modal.confirm;
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

class CommentList extends React.Component {
  state = {
    list: [],
    visible: false,
    loading: true
  };

  componentDidMount() {
    // Requesting list of endpoints of Organization
    const { key } = this.props.match.params;
    getOrganizationComments(key).then(response => {
      this.setState({
        list: response.data,
        loading: false
      });
    });
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  deleteComment = item => {
    const { key } = this.props.match.params;
    // I have never liked assigning THIS to SELF (((
    const self = this;

    confirm({
      title: <FormattedMessage id="titleDeleteComment" defaultMessage="Do you want to delete this comment?"/>,
      content: <FormattedMessage id="deleteCommentMessage" defaultMessage="Are you really want to delete comment?"/>,
      onOk() {
        return new Promise((resolve, reject) => {
          deleteComment(key, item.key).then(() => {
            // Updating endpoints list
            const { list } = self.state;
            self.setState({
              list: list.filter(el => el.key !== item.key)
            });
            self.props.update('comments', list.length - 1);

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

      const { key } = this.props.match.params;
      const preparedData = prepareData(values);

      createComment(key, preparedData).then(response => {
        form.resetFields();

        const list = this.state.list;
        list.unshift({
          ...preparedData,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName,
          modified: new Date(),
          modifiedBy: this.props.user.userName
        });
        this.props.update('comments', list.length);

        this.setState({
          visible: false,
          list
        });
      });
    });
  };

  render() {
    const { list, loading, visible } = this.state;
    const user = this.props.user;

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <h1><FormattedMessage id="organizationComments" defaultMessage="Organization comments"/></h1>
          {!loading && user ?
            <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Button>
            : null}
        </Row>

        {loading && <Spin size="large"/>}

        {!loading ?
          <List
            itemLayout="horizontal"
            dataSource={list}
            renderItem={item => (
              <List.Item actions={user ? [
                <Button htmlType="button" onClick={() => this.deleteComment(item)} {...formButton}>
                  <FormattedMessage id="delete" defaultMessage="Delete"/>
                </Button>
              ] : []}>
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={item.content}
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
          : null}

        {visible && <CommentCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleSave}
        />}
      </React.Fragment>
    );
  }
}

export default withRouter(CommentList);