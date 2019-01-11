import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';

// Wrappers
import { HasScope } from '../../../auth';
import withContext from '../../../hoc/withContext';
// Components
import TagCreateForm from './TagCreateForm';
import { ConfirmButton } from '../../index';

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
      id: 'delete.confirmation.tag',
      defaultMessage: 'Are you sure to delete this tag?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col xs={12} sm={12} md={16}>
              <h2><FormattedMessage id="tags" defaultMessage="Tags"/></h2>
            </Col>
            <Col xs={12} sm={12} md={8} className="text-right">
              <HasScope uuids={uuids}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </HasScope>
            </Col>
          </Row>

          <List
            className="custom-list"
            itemLayout="horizontal"
            dataSource={tags}
            header={
              tags.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}}`}
                values={{ formattedNumber: <FormattedNumber value={tags.length}/>, count: tags.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item actions={[
                <HasScope uuids={uuids}>
                  <ConfirmButton
                    title={confirmTitle}
                    btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                    onConfirm={() => this.deleteTag(item)}
                    link
                  />
                </HasScope>
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