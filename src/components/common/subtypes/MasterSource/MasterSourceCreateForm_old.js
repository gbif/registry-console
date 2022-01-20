import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Select } from 'antd';
import { FormattedMessage } from 'react-intl';

// Components
import { FormItem } from '../../index';

import { getSourceTypes } from '../../../../api/enumeration';

const MasterSourceCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
      };
    }

    async componentDidMount() {
      // A special flag to indicate if a component was mount/unmount
      this._isMount = true;

      const masterSourceTypes = await getSourceTypes();
      this.setState({ masterSourceTypes });
    }

    componentWillUnmount() {
      // A special flag to indicate if a component was mount/unmount
      this._isMount = false;
    }

    render() {
      const { masterSourceTypes = [] } = this.state;
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewMasterSource" defaultMessage="Define a new master source" />}
          okText={<FormattedMessage id="create" defaultMessage="Create" />}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form>
            <FormItem
              label={<FormattedMessage id="source" defaultMessage="Source" />}
              helpText={
                <FormattedMessage
                  id="help.masterSource.source"
                  defaultMessage="What is the type of source to use as a primary copy"
                />
              }
            >
              {getFieldDecorator('source', {
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.masterSource.source" defaultMessage="Please provide a type" />
                }]
              })(
                <Select
                  placeholder={<FormattedMessage id="select.masterSource.source" defaultMessage="Select a source type" />}
                >
                  {masterSourceTypes.map(type => (
                    <Select.Option value={type} key={type}>
                      <FormattedMessage id={`masterSource.types.${type}`} />
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem
              label={<FormattedMessage id="sourceId" defaultMessage="Source ID" />}
              helpText={
                <FormattedMessage
                  id="help.masterSource.sourceId"
                  defaultMessage="What identifier to use. E.g. UUID for a dataset. Or IRN for Index Herbariorum."
                />
              }
            >
              {getFieldDecorator('sourceId', {
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.masterSource.sourceId" defaultMessage="Please provide an identifier for the type. E.g. a UUID" />
                }]
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

MasterSourceCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default MasterSourceCreateForm;