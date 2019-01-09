import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col, Icon, Tooltip } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';
import injectSheet from 'react-jss';

// Wrappers
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';
// Components
import CommentCreateForm from './CommentCreateForm';
import { ConfirmButton } from '../../widgets';

const styles = {
  row: {
    alignItems: 'flex-start'
  },
  comment: {
    whiteSpace: 'pre-line',
    fontWeight: 'normal'
  }
};

class CommentList extends React.Component {
  state = {
    isModalVisible: false,
    comments: this.props.comments || []
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  deleteComment = item => {
    this.props.deleteComment(item.key).then(() => {
      // Updating list
      const { comments } = this.state;
      this.setState({
        comments: comments.filter(el => el.key !== item.key)
      });
      this.props.updateCounts('comments', comments.length - 1);
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenDeleted.comment',
          defaultMessage: 'Comment has been deleted'
        })
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  };

  handleSave = form => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.props.createComment(values).then(response => {
        form.resetFields();

        const { comments } = this.state;
        comments.unshift({
          ...values,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName,
          modified: new Date(),
          modifiedBy: this.props.user.userName
        });
        this.props.updateCounts('comments', comments.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.comment',
            defaultMessage: 'Comment has been saved'
          })
        });

        this.setState({
          isModalVisible: false,
          comments
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
    });
  };

  getComment(comment) {
    return comment.replace(/\n\s*\n/g, '\n');
  }

  render() {
    const { comments, isModalVisible } = this.state;
    const { intl, uuids, classes } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'delete.confirmation.comment',
      defaultMessage: 'Are you sure to delete this comment?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col xs={12} sm={12} md={16}>
              <h2>
                <FormattedMessage id="comments" defaultMessage="Comments"/>

                <Tooltip title={
                  <FormattedMessage
                    id="help.orgCommentsInfo"
                    defaultMessage="Comments allow administrators to leave context about communications with publishers etc."
                  />
                }>
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </h2>
            </Col>
            <Col xs={12} sm={12} md={8} className="text-right">
              <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>

          <List
            itemLayout="horizontal"
            className="custom-list"
            dataSource={comments}
            header={
              comments.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}}`}
                values={{ formattedNumber: <FormattedNumber value={comments.length}/>, count: comments.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item className={classes.row} actions={[
                <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmButton
                    title={confirmTitle}
                    btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                    onConfirm={() => this.deleteComment(item)}
                    link
                  />
                </PermissionWrapper>
              ]}>
                <List.Item.Meta
                  title={<span className={classes.comment}>
                    {this.getComment(item.content)}
                  </span>}
                  description={
                    <span className="item-description">
                        <FormattedMessage
                          id="createdByRow"
                          defaultMessage={`Created {date} by {author}`}
                          values={{ date: <FormattedRelative value={item.created}/>, author: item.createdBy }}
                        />
                      </span>
                  }
                />
              </List.Item>
            )}
          />

          <CommentCreateForm
            visible={isModalVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />
        </div>
      </React.Fragment>
    );
  }
}

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  createComment: PropTypes.func,
  deleteComment: PropTypes.func,
  updateCounts: PropTypes.func,
  uuids: PropTypes.array.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(injectSheet(styles)(CommentList)));