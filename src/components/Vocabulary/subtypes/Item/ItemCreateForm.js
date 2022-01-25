import React from 'react';
import { Modal, Input, Select, Alert, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import withContext from '../../../hoc/withContext';
import _ from 'lodash'
// Components
import { FormItem } from '../../../common/index';

const {Option} = Select;
  // eslint-disable-next-line
  const ItemCreateForm = props => {
      const [form] = Form.useForm();
      const { visible, onCancel, onCreate,  itemName, isMap, vocabularyLanguages, error, intl } = props;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id={`createNew${itemName}`} defaultMessage={`Create a new ${itemName}`}/>}
          okText={<FormattedMessage id="create" defaultMessage="Create"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
        >
          <Form form={form}>
            {isMap &&
              <FormItem
              name='key'
              rules={[{
                required: true,
                message: 'Please input a language'
              }]}
              label={<FormattedMessage id="key" defaultMessage="Language"/>}
              helpText={
                <FormattedMessage
                  id={`help.${itemName}KeyExtra`}
                  defaultMessage={`The language for the ${itemName}`}
                />
              }
            >
              <Select 
                showSearch
                optionFilterProp="children"
                placeholder={<FormattedMessage id="select.language" defaultMessage="Select a language"/>}
                filterOption={
                  (input, option) => {
                    // We need to translate language code before we'll be able to compare it with input
                    const langTranslation = intl.formatMessage({ id: option.props.children.props.id, defaultMessage: '' });
                    // if there is a translation for language code and it contains user's input then return true
                    return langTranslation && langTranslation.toLowerCase().includes(input.toLowerCase());
                  }
                }
                > 
                  {vocabularyLanguages.map(l => <Option value={l.locale} key={l.locale}><FormattedMessage id={`vocabulary.language.${l.locale}`}/></Option>)}
                </Select>
            </FormItem>
            }
            <FormItem
              name='value'
              rules={[{
                required: true,
                message: 'Please input a value'
              }]}
              label={<FormattedMessage id="value" defaultMessage="Value"/>}
              helpText={
                <FormattedMessage
                  id={`help.${itemName}ValueExtra`}
                  defaultMessage={`The value for the ${itemName}`}
                />
              }
            >
              <Input/>
            </FormItem>
          </Form>
          {error && (
              <Alert
                style={{marginTop: '5px'}}
                message={_.get(error, "response.data.error")}
                description={_.get(error, "response.data.message")}
                type="error"
                closable
              />
            )}
        </Modal>
      );
    
  }


ItemCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired
};


const mapContextToProps = ({ vocabularyLanguages }) => ({ vocabularyLanguages });

export default withContext(mapContextToProps)(injectIntl(ItemCreateForm));
