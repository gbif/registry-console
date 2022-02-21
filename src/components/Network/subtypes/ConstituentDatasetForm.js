import React from 'react';
import { Modal, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// API
import { getDatasetSuggestions } from '../../../api/dataset';
// Components
import ItemControl from '../../common/ItemControl';
import FormItem from '../../common/FormItem';

const ConstituentDatasetForm = props => {
      const { onCancel, onCreate } = props;
      const [form] = Form.useForm()

      return (
        <Modal
          visible={true}
          title={<FormattedMessage id="addDataset" defaultMessage="Add a dataset"/>}
          okText={<FormattedMessage id="add" defaultMessage="Add"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form form={form} initialValues={{dataset:{}}}>
            <FormItem name='dataset' label={<FormattedMessage id="dataset" defaultMessage="Dataset"/>}>
                <ItemControl
                  placeholder={<FormattedMessage id="select.dataset" defaultMessage="Select a dataset"/>}
                  delay={1000}
                  api={getDatasetSuggestions}
                />
            </FormItem>
          </Form>
        </Modal>
      );
    
  }


ConstituentDatasetForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default ConstituentDatasetForm;