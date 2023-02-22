import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Row, Col } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// Wrappers
import { HasPermission } from '../../../auth';
import withWidth, { MEDIUM } from '../../../hoc/Width';
import withContext from '../../../hoc/withContext';
// Components
import ItemCreateForm from './ItemCreateForm';
import ItemUpdateForm from './ItemUpdateForm';
import { ConfirmButton } from '../../../common/index';
import {LabelListTemplate, DefinitionListTemplate} from "./ListTemplates";

class ItemMap extends React.Component {
  state = {
    isModalVisible: false,
    isUpdateModalVisible: false,
    selectedItem: null,
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  showUpdateModal = item => {
    this.setState({ selectedItem: item, isUpdateModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  handleUpdateCancel = () => {
    this.setState({ isUpdateModalVisible: false, selectedItem: null });
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

  };

  updateItem = (form, item) => {
    const {itemName} = this.props;

    form.validateFields().then((values) => {
      this.props.updateItem(item).then(()=> {
        this.setState({
          isUpdateModalVisible: false
        });
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: `beenDeleted.${itemName}`,
            defaultMessage: `${itemName} has been deleted`
          })
        });
      })
      .catch(err => this.setState({error: err}))
      }); 
  };

  handleSave = form => {

    form.validateFields().then(( values) => {
      

      this.props.createItem(values)
        .then(()=> {
          this.setState({
            isModalVisible: false
          });
        })
        .catch(err => this.setState({error: err}))

    });
  };

  render() {
    const { isModalVisible, isUpdateModalVisible, error, selectedItem } = this.state;
    const { intl, permissions, width, itemName, items, preferredLanguages, editMode, isUpdate } = this.props;
    const filteredItems = preferredLanguages && preferredLanguages.length > 0 ? items.filter(i => preferredLanguages.includes(i.language)) : items;

    const confirmTitle = intl.formatMessage({
      id: `delete.confirmation.${itemName}`,
      defaultMessage: `Are you sure to delete this ${itemName}?`
    });

    return (
      <React.Fragment>
        <div className="item-details">
        {/* <Row type="flex" justify="space-between">
            <Col xs={12} sm={12} md={16}>
              <h2>
                <FormattedMessage id="machineTags" defaultMessage="Machine tags"/>

                <Tooltip title={
                  <FormattedMessage
                    id="help.orgMachineTagsInfo"
                    defaultMessage="Machine tags are intended for applications to store information about an entity. A machine tag is essentially a name/value pair, that is categorised in a namespace. The 3 parts may be used as the application sees fit."
                  />
                }>
                  <QuestionCircleOutlined />
                </Tooltip>
              </h2>
            </Col>

            <Col xs={12} sm={12} md={8} className="text-right">
              <HasAccess fn={this.props.canCreate}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </HasAccess>
            </Col>
          </Row> */}

          <List
            className="vocab-list"
            itemLayout="horizontal"
            dataSource={filteredItems}
            style={{width: "60%"}}
            renderItem={item => (
              <List.Item
                actions={!editMode ? null :[
                  <HasPermission permissions={permissions}>
                    <ConfirmButton
                      title={confirmTitle}
                      btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                      onConfirm={() => this.deleteItem(item)}
                      type={'link'}
                    />

                    {isUpdate && <Row type="flex" justify="space-between" style={{marginTop: '8px'}}>
                      <Col xs={12} sm={12} md={12}>
                        </Col>
                        <Col xs={12} sm={12} md={12} className="text-right">
                            <Button htmlType="button" type="link" onClick={() => this.showUpdateModal(item)}>
                              <FormattedMessage id="update" defaultMessage="Update"/>
                            </Button>
                        </Col>
                      </Row>}                      
                      <ItemUpdateForm
                        visible={isUpdateModalVisible}            
                        onCancel={this.handleUpdateCancel}
                        item={selectedItem}
                        itemName={itemName}
                        onSave={this.updateItem}
                      />
                  </HasPermission>                  
                ]}
                style={width < MEDIUM ? { flexDirection: 'column', border: '0px', padding: '4px' } : {border: '0px', padding: '4px'}}
              >
                <List.Item.Meta
                  title={itemName === 'label' ? <LabelListTemplate item={item}/> : <DefinitionListTemplate item={item} />}
                  
                />
              </List.Item>
            )}
          />
          {editMode && <Row type="flex" justify="space-between" style={{marginTop: '8px'}}>
            <Col xs={12} sm={12} md={16}>
              
            </Col>
            <Col xs={12} sm={12} md={8} className="text-right">
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
            isMap={true}
            error={error}
          />
        </div>
      </React.Fragment>
    );
  }
}

ItemMap.propTypes = {
  items: PropTypes.array.isRequired,
  createItem: PropTypes.func,
  deleteItem: PropTypes.func,
  updateCounts: PropTypes.func,
  permissions: PropTypes.object.isRequired,
  itemName: PropTypes.string.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(withWidth()(injectIntl(ItemMap)));