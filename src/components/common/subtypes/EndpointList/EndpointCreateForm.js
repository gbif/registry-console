import React, {useState, useEffect} from 'react';
import { Modal, Input, Select, Spin, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { getEndpointTypes } from '../../../../api/enumeration';
// Components
import { FormItem } from '../../index';
// Helpers
import { validateUrl } from '../../../util/validators';

  const EndpointCreateForm = props => {
    const [endpointTypes, setEndpointTypes] = useState([]);
    const [fetching, setFetching] = useState(true)
    const [form] = Form.useForm();
    useEffect(() =>{
      getEndpointTypes().then(types => {
        setEndpointTypes(types);
        setFetching(false)
      });
    }, [])

      const { visible, onCancel, onCreate } = props;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewEndpoint" defaultMessage="Create a new endpoint"/>}
          okText={<FormattedMessage id="create" defaultMessage="Create"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form form={form}>

            <FormItem name='type' rules={[{
                  required: true,
                  message: <FormattedMessage id="provide.type" defaultMessage="Please provide a type"/>
                }]} label={<FormattedMessage id="type" defaultMessage="Type"/>}>
               <Select
                  placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                >
                  {endpointTypes.map(endpointType => (
                    <Select.Option value={endpointType} key={endpointType}>{endpointType}</Select.Option>
                  ))}
                </Select>
            </FormItem>

            <FormItem name='url'  rules={[{
                  required: true,
                  message: <FormattedMessage id="provide.url" defaultMessage="Please provide a URL"/>
                }, {
                    validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid"/>)
                }]} label={<FormattedMessage id="url" defaultMessage="URL"/>}>
              <Input/>
            </FormItem>

            <FormItem name='description' label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            <Input/>
            </FormItem>
          </Form>
        </Modal>
      );
    
  }


EndpointCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default injectIntl(EndpointCreateForm);