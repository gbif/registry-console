import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';

import { prepareData } from '../../../api/util/helpers';
import IdentifierCreateForm from './IdentifierCreateForm';
import IdentifierPresentation from './IdentifierPresentation';
import { ConfirmDeleteControl } from '../../widgets';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';

class IdentifierList extends React.Component {
  state = {
    editVisible: false,
    detailsVisible: false,
    selectedItem: null,
    item: this.props.data,
    identifiers: this.props.data.identifiers
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

  deleteIdentifier = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteIdentifier(item.key).then(() => {
        // Updating identifiers
        const { identifiers } = this.state;
        this.setState({
          identifiers: identifiers.filter(el => el.key !== item.key)
        });
        this.props.update('identifiers', identifiers.length - 1);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenDeleted.identifier',
            defaultMessage: 'Identifier has been deleted'
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

      const preparedData = prepareData(values);

      this.props.createIdentifier(preparedData).then(response => {
        form.resetFields();

        const { identifiers } = this.state;
        identifiers.unshift({
          ...preparedData,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName
        });
        this.props.update('identifiers', identifiers.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.identifier',
            defaultMessage: 'Identifier has been saved'
          })
        });

        this.setState({
          editVisible: false,
          identifiers
        });
      });
    });
  };

  render() {
    const { identifiers, item, editVisible, detailsVisible, selectedItem } = this.state;
    const { intl } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.identifier',
      defaultMessage: 'Are you sure delete this identifier?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <span className="help">{item.title}</span>
              <h2><FormattedMessage id="identifiers" defaultMessage="Identifiers"/></h2>
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
            dataSource={identifiers}
            renderItem={item => (
              <List.Item actions={[
                <Button htmlType="button" onClick={() => this.showDetails(item)} className="btn-link" type="primary"
                        ghost={true}>
                  <FormattedMessage id="details" defaultMessage="Details"/>
                </Button>,
                <PermissionWrapper item={item} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteIdentifier(item)}/>
                </PermissionWrapper>
              ]}>
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={
                      <React.Fragment>
                        <strong className="item-title">{item.identifier}</strong>
                        <span className="item-type">{item.type}</span>
                      </React.Fragment>
                    }
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

          {editVisible && <IdentifierCreateForm
            visible={editVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />}

          {detailsVisible && <IdentifierPresentation
            visible={detailsVisible}
            onCancel={this.handleCancel}
            data={selectedItem}
          />}
        </div>
      </React.Fragment>
    );
  }
}

IdentifierList.propTypes = {
  data: PropTypes.object.isRequired,
  createIdentifier: PropTypes.func.isRequired,
  deleteIdentifier: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired
};

const mapContextToProps = ({ user, addSuccess }) => ({ user, addSuccess });

export default withContext(mapContextToProps)(injectIntl(IdentifierList));