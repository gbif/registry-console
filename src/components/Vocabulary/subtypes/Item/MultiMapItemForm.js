import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import withContext from '../../../hoc/withContext';

// Components
import { FormItem } from '../../../common/index';
import TagControl from '../../../common/TagControl'

const {Option} = Select;
const MultiMapItemCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, itemName, item, languages } = this.props;
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
                initialValue: item.key,
              })(
                <Select 
                showSearch
                disabled={item.key}
                > 
                  {languages.map(l => <Option value={l} key={l}><FormattedMessage id={`language.${l}`}/></Option>)}
                </Select>
              )}
            </FormItem>
            
           
        <FormItem label={<FormattedMessage id="values" defaultMessage="Values"/>}>
          {getFieldDecorator('values', {
            initialValue: item.value || [],
          })(
            <TagControl label={<FormattedMessage id="newValue" defaultMessage="New"/>} removeAll={false}/>
          )}
        </FormItem>
          </Form>
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


const mapContextToProps = ({ languages }) => ({ languages });

export default withContext(mapContextToProps)(MultiMapItemCreateForm);
