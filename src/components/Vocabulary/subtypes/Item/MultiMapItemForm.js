import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Alert, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import withContext from '../../../hoc/withContext';
import _ from 'lodash'
// Components
import { FormItem } from '../../../common/index';
import TagControl from '../../../common/TagControl'


const {Option} = Select;
const MultiMapItemCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, itemName, item, vocabularyLanguages, error } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id={`manage${itemName}`} defaultMessage={`Manage ${itemName}`}/>}
          okText={<FormattedMessage id="save" defaultMessage="Save"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
        >
          <Form>
          
              <FormItem
              label={<FormattedMessage id="key" defaultMessage="Language"/>}
              helpText={
                <FormattedMessage
                  id={`help.${itemName}KeyExtra`}
                  defaultMessage={`The language for the ${itemName}`}
                />
              }
            >
              {getFieldDecorator('key', {
                rules: [{
                  required: true,
                  message: 'Please input a language'
                }],
                initialValue: _.get(item, 'key') ? item.key : undefined,
              })(
                <Select 
                showSearch
                disabled={item && item.key}
                > 
                  {vocabularyLanguages.map(l => <Option value={l.locale} key={l.locale}><FormattedMessage id={`vocabulary.language.${l.locale}`}/></Option>)}
                </Select>
              )}
            </FormItem>
            
           
        <FormItem label={<FormattedMessage id="values" defaultMessage="Values"/>}>
          {getFieldDecorator('values', {
            initialValue: _.get(item, 'value') || [],
          })(
            <TagControl label={<FormattedMessage id="newValue" defaultMessage="New"/>} removeAll={true}/>
          )}
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
  }
);

MultiMapItemCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired
};


const mapContextToProps = ({ vocabularyLanguages }) => ({ vocabularyLanguages });

export default withContext(mapContextToProps)(MultiMapItemCreateForm);
