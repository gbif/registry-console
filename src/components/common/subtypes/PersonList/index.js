import React from 'react';
import { Button, Col, List, Row } from 'antd';
import { FormattedMessage, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Wrappers
import { HasScope } from '../../../auth';
import withContext from '../../../hoc/withContext';
// Components
import { ConfirmButton } from '../../index';
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
    this.props.deletePerson(item.key).then(() => {
      // Updating persons list
      const { persons } = this.state;
      this.setState({
        persons: persons.filter(person => person.key !== item.key)
      });
      this.props.updateCounts('contacts', persons.length - 1);
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenDeleted.contact',
          defaultMessage: 'Contact has been deleted'
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

      const selectedPerson = JSON.parse(values.person);
      this.props.addPerson(selectedPerson.key).then(() => {
        form.resetFields();
        const { persons } = this.state;
        persons.unshift({
          ...selectedPerson,
          created: new Date(),
          createdBy: this.props.user.userName,
          modified: new Date(),
          modifiedBy: this.props.user.userName
        });

        this.props.updateCounts('contacts', persons.length + 1);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.contact',
            defaultMessage: 'Contact has been saved'
          })
        });

        this.setState({
          persons,
          isModalVisible: false
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
      id: 'delete.confirmation.contact',
      defaultMessage: 'Are you sure to delete this contact?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col xs={12} sm={12} md={16}>
              <h2><FormattedMessage id="contacts" defaultMessage="Contacts"/></h2>
            </Col>
            <Col xs={12} sm={12} md={8} className="text-right">
              <HasScope uuids={uuids}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="addNew" defaultMessage="Add new"/>
                </Button>
              </HasScope>
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
                <Link to={`/person/${item.key}`}>
                  <FormattedMessage id="view" defaultMessage="View"/>
                </Link>,
                <HasScope uuids={uuids}>
                  <ConfirmButton
                    title={confirmTitle}
                    btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                    onConfirm={() => this.deletePerson(item)}
                    link
                  />
                </HasScope>
              ]}>
                <List.Item.Meta
                  title={
                    <React.Fragment>
                      <Link to={`/person/${item.key}`}>
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

          {isModalVisible && (
            <PersonAddForm
              onCancel={this.handleCancel}
              onCreate={this.handleSave}
              contacts={this.state.persons}
            />
          )}
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

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(PersonList));