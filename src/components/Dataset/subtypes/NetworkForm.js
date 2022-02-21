import React from 'react';
import { Modal, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// API
import { searchNetwork } from '../../../api/network';
// Components
import ItemControl from '../../common/ItemControl';
import FormItem from '../../common/FormItem';


const NetworkForm = props => {
  const { onCancel, onCreate } = props;
  const [form] = Form.useForm()
  
  // Just a wrapper for API method to standardise returning data  
    const suggestedNetworks = (query) => {
      return searchNetwork(query).then(response => {
        return { data: response.data.results };
      });
    }

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
          <Form form={form}>
            <FormItem name='network' label={<FormattedMessage id="network" defaultMessage="Network"/>}>
            <ItemControl
                  placeholder={<FormattedMessage id="select.network" defaultMessage="Select a network"/>}
                  delay={1000}
                  api={suggestedNetworks}
                />
            </FormItem>
          </Form>
        </Modal>
      );
    
  }


NetworkForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default NetworkForm;