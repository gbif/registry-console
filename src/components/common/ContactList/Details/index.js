import React from 'react';
import { Modal, Form, Row, Col, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';

import ContactForm from './Form';
import ContactPresentation from './Presentation';
import PermissionWrapper from '../../../hoc/PermissionWrapper';

const ContactDetails = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    state = { edit: !this.props.data };

    render() {
      const { visible, onCancel, onCreate, form, data, uid } = this.props;

      return (
        <Modal
          visible={visible}
          title={<Row>
            <Col span={20}>
              {
                data ?
                  <FormattedMessage id="editContact" defaultMessage="Edit a contact"/> :
                  <FormattedMessage id="createNewContact" defaultMessage="Create a new contact"/>
              }
            </Col>
            <Col span={4} className="text-right">
              <PermissionWrapper uid={uid} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Switch
                  checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                  unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                  onChange={val => this.setState({ edit: val })}
                  checked={this.state.edit}
                />
              </PermissionWrapper>
            </Col>
          </Row>}
          okText={
            data ?
              <FormattedMessage id="edit" defaultMessage="Edit"/> :
              <FormattedMessage id="create" defaultMessage="Create"/>
          }
          onCancel={onCancel}
          onOk={() => onCreate(form)}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
          okButtonProps={{ disabled: !this.state.edit }}
        >
          {!this.state.edit && <ContactPresentation data={data}/>}
          {this.state.edit && <ContactForm form={form} data={data}/>}
        </Modal>
      );
    }
  }
);

export default ContactDetails;