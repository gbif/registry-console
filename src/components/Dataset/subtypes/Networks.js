import { Button, Col, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { getNetworks } from '../../../api/dataset';
import { HasRole, roles } from '../../auth';
import ConfirmButton from '../../common/ConfirmButton';
// Configuration
import { standardColumns } from '../../search/columns';
// Components
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';
import NetworkForm from './NetworkForm';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/network/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

class Networks extends React.Component {
  state = { isModalVisible: false };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  handleDelete = key => {
    this.props.deleteFromNetwork(key, this.props.dataset.key);
  };

  handleSave = form => {
    form.validateFields().then(( values) => {

      const selectedNetwork = JSON.parse(values.network);
      this.props.addToNetwork(selectedNetwork.key, this.props.dataset);
    });
  };

  render() {
    const { isModalVisible } = this.state;
    const { dataset } = this.props;
    // Adding column with Delete Dataset action
    const tableColumns = columns.concat({
      render: record => (
        <ConfirmButton
          title={<FormattedMessage
            id="delete.confirmation.fromNetwork"
            defaultMessage="Are you sure to delete dataset from this network?"
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
              <FormattedMessage id="networks" defaultMessage="Networks"/>
            </h2>
          </Col>
          <Col span={4} className="text-right">
            <HasRole roles={[roles.REGISTRY_ADMIN]}>
              {!dataset.deleted && (
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="add" defaultMessage="Add"/>
                </Button>
              )}
            </HasRole>
          </Col>
        </Row>
        <DataQuery
          api={() => getNetworks(dataset.key)}
          initQuery={{}}
          render={props => <DataTable {...props} noHeader={true} columns={tableColumns} />}
        />

        {isModalVisible && (
          <NetworkForm
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />
        )}
      </React.Fragment>
    );
  }
}

Networks.propTypes = {
  dataset: PropTypes.object.isRequired,
  addToNetwork: PropTypes.func.isRequired,
  deleteFromNetwork: PropTypes.func.isRequired
};

export default Networks;