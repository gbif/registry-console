import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Select, Form } from 'antd';
import { FormattedMessage } from 'react-intl';

// Components
import { FormItem } from '../../index';

import { getSourceTypes } from '../../../../api/enumeration';

  const MasterSourceCreateForm = props =>  {
    const [form] = Form.useForm();
    const [masterSourceTypes, setMasterSourceTypes] = useState([])
    
    useEffect( () => {
      const getData = async () => {
        const res = await getSourceTypes()
      setMasterSourceTypes(res);
      }
      getData()
    }, [])
 
      const { visible, onCancel, onCreate } = props;

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
          <Form form={form}> 
            <FormItem
            name='source'
            rules={[{
              required: true,
              message: <FormattedMessage id="provide.masterSource.source" defaultMessage="Please provide a type" />
            }]}
              label={<FormattedMessage id="source" defaultMessage="Source" />}
              helpText={
                <FormattedMessage
                  id="help.masterSource.source"
                  defaultMessage="What is the type of source to use as a primary copy"
                />
              }
            >
               <Select
                  placeholder={<FormattedMessage id="select.masterSource.source" defaultMessage="Select a source type" />}
                >
                  {masterSourceTypes.map(type => (
                    <Select.Option value={type} key={type}>
                      <FormattedMessage id={`masterSource.types.${type}`} />
                    </Select.Option>
                  ))}
                </Select>
            </FormItem>

            <FormItem
            name='sourceId'
            rules={[{
              required: true,
              message: <FormattedMessage id="provide.masterSource.sourceId" defaultMessage="Please provide an identifier for the type. E.g. a UUID" />
            }]}
              label={<FormattedMessage id="sourceId" defaultMessage="Source ID" />}
              helpText={
                <FormattedMessage
                  id="help.masterSource.sourceId"
                  defaultMessage="What identifier to use. E.g. UUID for a dataset. Or IRN for Index Herbariorum."
                />
              }
            >
              <Input />
            </FormItem>
          </Form>
        </Modal>
      );
    
  }


MasterSourceCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default MasterSourceCreateForm;