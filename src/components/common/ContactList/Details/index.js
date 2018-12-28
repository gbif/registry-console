import React from 'react';
import { Modal, Form, Row, Col, Switch, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Wrappers
import PermissionWrapper from '../../../hoc/PermissionWrapper';
// Components
import ContactForm from './Form';
import ContactPresentation from './Presentation';

const ContactDetails = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    state = { edit: !this.props.data };

    getButtons = (data, onCancel, onCreate, form) => {
      const buttons = [
        <Button key="reset" type={this.state.edit ? 'default' : 'primary'} onClick={onCancel}>
          <FormattedMessage id="close" defaultMessage="Close"/>
        </Button>
      ];

      if (this.state.edit) {
        if (data) {
          buttons.push(
            <Button key="submit" type="primary" onClick={() => onCreate(form)}>
              <FormattedMessage id="edit" defaultMessage="Edit"/>
            </Button>
          );
        } else {
              buttons.push(
                <Button key="submit" type="primary" onClick={() => onCreate(form)}>
                  <FormattedMessage id="create" defaultMessage="Create"/>
                </Button>
              );
        }
      }

      return buttons;
    };

    render() {
      const { visible, onCancel, onCreate, form, data, uid } = this.props;

      return (
        <Modal
          visible={visible}
          title={<Row>
            <Col span={20}>
              {
                data ?
                  <FormattedMessage id="details.contact" defaultMessage="Contact details"/> :
                  <FormattedMessage id="createNewContact" defaultMessage="Create a new contact"/>
              }
            </Col>
            <Col span={4} className="text-right">
              {data && (
                <PermissionWrapper uid={uid} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <Switch
                    checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    onChange={val => this.setState({ edit: val })}
                    checked={this.state.edit}
                  />
                </PermissionWrapper>
              )}
            </Col>
          </Row>}
          destroyOnClose={true}
          maskClosable={!this.state.edit}
          closable={false}
          footer={this.getButtons(data, onCancel, onCreate, form)}
          onCancel={onCancel}
        >
          {!this.state.edit && <ContactPresentation data={data}/>}
          {this.state.edit && <ContactForm form={form} data={data}/>}
        </Modal>
      );
    }
  }
);

ContactDetails.propTypes = {
  uid: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  data: PropTypes.object
};

export default ContactDetails;