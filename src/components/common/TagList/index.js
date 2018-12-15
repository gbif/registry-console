import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Button, Row, notification } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';

import TagCreateForm from './TagCreateForm';
import TagPresentation from './TagPresentation';
import { ConfirmDeleteControl } from '../../controls';
import PermissionWrapper from '../../hoc/PermissionWrapper';

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

  deleteTag = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteTag(item.key).then(() => {
        // Updating endpoints list
        const list = this.state.list;
        this.setState({
          list: list.filter(el => el.key !== item.key)
        });
        this.props.update('tags', list.length - 1);
        notification.success({
          message: this.props.intl.formatMessage({
            id: 'beenDeleted.tag',
            defaultMessage: 'Tag has been deleted'
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
        notification.success({
          message: this.props.intl.formatMessage({
            id: 'beenSaved.tag',
            defaultMessage: 'Tag has been saved'
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
      id: 'deleteMessage.tag',
      defaultMessage: 'Are you sure delete this tag?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <h1><FormattedMessage id="organizationTags" defaultMessage="Organization tags"/></h1>

            <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
              <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                <FormattedMessage id="createNew" defaultMessage="Create new"/>
              </Button>
            </PermissionWrapper>
          </Row>

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
        </div>
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

export default injectIntl(TagList);