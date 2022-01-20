import React from 'react';
import PropTypes from 'prop-types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { List, Button, Row, Col, Tooltip } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// Wrappers
import { HasAccess } from '../../../auth';
import withContext from '../../../hoc/withContext';
// Components
import DefaultValueCreateForm from './MasterSourceCreateForm';
import { ConfirmButton, FormattedRelativeDate, DatasetTitle, OrganizationTitle } from '../../index';

class MasterSource extends React.Component {
  state = {
    isModalVisible: false,
    defaultValues: this.props.defaultValues || []
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  deleteValue = item => {
    this.props.deleteMasterSource().then(() => {
      // Updating default values
      this.props.refresh();
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenDeleted.defaultValue',
          defaultMessage: 'Default value has been deleted'
        })
      });
    }).catch(error => {
      debugger;
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  };

  handleSave = form => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.props.createMasterSource(values).then(response => {
        form.resetFields();
        this.props.refresh();
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.defaultValue',
            defaultMessage: 'Default value has been saved'
          })
        });

        this.setState({
          isModalVisible: false
        });
      }).catch(error => {
        debugger;
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
    });
  };

  render() {
    const { isModalVisible } = this.state;
    const { intl, entity = {} } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'delete.confirmation.masterSource',
      defaultMessage: 'Are you sure to remove the master source?'
    });

    const masterSourceMetadata = entity.masterSourceMetadata;
    let source = {};
    if (masterSourceMetadata) {
      if (masterSourceMetadata.source === 'DATASET') {
        source.title = <a href={`/dataset/${masterSourceMetadata.sourceId}`}>
          <DatasetTitle id={masterSourceMetadata.sourceId} />
        </a>
      } else if (masterSourceMetadata.source === 'ORGANIZATION') {
        source.title = <a href={`/organization/${masterSourceMetadata.sourceId}`}>
          <OrganizationTitle id={masterSourceMetadata.sourceId} />
        </a>
      } else if (masterSourceMetadata.source === 'IH_IRN') {
        source.title = <a href={`http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=${masterSourceMetadata.sourceId}`}>
          Index Herbariorum
        </a>
      }
    }

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col xs={12} sm={12} md={16}>
              <h2>
                <FormattedMessage id="masterSource" defaultMessage="Master source" />

                <Tooltip title={
                  <FormattedMessage
                    id="help.masterSource"
                    defaultMessage="Is the entity managed somewhere else. For example a dataset or in Index Herbariorum. When setting this, then the data will be managed by the source."
                  />
                }>
                  <QuestionCircleOutlined />
                </Tooltip>
              </h2>
            </Col>

            {!masterSourceMetadata && <Col xs={12} sm={12} md={8} className="text-right">
              <HasAccess fn={this.props.canCreate}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new" />
                </Button>
              </HasAccess>
            </Col>}
          </Row>

          {!masterSourceMetadata && <div>
            <FormattedMessage id="masterSource.nonConfigured" defaultMessage="No external master source" />
          </div>}
          {masterSourceMetadata && <List.Item actions={[
            <HasAccess fn={() => this.props.canDelete()}>
              <ConfirmButton
                title={confirmTitle}
                btnText={<FormattedMessage id="delete" defaultMessage="Delete" />}
                onConfirm={() => this.deleteValue()}
                type={'link'}
              />
            </HasAccess>
          ]}>
            <List.Item.Meta
              title={
                <React.Fragment>
                  <div className="item-title">
                    {source.title}
                  </div>
                  <div className="item-type">{masterSourceMetadata.source} : {masterSourceMetadata.sourceId}</div>
                </React.Fragment>
              }
              description={
                <span className="item-description">
                  <FormattedMessage
                    id="createdByRow"
                    defaultMessage={`Created {date} by {author}`}
                    values={{ date: <FormattedRelativeDate value={masterSourceMetadata.created} />, author: masterSourceMetadata.createdBy }}
                  />
                </span>
              }
            />
          </List.Item>}

          <DefaultValueCreateForm
            visible={isModalVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />
        </div>
      </React.Fragment>
    );
  }
}

MasterSource.propTypes = {
  createMasterSource: PropTypes.func,
  deleteMasterSource: PropTypes.func,
  updateCounts: PropTypes.func,
  canCreate: PropTypes.func.isRequired,
  canDelete: PropTypes.func.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(MasterSource));