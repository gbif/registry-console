import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Button, Row, notification } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';

import CommentCreateForm from './CommentCreateForm';
import CommentPresentation from './CommentPresentation';
import { ConfirmDeleteControl } from '../../controls';
import PermissionWrapper from '../../hoc/PermissionWrapper';

class CommentList extends React.Component {
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

  deleteComment = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteComment(item.key).then(() => {
        // Updating list
        const { list } = this.state;
        this.setState({
          list: list.filter(el => el.key !== item.key)
        });
        this.props.update('comments', list.length - 1);
        notification.success({
          message: this.props.intl.formatMessage({
            id: 'beenDeleted.comment',
            defaultMessage: 'Comment has been deleted'
          })
        });

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

      this.props.createComment(values).then(response => {
        form.resetFields();

        const list = this.state.list;
        list.unshift({
          ...values,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName,
          modified: new Date(),
          modifiedBy: this.props.user.userName
        });
        this.props.update('comments', list.length);
        notification.success({
          message: this.props.intl.formatMessage({
            id: 'beenSaved.comment',
            defaultMessage: 'Comment has been saved'
          })
        });

        this.setState({
          editVisible: false,
          list
        });
      });
    });
  };

  render() {
    const { list, editVisible, detailsVisible, selectedItem } = this.state;
    const { intl } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.comment',
      defaultMessage: 'Are you sure delete this comment?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <h1><FormattedMessage id="organizationComments" defaultMessage="Organization comments"/></h1>

            <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
              <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                <FormattedMessage id="createNew" defaultMessage="Create new"/>
              </Button>
            </PermissionWrapper>
          </Row>
          <p className="help">
            <small>
              <FormattedMessage
                id="orgCommentsInfo"
                defaultMessage="Comments allow administrators to leave context about communications with publishers etc."
              />
            </small>
          </p>

          <List
            itemLayout="horizontal"
            dataSource={list}
            renderItem={item => (
              <List.Item actions={[
                <Button htmlType="button" onClick={() => this.showDetails(item)} className="btn-link" type="primary"
                        ghost={true}>
                  <FormattedMessage id="details" defaultMessage="Details"/>
                </Button>,
                <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteComment(item)}/>
                </PermissionWrapper>
              ]}>
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

          {editVisible && <CommentCreateForm
            wrappedComponentRef={this.saveFormRef}
            visible={editVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />}

          {detailsVisible && <CommentPresentation
            visible={detailsVisible}
            onCancel={this.handleCancel}
            data={selectedItem}
          />}
        </div>
      </React.Fragment>
    );
  }
}

CommentList.propTypes = {
  data: PropTypes.array.isRequired,
  createComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  user: PropTypes.object,
  update: PropTypes.func.isRequired
};

export default injectIntl(CommentList);