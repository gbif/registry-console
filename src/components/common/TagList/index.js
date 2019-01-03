import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';

// Wrappers
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';
// Components
import TagCreateForm from './TagCreateForm';
import { ConfirmDeleteControl } from '../../widgets';

class TagList extends React.Component {
  state = {
    isModalVisible: false,
    tags: this.props.tags || []
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  deleteTag = item => {
    this.props.deleteTag(item.key).then(() => {
      // Updating tags
      const { tags } = this.state;
      this.setState({
        tags: tags.filter(el => el.key !== item.key)
      });
      this.props.updateCounts('tags', tags.length - 1);
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenDeleted.tag',
          defaultMessage: 'Tag has been deleted'
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

      this.props.createTag(values).then(response => {
        form.resetFields();

        const { tags } = this.state;
        tags.unshift({
          ...values,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName
        });
        this.props.updateCounts('tags', tags.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.tag',
            defaultMessage: 'Tag has been saved'
          })
        });

        this.setState({
          isModalVisible: false,
          tags
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });

    });
  };

  render() {
    const { tags, isModalVisible } = this.state;
    const { intl, uuids } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.tag',
      defaultMessage: 'Are you sure delete this tag?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col md={16} sm={12}>
              <h2><FormattedMessage id="tags" defaultMessage="Tags"/></h2>
            </Col>
            <Col md={8} sm={12} className="text-right">
              <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>

          <List
            className="custom-list"
            itemLayout="horizontal"
            dataSource={tags}
            header={
              tags.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{resultCount} {resultCount, plural,
                    zero {results}
                    one {result}
                    other {results}
                  }
                `}
                values={{ resultCount: <FormattedNumber value={tags.length}/> }}
              />) : null
            }
            renderItem={item => (
              <List.Item actions={[
                <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteTag(item)}/>
                </PermissionWrapper>
              ]}>
                <List.Item.Meta
                  title={<span className="item-title">{item.value}</span>}
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

          <TagCreateForm
            visible={isModalVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />
        </div>
      </React.Fragment>
    );
  }
}

TagList.propTypes = {
  tags: PropTypes.array.isRequired,
  createTag: PropTypes.func,
  deleteTag: PropTypes.func,
  updateCounts: PropTypes.func,
  uuids: PropTypes.array.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(TagList));