import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col } from 'antd';
import { FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';

// Wrappers
import { HasScope } from '../../../auth';
import withWidth, { MEDIUM } from '../../../hoc/Width';
import withContext from '../../../hoc/withContext';
// Components
import IdentifierCreateForm from './IdentifierCreateForm';
import { ConfirmButton, FormattedRelativeDate } from '../../index';

class IdentifierList extends React.Component {
  state = {
    isModalVisible: false,
    identifiers: this.props.identifiers || []
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  deleteIdentifier = item => {
    this.props.deleteIdentifier(item.key).then(() => {
      // Updating identifiers
      const { identifiers } = this.state;
      this.setState({
        identifiers: identifiers.filter(el => el.key !== item.key)
      });
      this.props.updateCounts('identifiers', identifiers.length - 1);
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenDeleted.identifier',
          defaultMessage: 'Identifier has been deleted'
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

      this.props.createIdentifier(values).then(response => {
        form.resetFields();

        const { identifiers } = this.state;
        identifiers.unshift({
          ...values,
          key: response.data,
          created: new Date().toISOString(),
          createdBy: this.props.user.userName
        });
        this.props.updateCounts('identifiers', identifiers.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.identifier',
            defaultMessage: 'Identifier has been saved'
          })
        });

        this.setState({
          isModalVisible: false,
          identifiers
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
    });
  };

  render() {
    const { identifiers, isModalVisible } = this.state;
    const { intl, uuids, width } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'delete.confirmation.identifier',
      defaultMessage: 'Are you sure to delete this identifier?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col xs={12} sm={12} md={16}>
              <h2><FormattedMessage id="identifiers" defaultMessage="Identifiers"/></h2>
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
            dataSource={identifiers}
            header={
              identifiers.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}}`}
                values={{ formattedNumber: <FormattedNumber value={identifiers.length}/>, count: identifiers.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item
                actions={[
                  <HasScope uuids={uuids}>
                    <ConfirmButton
                      title={confirmTitle}
                      btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                      onConfirm={() => this.deleteIdentifier(item)}
                      link
                    />
                  </HasScope>
                ]}
                style={width < MEDIUM ? { flexDirection: 'column' } : {}}
              >
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
                          values={{ date: <FormattedRelativeDate value={item.created}/>, author: item.createdBy }}
                        />
                      </span>
                  }
                />
              </List.Item>
            )}
          />

          <IdentifierCreateForm
            visible={isModalVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />
        </div>
      </React.Fragment>
    );
  }
}

IdentifierList.propTypes = {
  identifiers: PropTypes.array.isRequired,
  createIdentifier: PropTypes.func,
  deleteIdentifier: PropTypes.func,
  updateCounts: PropTypes.func,
  uuids: PropTypes.array.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(withWidth()(injectIntl(IdentifierList)));