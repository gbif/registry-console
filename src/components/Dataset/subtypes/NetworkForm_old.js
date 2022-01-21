import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// API
import { searchNetwork } from '../../../api/network';
// Components
import ItemControl from '../../common/ItemControl';
import FormItem from '../../common/FormItem';

const NetworkForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    // Just a wrapper for API method to standardise returning data
    suggestedNetworks(query) {
      return searchNetwork(query).then(response => {
        return { data: response.data.results };
      });
    }

    render() {
      const { onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={true}
          title={<FormattedMessage id="addNetwork" defaultMessage="Add a network"/>}
          okText={<FormattedMessage id="add" defaultMessage="Add"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form>
            <FormItem label={<FormattedMessage id="network" defaultMessage="Network"/>}>
              {getFieldDecorator('network', {})(
                <ItemControl
                  placeholder={<FormattedMessage id="select.network" defaultMessage="Select a network"/>}
                  delay={1000}
                  api={this.suggestedNetworks}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

NetworkForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default NetworkForm;