import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// Wrappers
import { HasPermission } from '../../../auth';
import withWidth, { MEDIUM } from '../../../hoc/Width';
import withContext from '../../../hoc/withContext';
// Components
import MultiMapForm from './MultiMapItemForm' 
import { ConfirmButton } from '../../../common/index';
import {MultiMapTemplate} from "./ListTemplates";

class ItemMultiMap extends React.Component {
  state = {
    isModalVisible: false,
    editItem : null,
    error: null
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  deleteItem = item => {
    const {itemName} = this.props;
    this.props.deleteItem(item).then(()=> {
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: `beenDeleted.${itemName}`,
          defaultMessage: `${itemName} has been deleted`
        })
      });
    })

  };

  handleSave = form => {

    form.validateFields().then((values) => {
      
      this.props.updateItem(values)
        .then(()=> {
          this.setState({
            isModalVisible: false,
            editItem: null,
            error: null
          });
        })
        .catch((err)=> {
            this.setState({
                error: err
              });
        })

    });
  };

  render() {
    const { isModalVisible, editItem, error } = this.state;
    const { intl, permissions, width, itemName, items, preferredLanguages, editMode } = this.props;
    const filteredItems = preferredLanguages && preferredLanguages.length > 0 ? items.filter(i => preferredLanguages.includes(i.key)) : items;

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
            dataSource={filteredItems}
            style={{width: "60%"}}
            renderItem={item => (
              <List.Item
                actions={!editMode ? null :[
                  <HasPermission permissions={permissions}>
                      <Button
                    htmlType="button"
                    onClick={() => {
                       this.setState({editItem: item}, this.showModal)
                    }}
                    className="btn-link"
                    type="primary"
                    ghost={true}
                  >
                    <FormattedMessage id="edit" defaultMessage="Edit"/>
                  </Button> | <ConfirmButton
                      title={confirmTitle}
                      btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                      onConfirm={() => this.deleteItem(item)}
                      type={'link'}
                    /> 
                    {/* <ConfirmButton
                      title={confirmTitle}
                      btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                      onConfirm={() => this.deleteItem(item)}
                      type={'link'}
                    /> */}
                  </HasPermission>
                ]}
                style={width < MEDIUM ? { flexDirection: 'column', border: '0px', padding: '4px' } : {border: '0px', padding: '4px'}}
              >
                <List.Item.Meta
                  title={<MultiMapTemplate item={item}/> }
                  
                />
              </List.Item>
            )}
          />
          {editMode && <Row type="flex" justify="space-between" style={{marginTop: '8px'}}>
            <Col xs={12} sm={12} md={16}>
              
            </Col>
            <Col xs={12} sm={12} md={8} className="text-right">
              <HasPermission permissions={permissions}>
                <Button htmlType="button" type="primary" onClick={() => {this.setState({editItem: null}, this.showModal )}}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </HasPermission>
            </Col>
          </Row>}
          <MultiMapForm
            visible={isModalVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
            itemName={itemName}
            item={editItem}
            error={error}
            isMap={true}
          />
        </div>
      </React.Fragment>
    );
  }
}

ItemMultiMap.propTypes = {
  items: PropTypes.array.isRequired,
  createItem: PropTypes.func,
  deleteItem: PropTypes.func,
  updateCounts: PropTypes.func,
  permissions: PropTypes.object.isRequired,
  itemName: PropTypes.string.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(withWidth()(injectIntl(ItemMultiMap)));