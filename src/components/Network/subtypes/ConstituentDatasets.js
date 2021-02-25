import { Button, Col, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { getConstituentDataset } from '../../../api/network';
import { canUpdate } from '../../../api/permissions';
import ConfirmButton from '../../common/ConfirmButton';
// Configuration
import { standardColumns } from '../../search/columns';
// Wrappers
import { HasAccess } from '../../auth';
// Components
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';
import ConstituentDatasetForm from './ConstituentDatasetForm';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/dataset/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

class ConstituentDatasets extends React.Component {
  state = { isModalVisible: false };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  handleDelete = key => {
    this.props.deleteDataset(this.props.network.key, key);
  };

  handleSave = form => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const selectedDataset = JSON.parse(values.dataset);
      this.props.addDataset(this.props.network.key, selectedDataset);
    });
  };

  render() {
    const { isModalVisible } = this.state;
    const { network, uuids, initQuery = { limit: 25, offset: 0 } } = this.props;
    // Adding column with Delete Dataset action
    const tableColumns = columns.concat({
      render: record => (
        <ConfirmButton
          title={<FormattedMessage
            id="delete.confirmation.dataset"
            defaultMessage="Are you sure to delete this dataset?"
          />}
          onConfirm={() => this.handleDelete(record.key)}
          iconType={'delete'}
          type={'icon'}
        />
      )
    });

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <Col span={20}>
            <h2>
              <FormattedMessage id="datasetConstituent" defaultMessage="Constituent datasets"/>
            </h2>
          </Col>
          <Col span={4} className="text-right">
            <HasAccess fn={() => canUpdate(`network/${network.key}`)}>
              {!network.deleted && (
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="add" defaultMessage="Add"/>
                </Button>
              )}
            </HasAccess>
          </Col>
        </Row>
        <DataQuery
          api={query => getConstituentDataset(network.key, query)}
          initQuery={initQuery}
          render={props => <DataTable {...props} noHeader={true} columns={tableColumns}/>}
        />

        {isModalVisible && (
          <ConstituentDatasetForm
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />
        )}
      </React.Fragment>
    );
  }
}

ConstituentDatasets.propTypes = {
  uuids: PropTypes.array.isRequired,
  network: PropTypes.object.isRequired,
  addDataset: PropTypes.func.isRequired,
  deleteDataset: PropTypes.func.isRequired
};

export default ConstituentDatasets;
