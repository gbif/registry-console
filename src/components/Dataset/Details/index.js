import React from 'react';
import { Row, Col, Switch, Button, Popconfirm } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';

import { crawlDataset } from '../../../api/dataset';
import Presentation from './Presentation';
import Form from './Form';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.dataset === null
    };
  }

  crawl = key => {
    crawlDataset(key)
      .then(() => {
        this.props.addInfo({
          status: 200,
          statusText: this.props.intl.formatMessage({ id: 'info.crawling', defaultMessage: 'Dataset crawling' })
        });
      })
      .catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
  };

  onCancel = () => {
    if (this.props.dataset) {
      this.setState({ edit: false });
    } else {
      this.props.history.push('/dataset/search');
    }
  };

  render() {
    const { dataset, refresh, intl } = this.props;
    const message = dataset && dataset.publishingOrganization.endorsementApproved ?
      intl.formatMessage({
        id: 'endorsed.crawl.message',
        defaultMessage: 'This will trigger a crawl of the dataset.'
      }) :
      intl.formatMessage({
        id: 'notEndorsed.crawl.message',
        defaultMessage: 'This dataset\'s publishing organization is not endorsed yet! This will trigger a crawl of the dataset, and should only be done in a 1_2_27 environment'
      });

    return (
      <React.Fragment>
        <div className="item-details">
          <span className="help"><FormattedMessage id="dataset" defaultMessage="Dataset"/></span>
          <h2>{dataset ? dataset.title : <FormattedMessage id="newDataset" defaultMessage="New dataset"/>}</h2>

          <PermissionWrapper item={dataset} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
            {dataset && <Row className="item-btn-panel">
              <Col span={20}>
                <Switch
                  checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                  unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                  onChange={(val) => this.setState({ edit: val })}
                  checked={this.state.edit}
                />
              </Col>
              <Col span={4} className="text-right">
                {!this.state.edit && (
                  <Popconfirm
                    placement="topRight"
                    title={message}
                    onConfirm={() => this.crawl(dataset.key)}
                    okText={<FormattedMessage id="crawl" defaultMessage="Crawl"/>}
                    cancelText={<FormattedMessage id="no" defaultMessage="No"/>}
                  >
                    <Button type="primary" htmlType="button">
                      <FormattedMessage id="crawl" defaultMessage="Crawl"/>
                    </Button>
                  </Popconfirm>
                )}
              </Col>
            </Row>}
          </PermissionWrapper>
          {!this.state.edit && <Presentation dataset={dataset}/>}
          {this.state.edit && (
            <Form
              dataset={dataset}
              onSubmit={key => {
                this.setState({ edit: false });
                refresh(key);
              }}
              onCancel={this.onCancel}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError, addInfo }) => ({ addError, addInfo });

export default withContext(mapContextToProps)(injectIntl(withRouter(Details)));