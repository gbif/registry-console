import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';

import IdentifierCreateForm from './IdentifierCreateForm';
import { ConfirmDeleteControl } from '../../widgets';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';

class IdentifierList extends React.Component {
  state = {
    visible: false,
    identifiers: this.props.data || []
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
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
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data })
    });
  };

  handleSave = form => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.props.createIdentifier(values).then(response => {
        form.resetFields();

        const { identifiers } = this.state;
        identifiers.unshift({
          ...values,
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
          visible: false,
          identifiers
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data })
      });
    });
  };

  render() {
    const { identifiers, visible } = this.state;
    const { intl, uid } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.identifier',
      defaultMessage: 'Are you sure delete this identifier?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col md={16} sm={12}>
              <h2><FormattedMessage id="identifiers" defaultMessage="Identifiers"/></h2>
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
            dataSource={identifiers}
            header={
              identifiers.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{resultCount} {resultCount, plural,
                    zero {results}
                    one {result}
                    other {results}
                  }
                `}
                values={{ resultCount: <FormattedNumber value={identifiers.length}/> }}
              />) : null
            }
            renderItem={item => (
              <List.Item actions={[
                <PermissionWrapper uid={uid} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteIdentifier(item)}/>
                </PermissionWrapper>
              ]}>
                  <List.Item.Meta
                    title={
                      <React.Fragment>
                        <strong className="item-title">{item.identifier}</strong>
                        <span className="item-type">{item.type}</span>
                      </React.Fragment>
                    }
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

          <IdentifierCreateForm
            visible={visible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />
        </div>
      </React.Fragment>
    );
  }
}

IdentifierList.propTypes = {
  data: PropTypes.array.isRequired,
  createIdentifier: PropTypes.func,
  deleteIdentifier: PropTypes.func,
  update: PropTypes.func,
  uid: PropTypes.array.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(IdentifierList));