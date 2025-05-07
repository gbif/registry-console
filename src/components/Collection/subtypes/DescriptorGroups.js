import { Button, Col, Row, Modal } from 'antd';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { DeleteOutlined } from '@ant-design/icons';

// APIs
import { getDescriptorGroup, updateDescriptorGroup, deleteDescriptorGroup } from '../../../api/collection';
import ConfirmButton from '../../common/ConfirmButton';
// Configuration
import { standardColumns } from '../../search/columns';
// Components
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';
import DescriptorGroupForm from './DescriptorGroupForm';
import config from '../../../api/util/config';
import withContext from '../../hoc/withContext';
import SuggestForm from './DescriptorGroup/SuggestForm';
import { canUpdate, canDelete } from '../../../api/permissions';

class DescriptorGroups extends React.Component {
  state = { isModalVisible: false, isEditModalVisible: false, isSuggestionMode: false, activeRecord: null };

  columns = [
    {
      title: <FormattedMessage id="about" defaultMessage="About" />,
      dataIndex: 'title',
      width: '50%',
      render: (text, record) => <div>
        <h4>{text}</h4>
        <div style={{ marginBottom: 12 }}>{record.description}</div>
        <Button type='primary' style={{ marginRight: 8 }}>
          <a href={`${config.dataApi_v1}/grscicoll/collection/${record.collectionKey}/descriptorGroup/${record.key}/export`}>
            <FormattedMessage id="download" defaultMessage="Download" />
          </a>
        </Button>
          <Button type='outline' onClick={() => this.showEditModal({record: record})}>
            <FormattedMessage id="edit" defaultMessage="Edit" />
          </Button>
      </div>
    },
    ...standardColumns
  ];

  showModal = () => {
    const { hasUpdate } = this.props;
    this.setState({ 
      isModalVisible: true, 
      isSuggestionMode: !hasUpdate 
    });
  };
  
  handleCancel = () => {
    this.setState({ 
      isModalVisible: false,
      isEditModalVisible: false,
      isSuggestionMode: false,
      activeRecord: null
    });
  };

  showEditModal = ({record}) => {
    const { hasUpdate } = this.props;
    this.setState({ 
      isEditModalVisible: true, 
      activeRecord: { ...record, type: 'UPDATE' }, 
      groupKey: record.key, 
      isSuggestionMode: !hasUpdate 
    });
  };
  
  handleEditCancel = () => {
    this.setState({ isEditModalVisible: false });
  };

  handleSave = (form, selectedFile) => {
    const { collection, user } = this.props;
    
    form.validateFields().then(async (descriptorGroup) => {

      try {
        // Check if user can edit the collection as a whole
        const hasUpdate = await canUpdate(`grscicoll/collection/${collection.key}`);
        if (!user || !hasUpdate) {
          this.setState({ 
            isModalVisible: true,
            isSuggestionMode: true,
            activeRecord: { ...descriptorGroup, selectedFile, type: 'CREATE' }
          });
          return;
        }

        // If user has permission, create directly
        const fileExtension = selectedFile.name.split('.').pop().toUpperCase();
        this.props.addDescriptorGroup(collection.key, { ...descriptorGroup, selectedFile, format: fileExtension });
        this.setState({ isModalVisible: false });
      } catch (error) {
        this.props.addError({ status: error.response?.status || 400, statusText: error.response?.data || "Failed to create descriptor group" });
      }
    });
  };

  handleUpdate = async (form, selectedFile) => {
    const { collection, user } = this.props;
    const { activeRecord } = this.state;
    
    try {
      // Check if user can edit the collection as a whole
      const hasUpdate = await canUpdate(`grscicoll/collection/${collection.key}`);
      if (!user || !hasUpdate) {
        this.setState({ 
          isEditModalVisible: true,
          isSuggestionMode: true,
          activeRecord: { ...activeRecord, type: 'UPDATE' }
        });
        return;
      }

      // If user has permission, update directly
      const formData = {
        ...form.getFieldsValue(),
        selectedFile: selectedFile || null
      };
      await updateDescriptorGroup(collection.key, activeRecord.key, formData);
      this.props.addSuccess({ statusText: "Descriptor group updated successfully" });
      this.handleCancel();
      this.props.refresh();
    } catch (error) {
      this.props.addError({ status: error.response?.status || 400, statusText: error.response?.data || "Failed to update descriptor group" });
    }
  };

  edit = async (record) => {
    if (!this.props.user) {
      this.setState({ 
        isEditModalVisible: true,
        isSuggestionMode: true,
        activeRecord: { ...record, type: 'UPDATE' }
      });
    } else {
      this.showEditModal({ record });
    }
  }

  delete = async (record) => {
      try {
        // Check if user can delete the specific descriptor group
        const canDeleteGroup = await canDelete(`grscicoll/collection/${record.collectionKey}/descriptorGroup/${record.key}`);
        if (!this.props.user || !canDeleteGroup) {
          this.setState({ 
            isEditModalVisible: true,
            isSuggestionMode: true,
            activeRecord: { ...record, type: 'DELETE' }
          });
          return;
        }

        // If user has permission, delete directly
        await deleteDescriptorGroup(this.props.collection.key, record.key);
        this.props.addSuccess({ statusText: "Descriptor group has been deleted successfully" });
        this.handleCancel();
        this.props.refresh();
      } catch (error) {
        this.props.addError({ status: error.response?.status || 400, statusText: error.response?.data || "Failed to delete descriptor group" });
      }
  }

  handleSuggestion = async (formData) => {
    try {
      await this.props.suggestDescriptorGroup(formData);
      this.handleCancel();
    } catch (error) {
      // Error is already handled in the parent component
    }
  };

  componentDidMount() {
    // Component initialization logic here
  }

  render() {
    const { isModalVisible, isEditModalVisible, activeRecord, isSuggestionMode } = this.state;
    const { collection, initQuery = { limit: 25, offset: 0 } } = this.props;
    const tableColumns = this.columns.concat({
      render: record => (
        <div>
          <ConfirmButton
            title={<div style={{ maxWidth: 400 }}>
              <FormattedMessage
                id="delete.confirmation.deleteCollectionDescriptionGroup"
                defaultMessage="You are removing the descriptor group from the collection. Are you sure you wish to remove this descriptor group from the collection?"
              />
            </div>}
            onConfirm={() => this.delete(record)}
            type={'danger'}
            btnText={<DeleteOutlined />}
          />
        </div>
      )
    });

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <Col span={20}>
            <h2>
              <FormattedMessage id="collectionDescriptorGroups" defaultMessage="Descriptor groups" />
            </h2>
          </Col>
          <Col span={4} className="text-right">
            <Button htmlType="button" type="primary" onClick={() => {
              if (!this.props.user) {
                this.setState({ 
                  isModalVisible: true,
                  isSuggestionMode: true,
                  activeRecord: null
                });
              } else {
                this.showModal();
              }
            }}>
              <FormattedMessage id="add" defaultMessage="Add" />
            </Button>
          </Col>
        </Row>
        <DataQuery
          api={query => getDescriptorGroup(collection.key, query)}
          initQuery={initQuery}
          render={props => <DataTable {...props} noHeader={true} columns={tableColumns} />}
        />

        {isModalVisible && (
          <Modal
            title={<FormattedMessage id="addDescriptorGroup" defaultMessage="Add Descriptor Group" />}
            visible={isModalVisible}
            onCancel={this.handleCancel}
            footer={null}
          >
            {isSuggestionMode ? (
              <SuggestForm 
                collectionKey={collection.key}
                onSuggestion={this.handleSuggestion}
                initialValues={activeRecord}
              />
            ) : (
              <DescriptorGroupForm
                onSave={this.handleSave}
                onCancel={this.handleCancel}
              />
            )}
          </Modal>
        )}

        {isEditModalVisible && (
          <Modal
            title={<FormattedMessage id="editDescriptorGroup" defaultMessage="Edit Descriptor Group" />}
            visible={isEditModalVisible}
            onCancel={this.handleCancel}
            footer={null}
          >
            {isSuggestionMode ? (
              <SuggestForm 
                collectionKey={collection.key}
                onSuggestion={this.handleSuggestion}
                initialValues={activeRecord}
              />
            ) : (
              <DescriptorGroupForm
                initialValues={activeRecord}
                onSave={this.handleUpdate}
                onCancel={this.handleCancel}
                groupKey={activeRecord?.key}
              />
            )}
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

DescriptorGroups.propTypes = {
  collection: PropTypes.object.isRequired,
  addDescriptorGroup: PropTypes.func.isRequired,
  deleteDescriptorGroup: PropTypes.func.isRequired,
  user: PropTypes.object,
  intl: PropTypes.object.isRequired
};

const mapContextToProps = ({ addError, user }) => ({ addError, user });

export default withContext(mapContextToProps)(injectIntl(DescriptorGroups));
