import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// Wrappers
import { HasPermission } from '../../../auth';
import withWidth, { MEDIUM } from '../../../hoc/Width';
import withContext from '../../../hoc/withContext';
// Components
import ItemCreateForm from './ItemCreateForm';
import { ConfirmButton } from '../../../common/index';

class ItemList extends React.Component {
  state = {
    isModalVisible: false
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  deleteItem = item => {
    const {itemName} = this.props;
    this.props.deleteItem(item.key).then(()=> {
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: `beenDeleted.${itemName}`,
          defaultMessage: `${itemName} has been deleted`
        })
      });
    })
    
/*     .then(() => {
      // Updating items
      const { items } = this.state;
      this.setState({
        items: items.filter(el => el.key !== item.key)
      });
      this.props.updateCounts(itemName, items.length - 1);
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: `beenDeleted.${itemName}`,
          defaultMessage: `${itemName} has been deleted`
        })
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    }); */
  };

  handleSave = form => {
    const { addError } = this.props;
    form.validateFields().then((values) => {

      this.props.createItem(values)
        .then(()=> {
          this.setState({
            isModalVisible: false
          });
        })
        .catch(err => {
          console.log(err)
          addError(err)})

    });
  };

  render() {
    const { isModalVisible } = this.state;
    const { intl, permissions, width, itemName, items, editMode } = this.props;
    const confirmTitle = intl.formatMessage({
      id: `delete.confirmation.${itemName}`,
      defaultMessage: `Are you sure to delete this ${itemName}?`
    });

    return (
      <React.Fragment>
        <div className="item-details" style={{marginLeft: '-4px', marginTop: '-2px'}}>
          
          <List
            className="vocab-list"
            itemLayout="horizontal"
            dataSource={items}
            style={{width: "60%"}}
            renderItem={item => (
              <List.Item
                actions={!editMode ? null : [
                  <HasPermission permissions={permissions}>
                    <ConfirmButton
                      title={confirmTitle}
                      btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                      onConfirm={() => this.deleteItem(item)}
                      type={'link'}
                    />
                  </HasPermission>
                ]}
                style={width < MEDIUM ? { flexDirection: 'column', border: '0px', padding: '4px' } : {border: '0px', padding: '4px'}}
              >
                <List.Item.Meta
                  title={item.value}
                  
                />
              </List.Item>
            )}
          />
        { editMode && <Row type="flex" justify="space-between" style={{marginTop: '8px'}}>
            <Col xs={12} sm={12} md={16}>
            </Col>
            <Col  className="text-right">
              <HasPermission permissions={permissions}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </HasPermission>
            </Col>
          </Row>}
          <ItemCreateForm
            visible={isModalVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
            itemName={itemName}
          />
        </div>
      </React.Fragment>
    );
  }
}

ItemList.propTypes = {
  items: PropTypes.array.isRequired,
  createItem: PropTypes.func,
  deleteItem: PropTypes.func,
  updateCounts: PropTypes.func,
  permissions: PropTypes.object.isRequired,
  itemName: PropTypes.string.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(withWidth()(injectIntl(ItemList)));