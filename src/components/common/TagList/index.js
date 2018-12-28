import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';

// Wrappers
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';
// Components
import TagCreateForm from './TagCreateForm';
import { ConfirmDeleteControl } from '../../widgets';

class TagList extends React.Component {
  state = {
    visible: false,
    tags: this.props.data || []
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
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
        this.props.update('tags', tags.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.tag',
            defaultMessage: 'Tag has been saved'
          })
        });

        this.setState({
          visible: false,
          tags
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });

    });
  };

  render() {
    const { tags, visible } = this.state;
    const { intl, uid } = this.props;
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
              <PermissionWrapper uid={uid} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
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
                values={{ resultCount: tags.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item actions={[
                <PermissionWrapper uid={uid} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
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
            visible={visible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />
        </div>
      </React.Fragment>
    );
  }
}

TagList.propTypes = {
  data: PropTypes.array.isRequired,
  createTag: PropTypes.func,
  deleteTag: PropTypes.func,
  update: PropTypes.func,
  uid: PropTypes.array.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(TagList));