import React from 'react';
import { Modal, Form, Input, Select, Spin } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { getEndpointTypes } from '../../../api/enumeration';
// Components
import { FormItem } from '../../widgets';
// Helpers
import { validateUrl } from '../../helpers';

const EndpointCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      endpointTypes: [],
      fetching: true
    };

    componentDidMount() {
      getEndpointTypes().then(endpointTypes => {
        this.setState({
          endpointTypes,
          fetching: false
        });
      });
    }

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const { endpointTypes, fetching } = this.state;

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
          <Form>

            <FormItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
              {getFieldDecorator('type', {
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.type" defaultMessage="Please provide a type"/>
                }]
              })(
                <Select
                  placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                >
                  {endpointTypes.map(endpointType => (
                    <Select.Option value={endpointType} key={endpointType}>{endpointType}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem label={<FormattedMessage id="url" defaultMessage="URL"/>}>
              {getFieldDecorator('url', {
                rules: [{
                  required: true,
                  message: <FormattedMessage id="provide.url" defaultMessage="Please provide a URL"/>
                }, {
                    validator: validateUrl(<FormattedMessage id="invalid.url" defaultMessage="URL is invalid"/>)
                }]
              })(
                <Input/>
              )}
            </FormItem>

            <FormItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
              {getFieldDecorator('description')(
                <Input/>
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

EndpointCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default injectIntl(EndpointCreateForm);