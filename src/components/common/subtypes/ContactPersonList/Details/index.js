import React, {useState, useEffect} from 'react';
import { Modal, Row, Col, Switch, Button, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import ContactForm from './Form';
import ContactPresentation from './Presentation';

const ContactDetails = props => {
    const [form] = Form.useForm();
    const [edit, setEdit] = useState(!props.contact);
    const [hasUpdate, setHasUpdate] = useState(null)
    const { onCancel, onCreate, contact, user } = props;

    useEffect(() => {
        getPermissions();
    }, [user]);
    

    const getPermissions = async () => {
      if (!props.contact) return;
      //this.setState({ loadingPermissions: true });
      const hasUpdateResponse = await props.canUpdate(props.contact.key);
        setHasUpdate(hasUpdateResponse)
      return { hasUpdateResponse }
    }

    const getButtons = (contact, onCancel, onCreate, form) => {
      const buttons = [
        <Button key="reset" type={edit ? 'default' : 'primary'} onClick={onCancel}>
          <FormattedMessage id="close" defaultMessage="Close" />
        </Button>
      ];

      if (edit) {
        if (contact) {
          buttons.push(
            <Button key="submit" type="primary" onClick={() => onCreate(form)}>
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          );
        } else {
          buttons.push(
            <Button key="submit" type="primary" onClick={() => onCreate(form)}>
              <FormattedMessage id="create" defaultMessage="Create" />
            </Button>
          );
        }
      }

      return buttons;
    };



      return (
        <Modal
          visible={true}
          title={<Row type="flex">
          <Col span={16}>
            {
              contact ?
                <FormattedMessage id="details.contact" defaultMessage="Contact details" /> :
                <FormattedMessage id="createNewContact" defaultMessage="Create a new contact" />
            }
          </Col>
          <Col span={8} className="text-right">
            {contact && <Switch
              checkedChildren={hasUpdate ?  <FormattedMessage id='edit' defaultMessage="Edit" /> : <FormattedMessage id='suggest' defaultMessage="Suggest" />}
              unCheckedChildren={hasUpdate ?  <FormattedMessage id='edit' defaultMessage="Edit" /> : <FormattedMessage id='suggest' defaultMessage="Suggest" />}
              onChange={setEdit}
              checked={edit}
            />}
          </Col>
        </Row>}
          destroyOnClose={true}
          maskClosable={!edit}
          closable={false}
          footer={getButtons(contact, onCancel, onCreate, form)}
          onCancel={onCancel}
        >
          {!edit && <ContactPresentation contact={contact} />}
          {edit && <ContactForm form={form} contact={contact} />}
        </Modal>
      );
    
  }


ContactDetails.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  contact: PropTypes.object
};

export default ContactDetails;