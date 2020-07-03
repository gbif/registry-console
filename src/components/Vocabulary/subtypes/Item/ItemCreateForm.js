import React from 'react';
import { Modal, Form, Input, Select, Alert } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import withContext from '../../../hoc/withContext';
import _ from 'lodash'
// Components
import { FormItem } from '../../../common/index';

const {Option} = Select;
const ItemCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, itemName, isMap, vocabularyLanguages, error } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id={`createNew${itemName}`} defaultMessage={`Create a new ${itemName}`}/>}
          okText={<FormattedMessage id="create" defaultMessage="Create"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
        >
          <Form>
            {isMap &&
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
                }]
              })(
                <Select 
                showSearch
                > 
                  {vocabularyLanguages.map(l => <Option value={l.locale} key={l.locale}><FormattedMessage id={`vocabulary.language.${l.locale}`}/></Option>)}
                </Select>
              )}
            </FormItem>
            }
            <FormItem
              label={<FormattedMessage id="value" defaultMessage="Value"/>}
              helpText={
                <FormattedMessage
                  id={`help.${itemName}ValueExtra`}
                  defaultMessage={`The value for the ${itemName}`}
                />
              }
            >
              {getFieldDecorator('value', {
                rules: [{
                  required: true,
                  message: 'Please input a value'
                }]
              })(
                <Input/>
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

ItemCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired
};


const mapContextToProps = ({ vocabularyLanguages }) => ({ vocabularyLanguages });

export default withContext(mapContextToProps)(ItemCreateForm);
