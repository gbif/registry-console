import { Button, Col, Row } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { DeleteOutlined } from '@ant-design/icons';

// APIs
import { getDescriptorGroup } from '../../../api/collection';
import { canDelete, checkPermissions } from '../../../api/permissions';
import ConfirmButton from '../../common/ConfirmButton';
// Configuration
import { standardColumns } from '../../search/columns';
// Wrappers
import { HasAccess } from '../../auth';
// Components
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';
import DescriptorGroupForm from './DescriptorGroupForm';

const columns = [
  {
    title: <FormattedMessage id="about" defaultMessage="About" />,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <div>
      <h4>{text}</h4>
      <div style={{ marginBottom: 12 }}>{record.description}</div>
      <Button type='primary' style={{ marginRight: 8 }}>
        <FormattedMessage id="download" defaultMessage="Download" />
      </Button>
      <HasAccess fn={() => 
        checkPermissions({
          resource: `grscicoll/collection/${record.collectionKey}/descriptorGroup/${record.key}`, 
          method: 'put', 
          headers: { 'Content-Type': 'multipart/form-data' }
        })}>
        <Button type='outline'>
          <FormattedMessage id="edit" defaultMessage="Edit" />
        </Button>
      </HasAccess>
    </div>
  },
  ...standardColumns
];

class DescriptorGroups extends React.Component {
  state = { isModalVisible: false };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
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

  render() {
    const { isModalVisible } = this.state;
    const { collection, initQuery = { limit: 25, offset: 0 } } = this.props;
    // Adding column with Delete Row action
    const tableColumns = columns.concat({
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
            <HasAccess fn={() => checkPermissions({
                resource: `grscicoll/collection/${collection.key}/descriptorGroup`, 
                method: 'post', 
                headers: { 'Content-Type': 'multipart/form-data' }
              })}>
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
      </React.Fragment>
    );
  }
}

DescriptorGroups.propTypes = {
  uuids: PropTypes.array.isRequired,
  collection: PropTypes.object.isRequired,
  addDescriptorGroup: PropTypes.func.isRequired,
  deleteDescriptorGroup: PropTypes.func.isRequired
};

export default DescriptorGroups;
