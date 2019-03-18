import { Button, Col, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { getConstituentDataset } from '../../../api/network';
// Configuration
import { standardColumns } from '../../search/columns';
// Components
import { HasRole, roles } from '../../auth';
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
    const { network, initQuery = { limit: 25, offset: 0 } } = this.props;

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <Col span={20}>
            <h2>
              <FormattedMessage id="datasetConstituent" defaultMessage="Constituent datasets"/>
            </h2>
          </Col>
          <Col span={4} className="text-right">
            <HasRole roles={[roles.REGISTRY_ADMIN]}>
              {!network.deleted && (
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="add" defaultMessage="Add"/>
                </Button>
              )}
            </HasRole>
          </Col>
        </Row>
        <DataQuery
          api={query => getConstituentDataset(network.key, query)}
          initQuery={initQuery}
          render={props => <DataTable {...props} noHeader={true} columns={columns}/>}
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
  network: PropTypes.object.isRequired,
  addDataset: PropTypes.func.isRequired,
  deleteDataset: PropTypes.func.isRequired
};

export default ConstituentDatasets;