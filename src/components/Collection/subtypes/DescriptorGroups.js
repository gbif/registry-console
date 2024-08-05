import { Button, Col, Row } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { DeleteOutlined } from '@ant-design/icons';

// APIs
import { getDescriptorGroup } from '../../../api/collection';
import { canUpdate, canDelete, checkPermissions } from '../../../api/permissions';
import ConfirmButton from '../../common/ConfirmButton';
// Configuration
import { standardColumns } from '../../search/columns';
// Wrappers
import { HasAccess } from '../../auth';
// Components
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';
import DescriptorGroupForm from './DescriptorGroupForm';
import config from '../../../api/util/config';
import { toLocaleString } from 'react-intl/locale-data';
import withContext from '../../hoc/withContext';

class DescriptorGroups extends React.Component {
  state = { isModalVisible: false };

  columns = [
    {
      title: <FormattedMessage id="about" defaultMessage="About" />,
      dataIndex: 'title',
      width: '50%',
      render: (text, record) => <div>
        <h4>{text}</h4>
        <div style={{ marginBottom: 12 }}>{record.description}</div>
        <Button type='primary' style={{ marginRight: 8 }}>
          <a href={`${config.dataApi_v1}/grscicoll/collection/${record.collectionKey}/descriptorGroup/${record.key}/export?format=CSV`}>
            <FormattedMessage id="download" defaultMessage="Download" />
          </a>
        </Button>
        {/* we are checking for deletion because the can edit isn't really working. It seem to require doing empty form posts */}
        <HasAccess fn={() => canDelete(`grscicoll/collection/${record.collectionKey}/descriptorGroup/${record.key}`)}>
          <Button type='outline' onClick={() => this.showEditModal({record: record})}>
            <FormattedMessage id="edit" defaultMessage="Edit" />
          </Button>
        </HasAccess>
      </div>
    },
    ...standardColumns
  ];

  showModal = () => {
    this.setState({ isModalVisible: true });
  };
  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  showEditModal = ({record}) => {
    this.setState({ isEditModalVisible: true, activeRecord: record, groupKey: record.key });
  };
  handleEditCancel = () => {
    this.setState({ isEditModalVisible: false });
  };

  handleDelete = key => {
    this.props.deleteDescriptorGroup(this.props.collection.key, key);
  };

  handleSave = (form, selectedFile) => {
    form.validateFields().then((descriptorGroup) => {
      const fileExtension = selectedFile.name.split('.').pop().toUpperCase();
      this.props.addDescriptorGroup(this.props.collection.key, { ...descriptorGroup, selectedFile, format: fileExtension });
      this.setState({ isModalVisible: false });
    });
  };

  handleUpdate = (form, selectedFile, groupKey) => {
    form.validateFields().then((descriptorGroup) => {
      if (!descriptorGroup.title || !descriptorGroup.description || !descriptorGroup.descriptorsFile) {
        this.props.addError({ status: 401, statusText: 'Please fill the form' });
        return;
      }
      const fileExtension = selectedFile.name.split('.').pop().toUpperCase();
      this.props.updateDescriptorGroup(this.props.collection.key, { ...descriptorGroup, selectedFile, format: fileExtension, key: groupKey });
      this.setState({ groupKey: null, isEditModalVisible: false });
    });
  };

  render() {
    const { isModalVisible, isEditModalVisible, activeRecord } = this.state;
    const { collection, initQuery = { limit: 25, offset: 0 } } = this.props;
    // Adding column with Delete Row action
    const tableColumns = this.columns.concat({
      render: record => (
        <div>
          <HasAccess fn={() => canDelete(`grscicoll/collection/${collection.key}/descriptorGroup/${record.key}`)}>
            <ConfirmButton
              title={<div style={{ maxWidth: 400 }}>
                <FormattedMessage
                  id="delete.confirmation.deleteCollectionDescriptionGroup"
                  defaultMessage="Removing the dataset disassociates it with this collection and doesn't delete it. It may be added again in the future. Are you sure you wish to remove this dataset from the collection?"
                />
              </div>}
              onConfirm={() => this.handleDelete(record.key)}
              type={'danger'}
              btnText={<DeleteOutlined />}
            />
          </HasAccess>
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
            {/* We are checking if the user can edit the collection as a whole since tests against descriptor creation isn't working unless you do empty form posts */}
            <HasAccess fn={() => canUpdate(`grscicoll/collection/${collection.key}`)}>
              {!collection.deleted && (
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="add" defaultMessage="Add" />
                </Button>
              )}
            </HasAccess>
          </Col>
        </Row>
        <DataQuery
          api={query => getDescriptorGroup(collection.key, query)}
          initQuery={initQuery}
          render={props => <DataTable {...props} noHeader={true} columns={tableColumns} />}
        />

        <DescriptorGroupForm
          visible={isModalVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleSave}
        />
        {isEditModalVisible && <DescriptorGroupForm
          visible={isEditModalVisible}
          onCancel={this.handleEditCancel}
          onCreate={this.handleUpdate}
          groupKey={activeRecord?.key}
          record={activeRecord}
        />}
      </React.Fragment>
    );
  }
}

DescriptorGroups.propTypes = {
  collection: PropTypes.object.isRequired,
  addDescriptorGroup: PropTypes.func.isRequired,
  deleteDescriptorGroup: PropTypes.func.isRequired
};

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(DescriptorGroups);
