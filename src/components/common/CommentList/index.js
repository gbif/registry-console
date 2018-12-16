import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Button, Row, notification, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';

import CommentCreateForm from './CommentCreateForm';
import { ConfirmDeleteControl } from '../../widgets';
import PermissionWrapper from '../../hoc/PermissionWrapper';

const styles = {
  comment: {
    whiteSpace: 'pre-line'
  }
};

class CommentList extends React.Component {
  state = {
    list: this.props.data || [],
    visible: false
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  /**
   * I took this implementation from the official documentation, From Section
   * https://ant.design/components/form/
   * Please, check the part "Form in Modal toCreate"
   */
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  handleCancel = () => {
    this.setState({ visible: false });
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
          visible: false,
          list
        });
      });
    });
  };

  render() {
    const { list, visible } = this.state;
    const { intl, classes, title } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.comment',
      defaultMessage: 'Are you sure delete this comment?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <span className="help">{title}</span>
              <h2><FormattedMessage id="comments" defaultMessage="Comments"/></h2>
            </Col>
            <Col span={4}>
              <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>
          <p className="help">
            <FormattedMessage
              id="orgCommentsInfo"
              defaultMessage="Comments allow administrators to leave context about communications with publishers etc."
            />
          </p>

          <List
            itemLayout="horizontal"
            dataSource={list}
            renderItem={item => (
              <List.Item actions={[
                <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteComment(item)}/>
                </PermissionWrapper>
              ]}>
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={<span className={classes.comment}>{item.content}</span>}
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

          {/*
            If you want to get ref after Form.create, you can use wrappedComponentRef provided by rc-form
            https://github.com/react-component/form#note-use-wrappedcomponentref-instead-of-withref-after-rc-form140
          */}
          {visible && <CommentCreateForm
            wrappedComponentRef={this.saveFormRef}
            visible={visible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
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

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(injectSheet(styles)(injectIntl(CommentList)));