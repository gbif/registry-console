import React from 'react';
import { Modal, Form, Input, Select, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { getIdentifierTypes } from '../../../api/enumeration';
// Components
import { FormItem } from '../../widgets';

const IdentifierCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      identifierTypes: [],
      fetching: true
    };

    componentDidMount() {
      getIdentifierTypes().then(identifierTypes => {
        this.setState({
          identifierTypes,
          fetching: false
        });
      });
    }

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const { identifierTypes, fetching } = this.state;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewIdentifier" defaultMessage="Create a new identifier"/>}
          okText={<FormattedMessage id="create" defaultMessage="Create"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form>

            <FormItem
              label={<FormattedMessage id="identifier" defaultMessage="Identifier"/>}
              helpText={
                <FormattedMessage
                  id="extra.identifier"
                  defaultMessage="The value for the identifier (e.g. doi://12.123/123)."
                />
              }
            >
              {getFieldDecorator('identifier', {
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.identifier" defaultMessage="Please provide an identifier"/>
                }]
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem
              label={<FormattedMessage id="type" defaultMessage="Type"/>}
              helpText={
                <FormattedMessage id="extra.identifierType" defaultMessage="Select the type of the identifier."/>
              }
            >
              {getFieldDecorator('type')(
                <Select
                  placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}
                  notFoundContent={fetching ? <Spin size="small"/> : null}
                >
                  {identifierTypes.map(identifierType => (
                    <Select.Option value={identifierType} key={identifierType}>{identifierType}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

IdentifierCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default IdentifierCreateForm;