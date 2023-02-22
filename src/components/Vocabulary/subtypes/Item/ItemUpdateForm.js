import React, {useEffect} from 'react';
import { Modal, Row, Col, Button, Form, Select, Input } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import withContext from '../../../hoc/withContext';
// Components
import { FormItem } from '../../../common';

const Option = Select.Option;
const TextArea = Input.TextArea;
const ItemUpdateModal = props => {
    const [form] = Form.useForm();
    const { onCancel, onSave, item, itemName, visible, vocabularyLanguages } = props;
    
    useEffect(() => {
      if (form) {
        form.setFieldsValue({
          value: props.item? props.item.value : null,
          language: props.item? props.item.language : null
       });
      }
    }, [item]);

    const getButtons = (item, onCancel, onSave, form) => {
      const buttons = [
        <Button key="reset" type='default' onClick={onCancel}>
          <FormattedMessage id="close" defaultMessage="Close" />
        </Button>
      ];
      buttons.push(
        <Button key="submit" type="primary" 
        onClick={() => onSave(form, { 'key': item.key, 
                                'value': form.getFieldValue('value'), 
                                'language': form.getFieldValue('language')})}>
          <FormattedMessage id="save" defaultMessage="Save" />
        </Button>
      );

      return buttons;
    };


      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id={`update${itemName}`} defaultMessage={`Updates a ${itemName}`}/>}
          footer={getButtons(item, onCancel, onSave, form)}
          onCancel={onCancel}
        >

          <Form form={form} initialValues={item}> 
              <FormItem            
              name='language'
              rules={[{
                required: true,
                message: 'Please input a language'
              }]}
              label={<FormattedMessage id="language" defaultMessage="Language"/>}
              helpText={
                <FormattedMessage
                  id={`help.KeyExtra`}
                  defaultMessage={`The language for the `}
                />
              }
            >
              <Select 
                disabled={true}
                showSearch
                optionFilterProp="children"
                placeholder={<FormattedMessage id="select.language" defaultMessage="Select a language"/>}
                filterOption={
                  (input, option) => {
                    // We need to translate language code before we'll be able to compare it with input
                    // const langTranslation = intl.formatMessage({ id: option.props.children.props.id, defaultMessage: '' });
                    const langTranslation = "en";
                    // if there is a translation for language code and it contains user's input then return true
                    return langTranslation && langTranslation.toLowerCase().includes(input.toLowerCase());
                  }
                }
                > 
                  {vocabularyLanguages.map(l => <Option value={l.locale} key={l.locale}><FormattedMessage id={`vocabulary.language.${l.locale}`}/></Option>)}
                </Select>
            </FormItem>
            
            <FormItem
              // initialValue={item ? item.value : null}
              name='value'
              rules={[{
                required: true,
                message: 'Please input a value'
              }]}
              label={<FormattedMessage id="value" defaultMessage="Value"/>}
              helpText={
                <FormattedMessage
                  id={`help.ValueExtra`}
                  defaultMessage={`The value for the `}
                />
              }
            >
              <TextArea rows={5} />
            </FormItem>
            
          </Form>

        </Modal>
      );
    
  }


ItemUpdateModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  contact: PropTypes.object
};

const mapContextToProps = ({ vocabularyLanguages }) => ({ vocabularyLanguages });

export default withContext(mapContextToProps)(ItemUpdateModal);