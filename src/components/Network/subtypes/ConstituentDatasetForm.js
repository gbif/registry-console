import React from 'react';
import { Modal, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// API
import { getDatasetSuggestions } from '../../../api/dataset';
// Components
import ItemControl from '../../common/ItemControl';
import FormItem from '../../common/FormItem';

const ConstituentDatasetForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;

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
          <Form>
            <FormItem label={<FormattedMessage id="dataset" defaultMessage="Dataset"/>}>
              {getFieldDecorator('dataset', {})(
                <ItemControl
                  placeholder={<FormattedMessage id="select.dataset" defaultMessage="Select a dataset"/>}
                  delay={1000}
                  api={getDatasetSuggestions}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

ConstituentDatasetForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default ConstituentDatasetForm;