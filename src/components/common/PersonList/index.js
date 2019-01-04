import React from 'react';
import { Button, Col, List, Row } from 'antd';
import { FormattedMessage, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

// Wrappers
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';
// Components
import { Link } from 'react-router-dom';
import { ConfirmDeleteControl } from '../../widgets';
import PersonAddForm from './PersonAddForm';

class PersonList extends React.Component {
  state = {
    isModalVisible: false,
    persons: this.props.persons || []
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  deletePerson = item => {
    console.log('item:', item);
  };

  handleSave = form => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.props.addPerson(values).then(response => {
        form.resetFields();
        console.log(response);
        const { persons } = this.state;

        this.props.updateCounts('contacts', persons.length + 1);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.contact',
            defaultMessage: 'Contact has been saved'
          })
        });

        this.setState({
          isEditModalVisible: false
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
    });
  };

  render() {
    const { persons, isModalVisible } = this.state;
    const { intl, uuids } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.contact',
      defaultMessage: 'Are you sure delete this contact?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col md={16} sm={12}>
              <h2><FormattedMessage id="contacts" defaultMessage="Contacts"/></h2>
            </Col>
            <Col md={8} sm={12} className="text-right">
              <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="addNew" defaultMessage="Add new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>

          <List
            className="custom-list"
            itemLayout="horizontal"
            dataSource={persons}
            header={
              persons.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}}`}
                values={{ formattedNumber: <FormattedNumber value={persons.length}/>, count: persons.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item actions={[
                <Link to={`/grbio/person/${item.key}`} target="_blank">
                  <FormattedMessage id="view" defaultMessage="View"/>
                </Link>,
                <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deletePerson(item)}/>
                </PermissionWrapper>
              ]}>
                <List.Item.Meta
                  title={
                    <React.Fragment>
                      <Link to={`/grbio/person/${item.key}`} target="_blank">
                        {item.firstName} {item.lastName}
                      </Link>
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

          <PersonAddForm
            visible={isModalVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />
        </div>
      </React.Fragment>
    );
  }
}

PersonList.propTypes = {
  persons: PropTypes.array,
  addPerson: PropTypes.func,
  deletePerson: PropTypes.func,
  updateCounts: PropTypes.func,
  uuids: PropTypes.array.isRequired
};

const mapContextToProps = ({ addSuccess, addError }) => ({ addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(PersonList));