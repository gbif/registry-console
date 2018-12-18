import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';

import TagCreateForm from './TagCreateForm';
import TagPresentation from './TagPresentation';
import { ConfirmDeleteControl } from '../../widgets';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';

class TagList extends React.Component {
  state = {
    editVisible: false,
    detailsVisible: false,
    selectedItem: null,
    item: this.props.data,
    tags: this.props.data.tags
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

  handleCancel = () => {
    this.setState({
      editVisible: false,
      detailsVisible: false,
      selectedItem: null
    });
  };

  deleteTag = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteTag(item.key).then(() => {
        // Updating tags
        const { tags } = this.state;
        this.setState({
          tags: tags.filter(el => el.key !== item.key)
        });
        this.props.update('tags', tags.length - 1);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenDeleted.tag',
            defaultMessage: 'Tag has been deleted'
          })
        });

        resolve();
      }).catch(reject);
    }).catch(() => console.log('Oops errors!'));
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
        this.props.update('tags', tags.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.tag',
            defaultMessage: 'Tag has been saved'
          })
        });

        this.setState({
          editVisible: false,
          tags
        });
      });

    });
  };

  render() {
    const { tags, item, editVisible, detailsVisible, selectedItem } = this.state;
    const { intl } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.tag',
      defaultMessage: 'Are you sure delete this tag?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <span className="help">{item.title}</span>
              <h2><FormattedMessage id="tags" defaultMessage="Tags"/></h2>
            </Col>
            <Col span={4}>
              <PermissionWrapper item={item} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>

          <List
            itemLayout="horizontal"
            dataSource={tags}
            renderItem={item => (
              <List.Item actions={[
                <Button htmlType="button" onClick={() => this.showDetails(item)} className="btn-link" type="primary"
                        ghost={true}>
                  <FormattedMessage id="details" defaultMessage="Details"/>
                </Button>,
                <PermissionWrapper item={item} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteTag(item)}/>
                </PermissionWrapper>
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
            visible={editVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />}

          {detailsVisible && <TagPresentation
            visible={detailsVisible}
            onCancel={this.handleCancel}
            data={selectedItem}
          />}
        </div>
      </React.Fragment>
    );
  }
}

TagList.propTypes = {
  data: PropTypes.object.isRequired,
  createTag: PropTypes.func.isRequired,
  deleteTag: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired
};

const mapContextToProps = ({ user, addSuccess }) => ({ user, addSuccess });

export default withContext(mapContextToProps)(injectIntl(TagList));